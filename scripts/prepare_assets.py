"""Reproduce the photographic crops from the four supplied layout references.

Requires Pillow. Run from any directory:
    python scripts/prepare_assets.py

To first preserve the supplied PNG files:
    python scripts/prepare_assets.py --import-from /path/to/originals

Rectangles use Pillow's (left, top, right, bottom) convention in source pixels.
The sources are never modified. No generated imagery or upscaling is used.
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "assets" / "originals"
OUTPUT = ROOT / "public" / "images"

SOURCES = {
    "chair": "Cadeira de barbeiro em barbearia premium.png",
    "services": "Serviços premium em ambiente de barbearia.png",
    "gallery": "Galeria do lounge da barbearia.png",
    "facade": "Fachada e contato da barbearia premium.png",
}

CROPS = {
    "hero": ("chair", (575, 78, 1487, 1000)),
    "service-cut": ("services", (77, 170, 509, 382)),
    "service-beard": ("services", (533, 170, 958, 382)),
    "service-complete": ("services", (982, 170, 1415, 382)),
    "barber": ("services", (77, 640, 808, 946)),
    "lounge": ("gallery", (41, 185, 932, 758)),
    "mirror": ("gallery", (958, 185, 1448, 450)),
    "coffee": ("gallery", (958, 474, 1448, 758)),
    "facade": ("facade", (580, 0, 1487, 568)),
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--import-from", type=Path)
    args = parser.parse_args()
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    if args.import_from:
        for filename in SOURCES.values():
            destination = ORIGINALS / filename
            if not destination.exists():
                shutil.copy2(args.import_from / filename, destination)

    manifest = []
    for name, (source_key, rectangle) in CROPS.items():
        source = ORIGINALS / SOURCES[source_key]
        with Image.open(source) as original:
            if original.size != (1487, 1058):
                raise ValueError(f"Unexpected source dimensions: {source}: {original.size}")
            crop = original.convert("RGB").crop(rectangle)
            target = OUTPUT / f"{name}.webp"
            crop.save(target, "WEBP", quality=88, method=6)
            record = {
                "asset": f"public/images/{target.name}",
                "source": f"assets/originals/{source.name}",
                "sourceSize": list(original.size),
                "crop": list(rectangle),
                "size": list(crop.size),
                "bytes": target.stat().st_size,
            }
            if crop.width > 640:
                small = crop.copy()
                small.thumbnail((640, 2000), Image.Resampling.LANCZOS)
                small_target = OUTPUT / f"{name}-640.webp"
                small.save(small_target, "WEBP", quality=86, method=6)
                record["smallAsset"] = f"public/images/{small_target.name}"
                record["smallSize"] = list(small.size)
                record["smallBytes"] = small_target.stat().st_size
            manifest.append(record)
            print(f"{target.name}: {crop.width} x {crop.height}, {target.stat().st_size:,} bytes")

    (ROOT / "assets" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
