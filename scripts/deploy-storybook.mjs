#!/usr/bin/env node
/**
 * Publishes `apps/storybook/storybook-static` to the `gh-pages` branch, which
 * GitHub Pages serves at https://egorovdnikita.github.io/box-ui/.
 *
 *   npm run deploy:storybook          # builds, then force-pushes the snapshot
 *
 * This is the manual path. `docs/storybook-pages-workflow.yml` does the same
 * thing on every push to `main` — copy it into `.github/workflows/` once your
 * git credentials carry the `workflow` scope (`gh auth refresh -s workflow`).
 */

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'apps', 'storybook', 'storybook-static');
const branch = 'gh-pages';

if (!existsSync(join(source, 'index.html'))) {
  console.error('No build found. Run `npm run build:storybook` first.');
  process.exit(1);
}

const git = (cwd, ...args) => execFileSync('git', args, { cwd, stdio: 'inherit' });
const read = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

const remote = read('remote', 'get-url', 'origin');
const sha = read('rev-parse', '--short', 'HEAD');

const staging = mkdtempSync(join(tmpdir(), 'box-ui-pages-'));
try {
  cpSync(source, staging, { recursive: true });
  writeFileSync(join(staging, '.nojekyll'), '');

  git(staging, 'init', '-q', '-b', branch);
  // Large snapshots trip HTTP/2 on some networks.
  git(staging, 'config', 'http.version', 'HTTP/1.1');
  git(staging, 'config', 'http.postBuffer', '524288000');
  git(staging, 'add', '-A');
  git(staging, 'commit', '-q', '-m', `Deploy Storybook (${sha})`);
  git(staging, 'remote', 'add', 'origin', remote);
  git(staging, 'push', '-f', 'origin', branch);

  console.log(`\nDeployed ${sha} → ${branch}. Live in a minute at https://egorovdnikita.github.io/box-ui/`);
} finally {
  rmSync(staging, { recursive: true, force: true });
}
