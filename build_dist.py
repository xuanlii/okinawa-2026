#!/usr/bin/env python3
import os
import zipfile

base_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(base_dir, 'dist')
os.makedirs(dist_dir, exist_ok=True)

with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(base_dir, 'styles.css'), 'r', encoding='utf-8') as f:
    css = f.read()

with open(os.path.join(base_dir, 'data.js'), 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(os.path.join(base_dir, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace CSS link with inline style
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css}\n</style>')

# For portable single-file HTML, point relative spot image paths to hosted GitHub Pages URLs
portable_data_js = data_js.replace('"images/spots/', '"https://xuanlii.github.io/okinawa-2026/images/spots/')

# Replace script links with inline scripts
scripts_bundle = f"""
<script>
/* ================= DATA.JS INLINED ================= */
{portable_data_js}
</script>
<script>
/* ================= APP.JS INLINED ================= */
{app_js}
</script>
"""

html = html.replace('<script src="data.js"></script>', '')
html = html.replace('<script src="app.js"></script>', scripts_bundle)

portable_path = os.path.join(dist_dir, 'okinawa-trip-2026-portable.html')
with open(portable_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Built portable single-file HTML: {portable_path} ({len(html):,} bytes)")

# Update zip file (including all 30 real spot photos in images/spots/)
zip_path = os.path.join(base_dir, 'okinawa-trip-2026.zip')
spots_img_dir = os.path.join(base_dir, 'images', 'spots')
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for filename in ['index.html', 'styles.css', 'data.js', 'app.js', 'README.md']:
        fpath = os.path.join(base_dir, filename)
        if os.path.exists(fpath):
            zf.write(fpath, arcname=filename)
    if os.path.isdir(spots_img_dir):
        for img_name in sorted(os.listdir(spots_img_dir)):
            if img_name.endswith('.jpg'):
                img_path = os.path.join(spots_img_dir, img_name)
                zf.write(img_path, arcname=f'images/spots/{img_name}')
    zf.write(portable_path, arcname='dist/okinawa-trip-2026-portable.html')

print(f"Built zip archive: {zip_path} ({os.path.getsize(zip_path):,} bytes)")

