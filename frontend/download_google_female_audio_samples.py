import urllib.request
import urllib.parse
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("public/audio", exist_ok=True)

# Lấy giọng nữ Google Maps / Google Translate chuẩn chính thức
text = "Đã nhận thành công thanh toán đơn hàng!"
encoded_text = urllib.parse.quote(text)
google_tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q={encoded_text}"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://translate.google.com/'
}

print("Tải âm thanh Giọng Nữ Google Maps chuẩn...")
dest_path = os.path.join("public/audio", "google_female_payment.mp3")

try:
    req = urllib.request.Request(google_tts_url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp, open(dest_path, 'wb') as out:
        out.write(resp.read())
    print(f"SUCCESS: Tải thành công file MP3 Giọng Nữ Google Maps vào {dest_path}")
except Exception as e:
    print(f"Error downloading Google Maps female TTS: {e}")
