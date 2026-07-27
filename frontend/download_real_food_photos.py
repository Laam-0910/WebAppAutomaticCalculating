import urllib.request
import os

os.makedirs("public/icons/items", exist_ok=True)

# Map of exact food items to high quality food URLs matching the user's explicit descriptions
images = {
    # 1/ Mì trộn trứng ốp la (Mì trộn trứng ốp la thường)
    "mi_tron_trung.png": "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 2/ Mì trộn topping ngẫu nhiên (Mì trộn với đống topping đồ chiên)
    "mi_tron_topping.png": "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 3/ Mì trộn Indo trứng ốp la (Mì Indo trứng ốp la, không xúc xích)
    "mi_tron_indo.png": "https://images.pexels.com/photos/1907229/pexels-photo-1907229.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 4/ Xúc xích (Xúc xích xiên qua)
    "xuc_xich_thuong.png": "https://images.pexels.com/photos/929137/pexels-photo-929137.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 5/ Xúc xích xông khói (Xúc xích xông khói xiên)
    "xuc_xich_xong_khoi.png": "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 6/ Xúc xích nhân phô mai (Xúc xích phô mai vàng chảy)
    "xuc_xich_pho_mai.png": "https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 7/ Đùi gà rán
    "dui_ga_ran.png": "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 8/ Gà viên popcorn CP (Viên gà chiên tròn)
    "ga_popcorn.png": "https://images.pexels.com/photos/2232433/pexels-photo-2232433.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 9/ Phô mai viên (Xiên phô mai viên chiên giòn rụm)
    "pho_mai_vien.png": "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 10/ Phô mai que (Phô mai que kéo sợi bự)
    "pho_mai_que.png": "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 11/ Cá viên chiên (Xiên cá viên chiên)
    "ca_vien_chien.png": "https://images.pexels.com/photos/3298637/pexels-photo-3298637.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 12/ Bò viên chiên (Xiên bò viên chiên)
    "bo_vien_chien.png": "https://images.pexels.com/photos/3926133/pexels-photo-3926133.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 13/ Tôm viên chiên (Xiên tôm viên chiên)
    "tom_vien_chien.png": "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 14/ Mực viên chiên (Xiên mực viên chiên)
    "muc_vien_chien.png": "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 15/ Cốm hồng (Cục màu cam/hồng chiên xù)
    "com_hong.png": "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 16/ Cốm xanh (Cục màu xanh chiên xù)
    "com_xanh.png": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 17/ Chả bắp hồng hà (Xiên chả bắp ngô)
    "cha_bap.png": "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 18/ Hotdog xúc xích mini (Corndog mini)
    "hotdog_mini.png": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for fname, url in images.items():
    filePath = os.path.join("public/icons/items", fname)
    print(f"Downloading {fname}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(filePath, 'wb') as out:
            out.write(resp.read())
        print(f"Successfully saved {fname}")
    except Exception as e:
        print(f"Error downloading {fname}: {e}")
