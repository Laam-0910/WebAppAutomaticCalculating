import urllib.request
import urllib.parse
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("public/icons/items", exist_ok=True)

com_hong_query = "cốm hồng chiên xù xiên que"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
}

encoded_q = urllib.parse.quote(com_hong_query)
url = f"https://www.bing.com/images/async?q={encoded_q}&first=1&count=15&scenario=ImageBasicHover"

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    
    murls = re.findall(r'murl&quot;:&quot;(ht[^&]+)&quot;', html)
    valid_urls = [u for u in murls if any(ext in u.lower() for ext in ['.jpg', '.png', '.jpeg', '.webp'])]
    
    for img_url in valid_urls:
        print("Trying com_hong URL:", img_url[:60])
        try:
            # Quote path to avoid ascii encode error
            parsed = urllib.parse.urlparse(img_url)
            safe_url = urllib.parse.urlunparse((
                parsed.scheme,
                parsed.netloc,
                urllib.parse.quote(parsed.path),
                parsed.params,
                parsed.query,
                parsed.fragment
            ))
            req_dl = urllib.request.Request(safe_url, headers=headers)
            dest_path = os.path.join("public/icons/items", "com_hong.png")
            with urllib.request.urlopen(req_dl, timeout=10) as resp_dl, open(dest_path, 'wb') as out:
                out.write(resp_dl.read())
            print("SUCCESS: com_hong.png downloaded and saved!")
            break
        except Exception as err:
            print("Download attempt failed:", err)
except Exception as e:
    print("Bing search failed:", e)
