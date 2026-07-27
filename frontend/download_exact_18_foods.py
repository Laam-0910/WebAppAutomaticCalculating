import urllib.request
import urllib.parse
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("public/icons/items", exist_ok=True)

queries = {
    "mi_tron_trung.png": "mì trộn trứng ốp la",
    "mi_tron_topping.png": "mì trộn topping đồ chiên xiên que",
    "mi_tron_indo.png": "mì trộn indo trứng ốp la",
    "xuc_xich_thuong.png": "xúc xích xiên que chiên đường phố",
    "xuc_xich_xong_khoi.png": "xúc xích xông khói xiên que",
    "xuc_xich_pho_mai.png": "xúc xích phô mai vàng chiên",
    "dui_ga_ran.png": "đùi gà rán giòn rụm",
    "ga_popcorn.png": "gà viên popcorn chiên giòn",
    "pho_mai_vien.png": "xiên phô mai viên chiên",
    "pho_mai_que.png": "phô mai que kéo sợi",
    "ca_vien_chien.png": "xiên cá viên chiên đường phố",
    "bo_vien_chien.png": "xiên bò viên chiên",
    "tom_vien_chien.png": "xiên tôm viên chiên",
    "muc_vien_chien.png": "xiên mực viên chiên",
    "com_hong.png": "xiên cốm hồng chiên xù",
    "com_xanh.png": "xiên cốm xanh chiên xù",
    "cha_bap.png": "xiên chả bắp ngô chiên xù",
    "hotdog_mini.png": "hotdog xúc xích mini chiên xù"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
}

def search_bing_image(query):
    encoded_q = urllib.parse.quote(query)
    url = f"https://www.bing.com/images/async?q={encoded_q}&first=1&count=10&scenario=ImageBasicHover"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        # Tìm murl (media url) trong murl&quot;:&quot;URL&quot;
        murls = re.findall(r'murl&quot;:&quot;(ht[^&]+)&quot;', html)
        for murl in murls:
            # Ưu tiên các định dạng ảnh jpg, jpeg, png
            if any(ext in murl.lower() for ext in ['.jpg', '.png', '.jpeg', '.webp']):
                return murl
        if murls:
            return murls[0]
    except Exception as e:
        print(f"Error Bing search: {e}")
    return None

for filename, query in queries.items():
    print(f"Searching Bing Images for: '{query}'...")
    img_url = search_bing_image(query)
    
    if img_url:
        print(f"Found URL: {img_url[:70]}...")
        dest_path = os.path.join("public/icons/items", filename)
        try:
            req_dl = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req_dl, timeout=12) as resp_dl, open(dest_path, 'wb') as out:
                out.write(resp_dl.read())
            print(f"SUCCESS: Downloaded and saved {filename}\n")
        except Exception as err:
            print(f"Download failed for {filename}: {err}\n")
    else:
        print(f"No Bing URL found for {filename}\n")
