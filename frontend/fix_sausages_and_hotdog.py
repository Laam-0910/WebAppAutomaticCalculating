import urllib.request
import urllib.parse
import os
import shutil

os.makedirs("public/icons/items", exist_ok=True)

# Copy bức ảnh 4 xiên hotdog mini trên đĩa xám người dùng vừa gửi
user_hotdog_path = r"C:\Users\caonh\.gemini\antigravity\brain\20dff380-8839-449c-a57d-74caa8402796\media__1785145736364.png"
dest_hotdog = r"public\icons\items\hotdog_mini.png"
if os.path.exists(user_hotdog_path):
    shutil.copy(user_hotdog_path, dest_hotdog)
    print("SUCCESS: Copied user attached photo to hotdog_mini.png")

# 3 URL ảnh thực tế HOÀN TOÀN KHÁC NHAU cho 3 món xúc xích
sausage_urls = {
    # 1. Xúc xích đỏ chiên xiên que đường phố truyền thống
    "xuc_xich_thuong.png": "https://images.pexels.com/photos/929137/pexels-photo-929137.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 2. Xúc xích xông khói khía vằn nướng đốm nâu
    "xuc_xich_xong_khoi.png": "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=600",
    
    # 3. Xúc xích phô mai chiên nhân phô mai chảy màu vàng
    "xuc_xich_pho_mai.png": "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for fname, url in sausage_urls.items():
    dest = os.path.join("public/icons/items", fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out:
            out.write(resp.read())
        print(f"SUCCESS: Saved distinct image for {fname}")
    except Exception as e:
        print(f"Error downloading {fname}: {e}")
