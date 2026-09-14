from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


SOURCE = Path(r"D:\DOWNLOADS\WhatsApp Image 2026-08-26 at 2.37.54 PM.jpg")
OUT = Path(r"D:\codewithshreya\.codex_tmp\crops")
OUT.mkdir(parents=True, exist_ok=True)

image = Image.open(SOURCE).convert("RGB")
regions = {
    "top_left": (40, 230, 800, 900),
    "top_right": (760, 230, 1165, 470),
    "bottom_left": (0, 800, 760, 1200),
}

for name, box in regions.items():
    crop = image.crop(box)
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.LANCZOS)
    crop = ImageEnhance.Contrast(crop).enhance(1.5)
    crop = ImageEnhance.Sharpness(crop).enhance(1.7)
    crop = crop.filter(ImageFilter.UnsharpMask(radius=1.5, percent=130, threshold=3))
    crop.save(OUT / f"{name}.png")
