import json, io, urllib.request, concurrent.futures
from PIL import Image

urls = [x['file_url'] for x in json.load(open('/tmp/landing.json'))][:54]

def fetch(u):
    with urllib.request.urlopen(u, timeout=30) as r:
        return Image.open(io.BytesIO(r.read())).convert('RGB')

with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
    imgs = list(ex.map(fetch, urls))
print(f"fetched {len(imgs)}")

def stitch(images, cols, rows, cell_w, cell_h, out_path, quality):
    W, H = cols * cell_w, rows * cell_h
    canvas = Image.new('RGB', (W, H))
    for i in range(cols * rows):
        img = images[i % len(images)]
        # cover fit
        src_ratio = img.width / img.height
        dst_ratio = cell_w / cell_h
        if src_ratio > dst_ratio:
            new_h = cell_h
            new_w = int(cell_h * src_ratio)
        else:
            new_w = cell_w
            new_h = int(cell_w / src_ratio)
        resized = img.resize((new_w, new_h), Image.LANCZOS)
        left = (new_w - cell_w) // 2
        top = (new_h - cell_h) // 2
        cropped = resized.crop((left, top, left + cell_w, top + cell_h))
        x = (i % cols) * cell_w
        y = (i // cols) * cell_h
        canvas.paste(cropped, (x, y))
    canvas.save(out_path, 'WEBP', quality=quality, method=6)
    import os
    print(out_path, os.path.getsize(out_path))

# Desktop 9x6 = 54 cells; ~213x213 per cell -> 1920x1280
stitch(imgs, 9, 6, 213, 213, '/tmp/landing-grid-desktop.webp', 78)
# Mobile 3x4 = 12 cells; 250x250 -> 750x1000
stitch(imgs[:12], 3, 4, 250, 250, '/tmp/landing-grid-mobile.webp', 75)
