"""Create web-optimized, metadata-free copies of the ministry's source photos.

Usage: python scripts/optimize-photos.py
Reads assets/source-photos/ (not committed) and writes public/images/ministry/.
EXIF (including any GPS data) is dropped because only pixel data is re-encoded.
"""
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source-photos")
OUT = os.path.join(ROOT, "public", "images", "ministry")
MAX_EDGE = 2400
QUALITY = 80

W = "WhatsApp Image 2026-10-15 at "
PHOTOS = {
    "IMG_3491.JPEG": "preaching-gown-portrait",
    "IMG_3492.JPEG": "preaching-christmas",
    "IMG_3497.JPEG": "worship-seated",
    "IMG_3506.JPEG": "worship-hero",
    "IMG_3511.JPEG": "congregation-standing",
    W + "5.59.20 PM.jpeg": "fellowship-men",
    W + "6.02.13 PM.jpeg": "speaker-red-stage",
    W + "6.02.14 PM.jpeg": "youth-member",
    W + "6.02.16 PM.jpeg": "prayer-man",
    W + "6.02.18 PM.jpeg": "prayer-bowed",
    W + "6.02.20 PM.jpeg": "worship-singer",
    W + "6.02.24 PM.jpeg": "worship-leader",
    W + "6.02.26 PM.jpeg": "altar-banners",
    W + "6.02.33 PM.jpeg": "minister-white",
    W + "6.02.38 PM.jpeg": "pulpit-shepherd",
    W + "6.02.49 PM.jpeg": "minister-banner",
    W + "6.04.25 PM (1).jpeg": "congregation-group-1",
    W + "6.04.25 PM.jpeg": "congregation-shiloh",
    W + "6.04.26 PM.jpeg": "congregation-group-2",
    W + "6.04.29 PM (1).jpeg": "congregation-front-row",
    W + "6.04.29 PM.jpeg": "community-outdoor",
    W + "6.04.33 PM.jpeg": "pulpit-preacher-1",
    W + "6.04.35 PM.jpeg": "pulpit-preacher-2",
    W + "6.04.45 PM.jpeg": "joyful-member",
    W + "6.06.26 PM (1).jpeg": "pulpit-clergy",
    W + "6.06.26 PM.jpeg": "clergy-speaking",
    W + "6.06.31 PM.jpeg": "women-fellowship",
    W + "6.06.32 PM (1).jpeg": "team-member-blue",
    W + "6.06.32 PM.jpeg": "outreach-team-1",
    W + "6.06.33 PM.jpeg": "outreach-team-2",
    W + "6.06.36 PM (1).jpeg": "outreach-field-front",
    W + "6.06.36 PM.jpeg": "outreach-field-back",
    W + "6.06.37 PM.jpeg": "worship-singer-2",
    W + "6.06.38 PM (1).jpeg": "portrait-clergy-1",
    W + "6.06.38 PM.jpeg": "portrait-clergy-2",
    W + "6.06.39 PM (1).jpeg": "speaker-red-stage-2",
    W + "6.06.39 PM.jpeg": "portrait-clergy-3",
    W + "6.06.40 PM (1).jpeg": "worship-singer-3",
    W + "6.06.40 PM.jpeg": "praise-hand-raised",
    W + "6.06.41 PM.jpeg": "children-families",
    W + "6.06.42 PM (1).jpeg": "prayer-woman",
    W + "6.06.42 PM.jpeg": "children-bible-reading",
    W + "6.06.45 PM.jpeg": "congregation-worship",
    W + "6.06.46 PM.jpeg": "children-ministry",
    W + "6.06.47 PM.jpeg": "women-group",
    W + "6.06.48 PM (1).jpeg": "men-group",
    W + "6.06.48 PM.jpeg": "men-and-boys",
    W + "6.06.53 PM.jpeg": "portrait-clergy-4",
}


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for source, name in PHOTOS.items():
        path = os.path.join(SRC, source)
        if not os.path.exists(path):
            print(f"missing: {source}")
            continue
        image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        target = os.path.join(OUT, f"{name}.jpg")
        image.save(target, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"{name}.jpg {image.width}x{image.height} {os.path.getsize(target) // 1024}KB")


if __name__ == "__main__":
    main()
