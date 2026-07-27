"""
Download high-quality food product images for all 18 food items
and save them locally into public/icons/items/
"""
import urllib.request, os, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

dest = r'public\icons\items'
os.makedirs(dest, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

food_images = {
    # MÌ TRỘN
    'mi_tron_trung.png':      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80', # Mì trộn trứng ốp la
    'mi_tron_topping.png':    'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80', # Mì trộn topping ngẫu nhiên
    'mi_tron_indo.png':       'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80', # Mì trộn Indo trứng ốp la

    # XÚC XÍCH
    'xuc_xich_thuong.png':   'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=500&auto=format&fit=crop&q=80', # Xúc xích nướng
    'xuc_xich_xong_khoi.png':'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80', # Xúc xích xông khói
    'xuc_xich_pho_mai.png':  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80', # Xúc xích nhân sốt phô mai

    # GÀ
    'dui_ga_ran.png':         'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80', # Đùi gà rán giòn
    'ga_popcorn.png':         'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80', # Gà viên popcorn CP

    # XIÊN QUE
    'pho_mai_vien.png':      'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=80', # Phô mai viên chiên
    'pho_mai_que.png':       'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500&auto=format&fit=crop&q=80', # Phô mai que chiên giòn
    'ca_vien_chien.png':      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', # Cá viên chiên
    'bo_vien_chien.png':      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=80', # Bò viên chiên
    'tom_vien_chien.png':     'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', # Tôm viên chiên
    'muc_vien_chien.png':     'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=80', # Mực viên chiên
    'com_hong.png':          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80', # Cốm hồng
    'com_xanh.png':          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80', # Cốm xanh
    'cha_bap.png':            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80', # Chả bắp hồng hà

    # KHÁC
    'hotdog_mini.png':        'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=500&auto=format&fit=crop&q=80', # Hotdog xúc xích mini
}

for filename, url in food_images.items():
    path = os.path.join(dest, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r, open(path, 'wb') as f:
            f.write(r.read())
        size = os.path.getsize(path)
        print(f'OK [{size//1024}KB]: {filename}')
    except Exception as e:
        print(f'FAIL: {filename} -> {e}')

print('\nDone downloading all 18 food images!')
