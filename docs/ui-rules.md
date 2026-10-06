# 🎨 UI & UX Design System Rules

## 1. Color Palette Tokens

```css
:root {
  --bg-dark: #080808;
  --bg-card: #111111;
  --bg-stone: #1A1512;
  --stone-border: #30251D;
  --brown-accent: #5A3A25;
  --red-deep: #8B2E1E;
  --red-bright: #B84320;
  --orange-ember: #D77A27;
  --gold-accent: #D6B36A;
  --gold-bright: #F1D7A0;
  --text-light: #F1D7A0;
  --text-muted: #D6B36A;
  --text-white: #FFFFFF;
}
```

## 2. Typography Rules
- Use Google Fonts `'Catamaran'`, `'Mukta Malar'`, sans-serif.
- Tamil language text ONLY across all headings, buttons, tooltips, score displays, and modals.

## 3. Flicker-Free Interactive Controls
- Buttons must use `transform: scale(1.03);` on hover with `box-shadow` transitions.
- NEVER alter layout properties (`top`, `left`, `margin`, `padding`, `width`, `height`) on `:hover`.

## 4. Document Scrolling
- Document wrapper must maintain `overflow-y: auto; overflow-x: hidden;` with smooth scrolling.
