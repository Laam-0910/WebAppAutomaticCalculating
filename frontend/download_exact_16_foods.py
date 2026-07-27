"""
Download exact matching food images for all 16 food items
based on the user's detailed specifications.
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

exact_food_images = {
    # 1. Mì trộn topping ngẫu nhiên (ảnh mì trộn ngập topping đồ chiên, xúc xích, cá viên)
    'mi_tron_topping.png':    'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',

    # 2. Mì trộn Indo (mì indomie với trứng ốp la sạch sẽ)
    'mi_tron_indo.png':       'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600&auto=format&fit=crop&q=80',

    # 3. Mì trộn trứng ốp la (mì trộn với trứng ốp la thường)
    'mi_tron_trung.png':      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',

    # 4. Xúc xích (xúc xích xiên que)
    'xuc_xich_thuong.png':   'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=600&auto=format&fit=crop&q=80',

    # 5. Xúc xích xông khói (xúc xích xông khói xiên)
    'xuc_xich_xong_khoi.png':'https://images.unsplash.com/photo-1585325701165-351af916e581?w=600&auto=format&fit=crop&q=80',

    # 6. Xúc xích nhân sốt phô mai (xúc xích nhân phô mai vàng chảy)
    'xuc_xich_pho_mai.png':  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',

    # 7. Gà viên popcorn CP (mấy cục viên gà chiên tròn xù)
    'ga_popcorn.png':         'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',

    # 8. Phô mai viên (xiên phô mai có mấy viên phô mai chiên giòn rụm)
    'pho_mai_vien.png':      'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80',

    # 9. Phô mai que (phóng bự phô mai que kéo sợi)
    'pho_mai_que.png':       'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=600&auto=format&fit=crop&q=80',

    # 10. Cá viên chiên (xiên cá viên chiên trắng tròn)
    'ca_vien_chien.png':      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',

    # 11. Tôm viên chiên (xiên tôm viên chiên màu cam đỏ)
    'tom_vien_chien.png':     'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',

    # 12. Mực viên chiên (xiên mực viên chiên)
    'muc_vien_chien.png':     'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',

    # 13. Cốm hồng (cục màu hồng/cam có gai chiên xù)
    'com_hong.png':          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',

    # 14. Cốm xanh (cục màu xanh lá có gai chiên xù)
    'com_xanh.png':          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',

    # 15. Chả bắp hồng hà (chả bắp ngô chiên xù xiên)
    'cha_bap.png':            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',

    # 16. Hotdog xúc xích mini (mini corndog xiên như đùi gà mini chiên xù)
    'hotdog_mini.png':        'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
}

for filename, url in exact_food_images.items():
    path = os.path.join(dest, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r, open(path, 'wb') as f:
            f.write(r.read())
        size = os.path.getsize(path)
        print(f'OK [{size//1024}KB]: {filename}')
    except Exception as e:
        print(f'FAIL: {filename} -> {e}')

print('\nDone updating 16 exact food images!')
