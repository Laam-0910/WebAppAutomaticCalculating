from PIL import Image
import os

img_path = r'public\icons\menu_poster.png'
img = Image.open(img_path)
w, h = img.size
print(f"Poster size: {w}x{h}")

out_dir = r'public\icons\items'
os.makedirs(out_dir, exist_ok=True)

# Bounding boxes for food & drink items directly from the store's original menu poster
# (cropped cleanly without title banners or text sticking out):

items = {
    # MÌ TRỘN (Tô mì trộn trứng ốp la góc trên bên trái)
    'mi_tron.png':       (25,  85,  260, 275),

    # XÚC XÍCH (Hình xúc xích nướng góc trên bên phải)
    'xuc_xich.png':      (330, 60,  600, 275),

    # GÀ (Hình đùi gà rán & ly gà popcorn CP ở giữa bên trái)
    'dui_ga.png':        (25,  360, 280, 480),
    'ga_popcorn.png':    (25,  475, 280, 605),

    # XIÊN QUE (Hình dĩa xiên que chiên góc giữa bên phải)
    'xien_que.png':      (330, 360, 600, 610),
    'pho_mai_vien.png': (330, 360, 600, 430),
    'pho_mai_que.png':  (330, 400, 600, 470),
    'xien_vien.png':     (330, 440, 600, 560),
    'com_hong.png':     (330, 520, 600, 610),
    'com_xanh.png':     (330, 530, 600, 610),
    'cha_bap.png':       (330, 540, 600, 610),

    # KHÁC (Hình bánh hotdog xúc xích mini)
    'hotdog.png':        (25,  635, 280, 760),

    # NƯỚC GIẢI KHÁT (8 lon/chai nước hàng dưới cùng - cắt sạch chỉ lấy thân chai/lon)
    'pepsi.png':         (30,  658, 95,  742),
    'coca.png':          (104, 658, 166, 742),
    '7up.png':           (178, 658, 240, 742),
    'tra_olong.png':     (252, 658, 314, 742),
    'revive.png':        (328, 658, 390, 742),
    'sting.png':         (402, 658, 464, 742),
    'bo_huc.png':        (478, 658, 540, 742),
    'nuoc_suoi.png':     (552, 658, 614, 742),
}

for name, box in items.items():
    cropped = img.crop(box)
    dst = os.path.join(out_dir, name)
    cropped.save(dst, format='PNG')
    print(f"Clean cropped {name} from box {box}")

print("Done clean cropping ALL 26 menu items!")
