#!/usr/bin/env python3
"""Build the walking-avatar sprite sheets, one per accent colour.

    pip install --upgrade pillow
    python3 scripts/walker.py

Input : media/avatar/walk-atlas.webp
        A full-colour render of the walk, idle, sit, wave and sit-down clips,
        13 columns x 4 rows of 207x336 cells (the layout of the
        astro-bento-portfolio template). Replace it with a render of your own
        model to change the character.
Output: public/avatar-walk-<theme>.webp
        The same grid at 80x130 per cell, reduced to three colours and
        dithered to match the seated avatar: light hoodie, accent-coloured
        skin and trousers, dark hair.

The colours come from THEMES below; keep them in step with src/data/site.mjs.
"""
import colorsys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "media" / "avatar" / "walk-atlas.webp"
COLS, ROWS = 13, 4
CELL = (80, 130)

HIGHLIGHT = (247, 250, 252)
THEMES = {
    "red": (230, 57, 70),
    "yellow": (255, 235, 59),
    "green": (102, 187, 106),
    "blue": (33, 150, 243),
    "purple": (176, 79, 208),
}
BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]


def tone(r, g, b):
    """Map a source pixel to a level between 0 (shadow) and 2 (highlight)."""
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if s > 0.22:
        if v > 0.5:  # skin
            return 0.75 + (v - 0.5) * 1.3
        return 0.05 + v * 0.9  # hair and beard
    if v < 0.2:  # black hoodie and shoes become the light hoodie
        return 1.6 + min(v / 0.2, 1) * 0.4
    if v < 0.5:  # grey trousers take the accent colour
        return 0.6 + (v - 0.2) * 1.6
    return 2.0  # glasses, eyes


def build(theme, accent):
    shadow = tuple(int(c * 0.4) for c in accent)
    palette = [shadow, accent, HIGHLIGHT]
    src = Image.open(SOURCE).convert("RGBA")
    cw, ch = src.width // COLS, src.height // ROWS
    out = Image.new("RGBA", (CELL[0] * COLS, CELL[1] * ROWS), (0, 0, 0, 0))
    for row in range(ROWS):
        for col in range(COLS):
            cell = src.crop((col * cw, row * ch, (col + 1) * cw, (row + 1) * ch)).resize(CELL, Image.LANCZOS)
            px = cell.load()
            for y in range(CELL[1]):
                for x in range(CELL[0]):
                    r, g, b, a = px[x, y]
                    if a < 110:
                        px[x, y] = (0, 0, 0, 0)
                        continue
                    level = max(0.0, min(2.0, tone(r, g, b)))
                    low = int(level)
                    if low < 2 and (level - low) > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16:
                        low += 1
                    px[x, y] = (*palette[low], 255)
            out.paste(cell, (col * CELL[0], row * CELL[1]))
    target = ROOT / "public" / f"avatar-walk-{theme}.webp"
    out.save(target, lossless=True, method=6)
    print("wrote", target.relative_to(ROOT), target.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    for name, colour in THEMES.items():
        build(name, colour)
