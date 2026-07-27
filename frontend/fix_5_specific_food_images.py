import urllib.request
import urllib.parse
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("public/icons/items", exist_ok=True)

# 5 món cần tìm lại ảnh chuẩn xác & khác biệt 100%
specific_queries = {
    # 1. Xúc xích đỏ chiên xiên que thường
    "xuc_xich_thuong.png": "xúc xích xiên que chiên đỏ đường phố vỉa hè",
    
    # 2. Xúc xích xông khói (khía vần nướng nâu xông khói khác hẳn xúc xích thường)
    "xuc_xich_xong_khoi.png": "xúc xích đức xông khói khía vằn nướng xiên que",
    
    # 3. Xúc xích nhân phô mai (xúc xích phô mai vàng chảy khác biệt hẳn)
    "xuc_xich_pho_mai.png": "xúc xích phô mai tan chảy màu vàng chiên",
    
    # 4. Cá viên chiên (Xiên cá viên chiên trắng giòn đường phố Việt Nam)
    "ca_vien_chien.png": "xiên cá viên chiên trắng tròn đường phố",
    
    # 5. Cốm hồng (Xiên cốm hồng chiên xù màu cam/hồng có gai)
    "com_hong.png": "xiên cốm hồng chiên xù màu cam"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
}

def search_bing_image(query, offset=0):
    encoded_q = urllib.parse.quote(query)
    url = f"https://www.bing.com/images/async?q={encoded_q}&first={offset+1}&count=15&scenario=ImageBasicHover"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        murls = re.findall(r'murl&quot;:&quot;(ht[^&]+)&quot;', html)
        valid_urls = [u for u in murls if any(ext in u.lower() for ext in ['.jpg', '.png', '.jpeg', '.webp'])]
        if offset < len(valid_urls):
            return valid_urls[offset]
        elif valid_urls:
            return valid_urls[0]
    except Exception as e:
        print(f"Error searching Bing: {e}")
    return None

for idx, (filename, query) in enumerate(specific_queries.items()):
    print(f"🔍 Searching Bing for [{filename}]: '{query}'...")
    # Dùng offset khác nhau cho từng món xúc xích để đảm bảo 3 ảnh hoàn toàn khác nhau 100%
    offset_val = idx * 2 if "xuc_xich" in filename else 0
    img_url = search_bing_image(query, offset=offset_val)
    
    if img_url:
        print(f"Found URL: {img_url[:70]}...")
        dest_path = os.path.join("public/icons/items", filename)
        try:
            req_dl = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req_dl, timeout=12) as resp_dl, open(dest_path, 'wb') as out:
                out.write(resp_dl.read())
            print(f"SUCCESS: Updated {filename}\n")
        except Exception as err:
            print(f"Download failed for {filename}: {err}\n")
    else:
        print(f"No URL found for {filename}\n")
