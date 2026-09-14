from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


SOURCE = Path(r"D:\DOWNLOADS\WhatsApp Image 2026-08-26 at 2.37.54 PM.jpg")
OUT_DIR = Path(r"D:\codewithshreya\work\codex_roster_conversion_20260826\crops")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    image = Image.open(SOURCE).convert("RGB")
    regions = {
        "krishna_logo": (455, 35, 690, 185),
        "top_officers": (40, 245, 1155, 560),
        "members": (35, 520, 740, 925),
        "executive_members": (0, 845, 780, 1190),
    }
    for name, box in regions.items():
        crop = image.crop(box)
        crop = crop.resize((crop.width * 3, crop.height * 3), Image.Resampling.LANCZOS)
        crop = ImageEnhance.Contrast(crop).enhance(1.45)
        crop = ImageEnhance.Sharpness(crop).enhance(1.8)
        crop = crop.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=2))
        crop.save(OUT_DIR / f"{name}.png")


if __name__ == "__main__":
    main()
