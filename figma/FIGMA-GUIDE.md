# Ghithaa — Complete Figma import

## FASTEST: Paste all 14 screens into Figma (recommended)

### Step 1 — Open the paste file
Double-click in File Explorer (use **Chrome**):
```
figma/GHITHAA-FIGMA-PASTE.html
```

### Step 2 — Copy
Click **"Copy all 14 screens for Figma"**

### Step 3 — Paste in Figma
1. Open [figma.com](https://www.figma.com) → **New design file**
2. Click the canvas
3. Press **Ctrl+V**

All 14 screens appear as editable Figma frames in a 4-column grid.

---

## Regenerate the paste file

If you edit `ghithaa-complete.html`, run:
```bash
npm run export:figma
```

This rebuilds `GHITHAA-FIGMA-PASTE.html` from the HTML mockups.

---

## Alternative: html.to.design plugin

1. Open `figma/ghithaa-complete.html` in Chrome
2. In Figma → Plugins → **html.to.design** → Import URL
3. Paste the `file:///` URL from Chrome

---

## Files in this folder

| File | Purpose |
|------|---------|
| `GHITHAA-FIGMA-PASTE.html` | **One-click copy → paste in Figma** |
| `ghithaa-complete.html` | Visual reference — all 14 screens |
| `ghithaa-figma-clipboard.html` | Raw clipboard payload (advanced) |
| `design-tokens.json` | Colors, type, spacing for Tokens Studio |
| `screen-inventory.json` | Screen list + components |

## Screens included

01 Splash · 02-03 Onboarding · 04 City · 05 Login · 06 Home · 07 Menu · 08 Plans · 09 Subscribe · 10 Orders · 11 Wallet · 12 Profile · 13 Meal Detail · 14 Subscribe Meals
