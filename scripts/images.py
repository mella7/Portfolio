#!/usr/bin/env python3
"""Build every photo the site serves, in fast formats.

    pip install --upgrade pillow      # needs Pillow 11.2+ (AVIF support)
    python3 scripts/images.py         # everything
    python3 scripts/images.py moments # one group: moments, projects, slides, certs

Sources (not served):
    media/moments/<name>.<jpg|png|webp>   photos for the slideshow and /moments
    media/projects/<name>.<...>           project screenshots
    media/certs/<name>.png                certification badges
    public/talks/slides/<slug>.pdf        talk decks

Output (served):
    public/moments/<name>-<width>.avif|webp   480 / 960 / 1600 wide
    public/thumbs/moment-<name>.webp          168x168 square for the cards
    public/projects/<name>-<width>.avif|webp  480 / 960 wide
    public/talks/slides/<slug>/NN-<width>.avif|webp   960 / 1600 wide
    public/certs/<name>.webp                  192x192
    src/data/images.json   sizes + a tiny blurred placeholder per photo

AVIF is ~30-50% smaller than WebP for the same quality, and every current
browser reads it; WebP is the fallback. All metadata (EXIF, GPS) is dropped
and colors are converted to sRGB.
"""
import base64, io, json, os, subprocess, sys, tempfile
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image, ImageCms, ImageOps, features

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
MEDIA = ROOT / "media"
META = ROOT / "src" / "data" / "images.json"

PHOTO_AVIF_Q, PHOTO_WEBP_Q = 55, 78
SLIDE_AVIF_Q, SLIDE_WEBP_Q = 62, 82  # text needs a bit more
SRGB = ImageCms.createProfile("sRGB")


def load(path: Path) -> Image.Image:
    im = Image.open(path)
    icc = im.info.get("icc_profile")
    im = ImageOps.exif_transpose(im)
    has_alpha = im.mode in ("RGBA", "LA", "P") and "transparency" in im.info or im.mode in ("RGBA", "LA")
    im = im.convert("RGBA" if has_alpha else "RGB")
    if icc and not has_alpha:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode="RGB")
        except Exception:
            pass
    return im


def widths_for(src_w: int, wanted: tuple[int, ...]) -> list[int]:
    out = [w for w in wanted if w < src_w]
    out.append(min(src_w, wanted[-1]))
    return sorted(set(out))


def encode(im: Image.Image, base: Path, avif_q: int, webp_q: int) -> None:
    base.parent.mkdir(parents=True, exist_ok=True)
    im.save(f"{base}.avif", "AVIF", quality=avif_q, speed=4)
    im.save(f"{base}.webp", "WEBP", quality=webp_q, method=6)


def lqip(im: Image.Image) -> str:
    small = im.convert("RGB").copy()
    small.thumbnail((20, 20), Image.LANCZOS)
    buf = io.BytesIO()
    small.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def responsive(group: str, src: Path, wanted: tuple[int, ...]) -> tuple[str, dict]:
    name = src.stem
    im = load(src)
    ws = widths_for(im.width, wanted)
    for w in ws:
        h = round(im.height * w / im.width)
        encode(im.resize((w, h), Image.LANCZOS), PUBLIC / group / f"{name}-{w}", PHOTO_AVIF_Q, PHOTO_WEBP_Q)
    if group == "moments":
        thumb = ImageOps.fit(im.convert("RGB"), (168, 168), Image.LANCZOS, centering=(0.5, 0.4))
        thumb.save(PUBLIC / "thumbs" / f"moment-{name}.webp", "WEBP", quality=78, method=6)
    top = ws[-1]
    return f"{group}/{name}", {"w": top, "h": round(im.height * top / im.width), "widths": ws, "lqip": lqip(im)}


def slide_deck(pdf: Path) -> str:
    out_dir = pdf.with_suffix("")
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-png", "-scale-to-x", "1600", "-scale-to-y", "-1", str(pdf), f"{tmp}/s"], check=True)
        pages = sorted(Path(tmp).glob("s-*.png"))
        for old in out_dir.glob("*.*"):
            old.unlink()
        for i, page in enumerate(pages, 1):
            im = load(page)
            for w in (960, 1600):
                h = round(im.height * w / im.width)
                encode(im.resize((w, h), Image.LANCZOS), out_dir / f"{i:02d}-{w}", SLIDE_AVIF_Q, SLIDE_WEBP_Q)
    return f"{pdf.stem}: {len(pages)} slides"


def cert(src: Path) -> str:
    im = load(src)
    im.thumbnail((192, 192), Image.LANCZOS)
    im.save(PUBLIC / "certs" / f"{src.stem}.webp", "WEBP", quality=90, method=6)
    return src.stem


def sources(folder: Path) -> list[Path]:
    exts = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".tif", ".tiff"}
    return sorted(p for p in folder.glob("*") if p.suffix.lower() in exts)


def main(groups: set[str]) -> None:
    if not features.check("avif"):
        sys.exit("This Pillow has no AVIF support: pip install --upgrade pillow")
    meta = json.loads(META.read_text()) if META.exists() else {}
    with ProcessPoolExecutor() as pool:
        jobs = []
        if "moments" in groups:
            for old in (PUBLIC / "moments").glob("*.*"):
                old.unlink()
            meta = {k: v for k, v in meta.items() if not k.startswith("moments/")}
            jobs += [pool.submit(responsive, "moments", p, (480, 960, 1600)) for p in sources(MEDIA / "moments")]
        if "projects" in groups:
            for old in (PUBLIC / "projects").glob("*.*"):
                old.unlink()
            meta = {k: v for k, v in meta.items() if not k.startswith("projects/")}
            jobs += [pool.submit(responsive, "projects", p, (480, 960)) for p in sources(MEDIA / "projects")]
        for job in jobs:
            key, info = job.result()
            meta[key] = info
            print("photo ", key, info["widths"])
        if "certs" in groups:
            for name in pool.map(cert, sources(MEDIA / "certs")):
                print("cert  ", name)
        if "slides" in groups:
            for line in pool.map(slide_deck, sorted((PUBLIC / "talks" / "slides").glob("*.pdf"))):
                print("slides", line)
    META.write_text(json.dumps(dict(sorted(meta.items())), indent=1) + "\n")
    print(f"wrote {META.relative_to(ROOT)}")


if __name__ == "__main__":
    all_groups = {"moments", "projects", "slides", "certs"}
    asked = set(sys.argv[1:]) or all_groups
    unknown = asked - all_groups
    if unknown:
        sys.exit(f"unknown group(s): {', '.join(unknown)}; use {', '.join(sorted(all_groups))}")
    main(asked)
