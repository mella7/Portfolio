# Talk slides

Two things live here per talk:

    containerdays-2026-ebpf/     01.webp, 02.webp, ...  <- the live viewer
    containerdays-2026-ebpf.pdf                          <- the download

## Adding a deck

```bash
python3 scripts/convert-slides.py ~/Downloads/my-deck.pdf my-talk-slug
```

It prints the slide count. Put both values on that talk in
`src/data/{en,de,fr}.tsx`:

```ts
slidesDir:  "/talks/slides/my-talk-slug",
slideCount: 56,
slidesUrl:  "/talks/slides/my-talk-slug.pdf",
```

Requires `poppler-utils` (for `pdftoppm`) and Pillow:

```bash
sudo apt install poppler-utils && pip install Pillow
```

## Why images instead of embedding the PDF

The ContainerDays deck is 18 MB as a PDF. Embedded in an `<iframe>`, that whole
file downloads as soon as a visitor scrolls to it, even if they never look at a
single slide. As WebP it is 2.7 MB for all 56 slides, and only the slide being
viewed is fetched, so opening the page costs about 50 KB.

Rendering is also consistent. An embedded PDF hands the visitor whatever viewer
their browser ships, which on mobile is often a download prompt rather than a
viewer.

The downloadable PDF is rebuilt from page images, so its text is no longer
selectable. If you want the original text-searchable file available too, upload
it to Speaker Deck and set `slidesUrl` to that link instead.
