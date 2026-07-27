import urllib.request
import urllib.parse
import json
import re
import os
import sys

# Force utf-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

os.makedirs("public/icons/items", exist_ok=True)

search_queries = {
    "mi_tron_trung.png": "mì trộn trứng ốp la",
    "mi_tron_topping.png": "mì trộn topping đồ chiên xiên que",
    "mi_tron_indo.png": "mì trộn indo trứng ốp la",
    "xuc_xich_thuong.png": "xúc xích xiên que chiên",
    "xuc_xich_xong_khoi.png": "xúc xích xông khói xiên",
    "xuc_xich_pho_mai.png": "xúc xích phô mai vàng chiên",
    "dui_ga_ran.png": "đùi gà rán giòn rụm",
    "ga_popcorn.png": "gà viên popcorn chiên",
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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_image_url(query):
    try:
        url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        vqd_match = re.search(r'vqd=([\d-]+)', html) or re.search(r'vqd="([\d-]+)"', html)
        if not vqd_match:
            return None

        vqd = vqd_match.group(1)
        img_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&vqd={vqd}&o=json"
        req_img = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req_img, timeout=8) as resp_img:
            data = json.loads(resp_img.read().decode('utf-8', errors='ignore'))
            results = data.get('results', [])
            for r in results:
                image_link = r.get('image')
                if image_link and image_link.startswith('http') and not image_link.endswith('.svg'):
                    return image_link
    except Exception as e:
        print(f"Error searching: {e}")
    return None

for filename, query in search_queries.items():
    print(f"Searching web for {filename}...")
    img_url = get_image_url(query)
    
    if img_url:
        print(f"Found URL: {img_url[:60]}...")
        dest_path = os.path.join("public/icons/items", filename)
        try:
            req_dl = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req_dl, timeout=10) as resp_dl, open(dest_path, 'wb') as out:
                out.write(resp_dl.read())
            print(f"SUCCESS: saved {filename}")
        except Exception as err:
            print(f"Failed download {filename}: {err}")
    else:
        print(f"No URL found for {filename}")
