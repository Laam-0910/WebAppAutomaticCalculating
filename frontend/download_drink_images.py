"""
Download correct drink product images from reliable CDN sources.
Run: python download_drink_images.py
"""
import urllib.request, os, ssl

# Bỏ qua SSL verify để tải được ảnh
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

dest = r'public\icons\items'
os.makedirs(dest, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Danh sách ảnh cần tải - URL ổn định, đúng sản phẩm
images = {
    # 7Up - lon xanh lá
    '7up.png': 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&auto=format&fit=crop&q=80',
    # Trà Ô Long - ly trà nâu đậm
    'tra_olong.png': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80',
    # Revive - chai nước điện giải
    'revive.png': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    # Sting - chai năng lượng đỏ
    'sting.png': 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&auto=format&fit=crop&q=80',
    # Bò Húc / Red Bull - lon gold
    'bo_huc.png': 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=400&auto=format&fit=crop&q=80',
    # Nước suối Aquafina
    'nuoc_suoi.png': 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=400&auto=format&fit=crop&q=80',
}

for filename, url in images.items():
    path = os.path.join(dest, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r, open(path, 'wb') as f:
            f.write(r.read())
        size = os.path.getsize(path)
        print(f'OK [{size//1024}KB]: {filename}')
    except Exception as e:
        print(f'FAIL: {filename} -> {e}')

print('\nDone! Restart npm run dev and hard refresh.')
