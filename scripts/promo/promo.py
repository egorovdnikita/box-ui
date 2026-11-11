#!/usr/bin/env python3
"""Промо-ролик box-ui для README: настоящий Storybook, камера и клики.

    python3 scripts/promo/promo.py ПАПКА [--storybook apps/storybook/storybook-static]
                                         [--only-compose] [--keys-only]

1. Захват. Playwright открывает собранный Storybook (локальный сервер на 127.0.0.1) в Chromium
   1440 × 810, Retina 2x, и проходит сценарий настоящими кликами мыши и вводом с клавиатуры.
   После каждого шага — снимок окна в ПАПКА/shots/, точки кликов измеряются по прямоугольникам
   настоящих элементов. Сценарий и тайминги — ПАПКА/script.json.
2. Монтаж. Снимки кладутся окном на фон GitHub Dark, камера плавно приближает зону действия,
   клики показаны кольцами, курсора нет. Смена состояния — короткое растворение, как переходы CSS.
   Последний кадр совпадает с первым: сценарий возвращает Storybook в исходное состояние.
   Итог — ПАПКА/box-ui-demo.webp и контрольные кадры ПАПКА/keys/ с шагом 0,5 с.

Нужны playwright (с Chromium) и Pillow. Данные — только содержимое Storybook.
"""
import argparse
import functools
import http.server
import json
import math
import threading
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

FPS = 30
OUT_W, OUT_H = 1600, 900            # кадр ролика
VW, VH = 1440, 810                  # окно Storybook, CSS px
DPR = 2                             # снимки в 2x: камера приближает без потери резкости
WIN_X, WIN_Y = (OUT_W - VW) // 2, (OUT_H - VH) // 2
WIN_RADIUS = 12
OUTER_RADIUS = 25                   # 20 pt при 1,25 px/pt, как у Agent Pulse
BG = "#0d1117"
EDGE = "#3d444d"
FADE = 0.14                         # растворение при смене состояния, с
PARK = (150, 790)                   # мышь после клика — пустой низ боковой панели, без наведения

REPO = Path(__file__).resolve().parents[2]


# ---------- кривые (как в промо Agent Pulse) ----------

def cubic_in_out(t):
    t = min(max(t, 0.0), 1.0)
    return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2


def cubic_out(t):
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 3


def camera_progress(elapsed, duration=.9):
    """Основной ход ~0,45 с, один мягкий перелёт ~1%, покой к концу хода."""
    if elapsed <= 0:
        return 0.0
    if elapsed >= duration:
        return 1.0
    t = elapsed / duration * .75
    value = 1 - math.exp(-11 * t) * (math.cos(8 * t) + (11 / 8) * math.sin(8 * t))
    blend = cubic_in_out((t - .60) / .15)
    return value * (1 - blend) + blend


def tap_state(rel):
    """Кольцо касания: радиус / максимум, прозрачность, отверстие / радиус."""
    hole = .58
    if rel < -.37 or rel > .28:
        return 0.0, 0.0, hole
    if rel < -.17:
        p = (rel + .37) / .20
        return .45 + .55 * cubic_out(p), cubic_in_out(p / .6), hole
    if rel < 0:
        p = (rel + .17) / .17
        return 1 - .5 * cubic_in_out(p), 1.0, hole
    p = rel / .28
    return .5 + .24 * cubic_out(p), 1 - cubic_in_out(p), hole + .2 * cubic_in_out(p)


# ---------- захват ----------

def serve(root, port=6199):
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    http.server.ThreadingHTTPServer.allow_reuse_address = True
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{port}", server


class Recorder:
    """Шаги сценария: клик по настоящему элементу → снимок. Камера задаётся в CSS px окна."""

    def __init__(self, page, folder):
        self.page = page
        self.frame = page.frame_locator("#storybook-preview-iframe")
        self.shots = folder / "shots"
        self.shots.mkdir(parents=True, exist_ok=True)
        for old in self.shots.glob("*.png"):
            old.unlink()
        self.beats = []

    def snap(self, settle=450):
        self.page.mouse.move(*PARK)
        self.page.wait_for_timeout(settle)
        # Фокус после клика в боковой панели прокручивает документ менеджера на 1 px.
        moved = self.page.evaluate("""() => [...document.querySelectorAll('*')]
            .filter((e) => e.scrollTop > 0 && e.scrollTop < 3)
            .map((e) => { const s = e.tagName + '#' + e.id + '.' + e.className + ' ' + e.scrollTop; e.scrollTop = 0; return s; })""")
        if moved:
            print("Сдвиг документа сброшен:", moved)
        self.page.wait_for_timeout(50)
        index = len(self.beats)
        path = self.shots / f"{index:03d}.png"
        self.page.screenshot(path=str(path))
        return path.name

    def center(self, locator):
        locator.wait_for(state="visible")
        box = locator.bounding_box()
        return box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, box

    def beat(self, *, click=None, typed=None, view=None, pre=None, hold=1.0, settle=450, note=""):
        """click — локатор; typed — строка, набирается посимвольно, каждый символ — отдельный снимок."""
        point = rect = None
        if click is not None:
            x, y, rect = self.center(click)
            self.page.mouse.click(x, y)
            point = (x, y)
        if typed is not None:
            first = True
            for ch in typed:
                self.page.keyboard.type(ch)
                shot = self.snap(160)
                self.beats.append({"shot": shot, "click": point if first else None, "rect": rect if first else None,
                                   "view": view if first else None, "pre": (pre if first else .0) if pre is not None else (.7 if first else 0),
                                   "hold": .12, "note": f"{note}: {ch}"})
                first = False
            self.beats[-1]["hold"] = hold
            return
        shot = self.snap(settle)
        self.beats.append({"shot": shot, "click": point, "rect": rect, "view": view, "pre": pre,
                           "hold": hold, "note": note})


def capture(folder, storybook):
    from playwright.sync_api import sync_playwright

    url, server = serve(storybook)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": VW, "height": VH}, device_scale_factor=DPR,
                                    color_scheme="dark", locale="ru-RU")
            sb = page
            f = page.frame_locator("#storybook-preview-iframe")

            def story(sid):
                page.goto(f"{url}/?path=/story/{sid}")
                f.locator(".sb-doc__chip:visible, .sb-icon-tile__art:visible").first.wait_for(state="visible")
                page.wait_for_timeout(1200)

            # Прогрев: сценарий проходит через Primitives · Color, и Storybook раскрывает эту группу
            # в дереве. Раскрываем её заранее, чтобы первый и последний кадры совпадали.
            story("tokens-system--themes")
            sb.locator('[data-item-id="токены-primitives"]').click()
            page.wait_for_timeout(800)
            sb.locator('[data-item-id="tokens-system--themes"]').click()
            f.locator(".sb-doc__chip:visible").first.wait_for(state="visible")
            page.wait_for_timeout(1200)

            modes = sb.locator('button:has-text("Моды")').first
            rec = Recorder(page, folder)
            # Камера: «wide» — весь холст, иначе прямоугольник окна (left, top, ширина) в CSS px, 16:9.
            WIDE, MODES, TABLE = "wide", (0, 0, 1040), (0, 0, 1200)

            rec.beat(view=WIDE, hold=2.2, note="System · Theme, тёмная тема")
            rec.beat(click=modes, view=MODES, pre=.85, hold=1.1, note="Открыть «Моды»")
            rec.beat(click=sb.locator('[aria-label="Тема"] button:has-text("Light")'), hold=1.3, note="Тема → Light")
            rec.beat(click=sb.locator('[aria-label="Иконки"] button:has-text("Linear")'), hold=1.0,
                     note="Иконки → Linear")
            # Повторный клик по «Моды» попадает в подложку поповера и закрывает его.
            x, y, _ = rec.center(modes)
            page.mouse.click(x, y)
            shot = rec.snap()
            rec.beats.append({"shot": shot, "click": (x, y), "rect": None, "view": WIDE, "pre": .35,
                              "hold": 1.3, "note": "Закрыть «Моды»"})

            chip = f.locator(".sb-doc__chip", has_text="color/neutral/100").first
            rec.beat(click=chip, view=TABLE, pre=.9, hold=1.6, settle=900,
                     note="Алиас → System · Color")
            chip2 = f.locator(".sb-doc__cell--focused").first.locator("xpath=following-sibling::*[1]").locator(".sb-doc__chip")
            rec.beat(click=chip2, hold=1.6, settle=900, note="Алиас → Primitives · Color")
            code = f.locator(".sb-doc__cell--focused ~ .sb-doc__cell .sb-doc__code").first
            rec.beat(click=code, pre=.6, hold=1.5, settle=250, note="Копировать var()")
            rec.beat(pre=.0, hold=.3, settle=1900, note="Подсказка гаснет")

            rec.beat(click=sb.locator('[data-item-id="icons-system--system"]').first,
                     view=WIDE, pre=.6, hold=1.2, settle=1400, note="Иконки · System")
            search = f.locator('input[placeholder="Имя или категория"]')
            x, y, rect = rec.center(search)
            page.mouse.click(x, y)
            rec.beat(typed="heart", view=(300, 40, 1000), pre=.9, hold=1.0, note="Поиск")
            rec.beats[-5]["click"], rec.beats[-5]["rect"] = (x, y), rect
            rec.beat(click=f.locator(".sb-icon-tile", has_text="Heart").filter(has_text="Heart").nth(4),
                     view=(300, 191, 1100), pre=.8, hold=1.2, note="Инспектор Heart")
            styles = f.locator(".sb-inspector__style")
            rec.beat(click=styles.nth(2), hold=.9, note="Broken")
            rec.beat(click=styles.nth(3), hold=.9, note="Line Duotone")
            rec.beat(click=styles.nth(1), hold=.9, note="Bold Duotone")
            rec.beat(click=styles.nth(5), hold=1.1, note="Outline")
            rec.beat(click=f.locator('.sb-inspector button[aria-label]').last, view=WIDE, pre=.6,
                     hold=.9, note="Закрыть инспектор")
            rec.beat(click=f.locator('button:has-text("Сбросить")'), hold=1.1, note="Сбросить фильтры")

            rec.beat(click=modes, view=MODES, pre=.8, hold=.9, note="Открыть «Моды»")
            rec.beat(click=sb.locator('button:has-text("Сбросить")'), hold=1.1, note="Сбросить моды")
            x, y, _ = rec.center(modes)
            page.mouse.click(x, y)
            shot = rec.snap()
            rec.beats.append({"shot": shot, "click": (x, y), "rect": None, "view": WIDE, "pre": .35,
                              "hold": .8, "note": "Закрыть «Моды»"})
            rec.beat(click=sb.locator('[data-item-id="tokens-system--themes"]').first,
                     pre=.5, hold=1.0, settle=1400, note="Назад к System · Theme")
            browser.close()
    finally:
        server.shutdown()

    script = {"viewport": [VW, VH], "dpr": DPR, "beats": rec.beats}
    (folder / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=1))
    return script


# ---------- монтаж ----------

def view_rect(view):
    """«wide» или (left, top, ширина) в CSS px окна → видимая область холста (x0, y0, ширина)."""
    if view == "wide":
        return (0.0, 0.0, float(OUT_W))
    left, top, w = view
    h = w * OUT_H / OUT_W
    x0 = min(max(WIN_X + left, 0), OUT_W - w)
    y0 = min(max(WIN_Y + top, 0), OUT_H - h)
    # Внутри окна: камера не показывает фон под нижним краем при приближении.
    y0 = min(y0, WIN_Y + VH - h) if h <= VH else y0
    x0 = min(x0, WIN_X + VW - w) if w <= VW else x0
    return (x0, y0, w)


def timeline(script):
    """Абсолютное время: смены снимков, клики, ходы камеры."""
    t = 0.0
    changes, clicks, camera = [], [], []
    for i, b in enumerate(script["beats"]):
        pre = b["pre"] if b["pre"] is not None else (.75 if b["view"] and i else .45 if b["click"] else 0)
        if i == 0:
            pre = 0.0
        if b["view"]:
            camera.append((t, view_rect(b["view"])))
        t_change = t + pre
        changes.append((t_change, b["shot"]))
        if b["click"]:
            clicks.append({"t": t_change, "x": b["click"][0], "y": b["click"][1], "note": b["note"]})
        t = t_change + b["hold"]
    return changes, clicks, camera, t


def camera_at(camera, t):
    current = camera[0][1]
    for start, pose in camera[1:]:
        if t < start:
            break
        p = camera_progress(t - start)
        current = tuple(a + (b - a) * p for a, b in zip(current, pose))
    return current


def rounded_mask(size, radius, sup=3):
    mask = Image.new("L", (size[0] * sup, size[1] * sup), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] * sup - 1, size[1] * sup - 1), radius=radius * sup, fill=255)
    return mask.resize(size, Image.LANCZOS)


class Stage:
    """Холст 2x: фон GitHub Dark и окно Storybook со скруглением и обводкой."""

    def __init__(self, folder):
        self.folder = folder
        self.cache = {}
        s = DPR
        self.win_mask = rounded_mask((VW * s, VH * s), WIN_RADIUS * s)
        edge = Image.new("RGBA", (VW * s, VH * s))
        ImageDraw.Draw(edge).rounded_rectangle((0, 0, VW * s - 1, VH * s - 1), radius=WIN_RADIUS * s,
                                               outline=(255, 255, 255, 30), width=s)
        self.win_edge = edge
        shadow = Image.new("RGBA", (OUT_W * s, OUT_H * s), (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle(
            (WIN_X * s, (WIN_Y + 6) * s, (WIN_X + VW) * s, (WIN_Y + VH + 6) * s), radius=WIN_RADIUS * s,
            fill=(0, 0, 0, 150))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14 * s))
        self.base = Image.new("RGBA", (OUT_W * s, OUT_H * s), BG)
        self.base.alpha_composite(shadow)

    def canvas(self, name):
        if name not in self.cache:
            shot = Image.open(self.folder / "shots" / name).convert("RGBA")
            shot.alpha_composite(self.win_edge)
            img = self.base.copy()
            img.paste(shot, (WIN_X * DPR, WIN_Y * DPR), self.win_mask)
            self.cache[name] = img
            if len(self.cache) > 6:
                self.cache.pop(next(iter(self.cache)))
        return self.cache[name]


def draw_ring(img, cx, cy, rel, k):
    radius_share, alpha, hole = tap_state(rel)
    if alpha <= 0.01:
        return
    r = 22 * k * radius_share
    pad = int(r + 12)
    box = (int(cx - pad), int(cy - pad), int(cx + pad), int(cy + pad))
    sample = img.crop(box).filter(ImageFilter.GaussianBlur(max(2, r * .16)))
    light = sample.convert("L").resize((1, 1), Image.BOX).getpixel((0, 0)) > 150
    tint = Image.new("RGBA", sample.size, (96, 104, 120, 255) if light else (234, 241, 250, 255))
    glass = Image.blend(sample, tint, .55 if light else .3)
    size = sample.size
    sup = 4
    mask = Image.new("L", (size[0] * sup, size[1] * sup), 0)
    d = ImageDraw.Draw(mask)
    ox, oy = (cx - box[0]) * sup, (cy - box[1]) * sup
    d.ellipse((ox - r * sup, oy - r * sup, ox + r * sup, oy + r * sup), fill=int(235 * alpha))
    ri = r * hole
    d.ellipse((ox - ri * sup, oy - ri * sup, ox + ri * sup, oy + ri * sup), fill=0)
    mask = mask.resize(size, Image.LANCZOS)
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(r * .12 + 2)).point(lambda v: int(v * .3)))
    img.alpha_composite(shadow, (box[0], box[1] + max(1, int(r * .05))))
    glass.putalpha(mask)
    img.alpha_composite(glass, (box[0], box[1]))


def shot_at(changes, t):
    """Текущий снимок, предыдущий и доля растворения."""
    current, prev, since = changes[0][1], None, 99.0
    for start, name in changes[1:]:
        if t < start:
            break
        prev, current, since = current, name, t - start
    p = cubic_in_out(since / FADE) if prev else 1.0
    return current, prev, p


def render(stage, changes, clicks, camera, t, outer):
    current, prev, p = shot_at(changes, t)
    src = stage.canvas(current)
    if prev and p < 1:
        src = Image.blend(stage.canvas(prev), src, p)
    x0, y0, w = camera_at(camera, t)
    w = min(w, OUT_W)               # перелёт пружины не выводит камеру за холст
    h = w * OUT_H / OUT_W
    x0, y0 = min(max(x0, 0), OUT_W - w), min(max(y0, 0), OUT_H - h)
    img = src.resize((OUT_W, OUT_H), Image.LANCZOS, box=(x0 * DPR, y0 * DPR, (x0 + w) * DPR, (y0 + h) * DPR))
    k = OUT_W / w
    for c in clicks:
        rel = t - c["t"]
        if -.4 < rel < .3:
            draw_ring(img, (WIN_X + c["x"] - x0) * k, (WIN_Y + c["y"] - y0) * k, rel, k)
    mask, border = outer
    img.putalpha(mask)
    img.alpha_composite(border)
    return img


def outer_frame():
    sup = 3
    border = Image.new("RGBA", (OUT_W * sup, OUT_H * sup))
    ImageDraw.Draw(border).rounded_rectangle((sup / 2, sup / 2, OUT_W * sup - sup / 2, OUT_H * sup - sup / 2),
                                             radius=OUTER_RADIUS * sup, outline=EDGE, width=round(1.25 * sup))
    border = border.resize((OUT_W, OUT_H), Image.LANCZOS)
    return rounded_mask((OUT_W, OUT_H), OUTER_RADIUS), border


class Encoder:
    """Анимированный WebP кадр за кадром: в памяти только уже сжатые кадры.

    libwebp WebPAnimEncoder через Pillow. ffmpeg (libwebp_anim) включает minimize_size, и на светлом
    фоне после растворения оставался бледный след исчезнувшего элемента: сжатие с потерями считает
    шаги меньше пары уровней яркости «тем же блоком». Здесь ключевые кадры каждые 3–5 кадров и без
    minimize_size — следа нет, а q90 укладывает ролик в ~20 МБ без видимых артефактов на тексте.
    """

    def __init__(self, out, quality):
        from PIL import _webp

        self.out = out
        self.lossless = quality is None
        self.quality = 75 if self.lossless else quality
        kmin, kmax = (9, 17) if self.lossless else (3, 5)
        self.enc = _webp.WebPAnimEncoder((OUT_W, OUT_H), 0, 0, False, kmin, kmax, False, False)
        self.t = 0.0

    def add(self, img):
        self.enc.add(img.getim(), round(self.t), self.lossless, self.quality, 100, 4)
        self.t += 1000 / FPS

    def close(self):
        self.enc.add(None, round(self.t), self.lossless, self.quality, 100, 0)
        self.out.write_bytes(self.enc.assemble("", b"", ""))


def compose(folder, script, out, keys_only=False, quality=None):
    changes, clicks, camera, duration = timeline(script)
    frames = int(round(duration * FPS))
    keys = {int(round(i * .5 * FPS)) for i in range(int(duration / .5) + 1)} | {frames - 1}
    keydir = folder / "keys"
    keydir.mkdir(exist_ok=True)
    for old in keydir.glob("*.png"):
        old.unlink()
    encoder = None if keys_only else Encoder(out, quality)
    stage = Stage(folder)
    outer = outer_frame()
    first = None
    for i in (sorted(keys) if keys_only else range(frames)):
        t = i / FPS
        img = render(stage, changes, clicks, camera, t, outer)
        if i == 0:
            first = img
        if encoder:
            encoder.add(img)
        if i in keys:
            img.save(keydir / f"key-{t:05.2f}.png")
        if i % (FPS * 5) == 0:
            print(f"Монтаж: {t:.0f}/{duration:.0f} с", flush=True)
    last = render(stage, changes, clicks, camera, (frames - 1) / FPS, outer)
    if encoder:
        encoder.close()
    diff = ImageChops.difference(first.convert("RGB"), last.convert("RGB")).getbbox()
    report = {"duration": round(duration, 3), "frames": frames, "fps": FPS, "loop_seam_diff_bbox": diff,
              "clicks": clicks}
    (folder / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    return out, report


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder", type=Path)
    ap.add_argument("--storybook", type=Path, default=REPO / "apps/storybook/storybook-static")
    ap.add_argument("--only-compose", action="store_true", help="монтаж из уже снятых shots/ и script.json")
    ap.add_argument("--keys-only", action="store_true", help="только контрольные кадры, без кодирования")
    ap.add_argument("--quality", type=int, default=90, help="качество WebP с потерями (по умолчанию 90)")
    ap.add_argument("--lossless", action="store_true", help="WebP без потерь: в несколько раз тяжелее")
    args = ap.parse_args()
    folder = args.folder.resolve()
    folder.mkdir(parents=True, exist_ok=True)
    if args.only_compose:
        script = json.loads((folder / "script.json").read_text())
    else:
        if not (args.storybook / "index.html").exists():
            raise SystemExit("Нет сборки Storybook: npm run build:storybook")
        script = capture(folder, args.storybook)
    out, report = compose(folder, script, folder / "box-ui-demo.webp", args.keys_only, None if args.lossless else args.quality)
    seam = "совпадают" if report["loop_seam_diff_bbox"] is None else f"различаются в {report['loop_seam_diff_bbox']}"
    print(f"Готово: {out} · {report['duration']} с · {report['frames']} кадров · первый и последний {seam}")
    if out.exists():
        print(f"Размер: {out.stat().st_size / 1e6:.1f} МБ")


if __name__ == "__main__":
    main()
