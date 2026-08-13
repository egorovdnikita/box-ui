# @box-ui/react

A deliberately small set of React primitives whose only job is to prove the token graph:
there is not a single literal colour, radius, size or font size in
[`src/styles.css`](src/styles.css).

```tsx
import '@box-ui/react/styles.css';
import { Badge, BoxUIProvider, Button, Card, Input, Stack, Text } from '@box-ui/react';

<BoxUIProvider theme="dark" accent="violet" radius="high" device="mobile" iconStyle="bold">
  <Card>
    <Text variant="h4">Billing</Text>
    <Badge sentiment="positive">Active</Badge>
    <Button>Update</Button>
  </Card>
</BoxUIProvider>;
```

`BoxUIProvider` sets the `data-*` attributes for the Figma modes. `target="local"`
(the default) puts them on a wrapper `<div>`, so several themes can coexist on one page;
`target="root"` writes them on `<html>` instead and restores the previous values on unmount.

| Component | Tokens it leans on |
| --- | --- |
| `Text` | the `typography/*` ramp from Grid |
| `Stack` | `spacing/base/*` |
| `Card` | `background/base/*`, `border/base/*`, `rounding/base/l` |
| `Button` | `control/*`, `size/base/*`, `rounding/base/s`, `border/focus/base` |
| `Badge` | `background/sentiment/*`, `content/sentiment/*` |
| `Input` | `border/base/*`, `border/sentiment/negative`, `interactive/disabled` |
