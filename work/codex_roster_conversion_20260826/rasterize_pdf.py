from pathlib import Path

import fitz


PDF = Path(r"D:\codewithshreya\work\codex_roster_conversion_20260826\render_word\roster.pdf")
OUT = PDF.parent


def main() -> None:
    document = fitz.open(PDF)
    matrix = fitz.Matrix(2, 2)
    for index, page in enumerate(document, start=1):
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)
        pixmap.save(OUT / f"page-{index}.png")
    print(len(document))


if __name__ == "__main__":
    main()
