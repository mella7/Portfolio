#!/usr/bin/env python3
"""
Turn a slide-deck PDF into the WebP images the live viewer uses.

    python3 scripts/convert-slides.py my-deck.pdf my-talk-slug

Writes:
    public/talks/slides/<slug>/01.webp, 02.webp, ...   (the live viewer)
    public/talks/slides/<slug>.pdf                      (compressed download)

Then in src/data/{en,de,fr}.tsx set on that talk:
    slidesDir:  "/talks/slides/<slug>",
    slideCount: <the number it prints>,
    slidesUrl:  "/talks/slides/<slug>.pdf",

Requires: poppler-utils (pdftoppm) and Pillow.
    sudo apt install poppler-utils && pip install Pillow
"""
import os
import subprocess
import sys
import tempfile
from glob import glob

from PIL import Image

VIEWER_WIDTH = 1600   # crisp on retina inside an ~800px container
PDF_WIDTH = 1400      # for the downloadable copy
RENDER_DPI = 80

def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1

    pdf, slug = sys.argv[1], sys.argv[2]
    if not os.path.isfile(pdf):
        print(f"No such file: {pdf}")
        return 1

    out_dir = os.path.join("public", "talks", "slides", slug)
    os.makedirs(out_dir, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        print("Rendering pages...")
        subprocess.run(
            ["pdftoppm", "-r", str(RENDER_DPI), "-png", pdf, os.path.join(tmp, "page")],
            check=True,
        )
        pages = sorted(glob(os.path.join(tmp, "page-*.png")))
        if not pages:
            print("pdftoppm produced no pages.")
            return 1

        total = 0
        pdf_pages = []
        for i, page in enumerate(pages, 1):
            im = Image.open(page).convert("RGB")

            viewer = im if im.width <= VIEWER_WIDTH else im.resize(
                (VIEWER_WIDTH, round(im.height * VIEWER_WIDTH / im.width)),
                Image.LANCZOS,
            )
            dest = os.path.join(out_dir, f"{i:02d}.webp")
            viewer.save(dest, "WEBP", quality=82, method=6)
            total += os.path.getsize(dest)

            pdf_pages.append(
                im if im.width <= PDF_WIDTH else im.resize(
                    (PDF_WIDTH, round(im.height * PDF_WIDTH / im.width)),
                    Image.LANCZOS,
                )
            )

        download = os.path.join("public", "talks", "slides", f"{slug}.pdf")
        pdf_pages[0].save(
            download, save_all=True, append_images=pdf_pages[1:],
            format="PDF", resolution=96, quality=80, optimize=True,
        )

    print(f"\n{len(pages)} slides -> {out_dir}")
    print(f"  images:   {total / 1024 / 1024:.1f} MB total, {total / len(pages) / 1024:.0f} KB average")
    print(f"  download: {os.path.getsize(download) / 1024 / 1024:.1f} MB")
    print(f"\nSet on the talk:  slidesDir: \"/talks/slides/{slug}\", slideCount: {len(pages)},")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
