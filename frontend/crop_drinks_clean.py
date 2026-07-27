from PIL import Image
import os

img_path = r'public\icons\menu_poster.png'
img = Image.open(img_path)

out_dir = r'public\icons\items'
os.makedirs(out_dir, exist_ok=True)

# Y coordinates strictly targeting ONLY the can/bottle body:
# y_upper = 658 (below the red banner "NƯỚC GIẢI KHÁT")
# y_lower = 742 (above the text "12K/LON", "12K/CHAI")

drinks = {
    'pepsi.png':     (30,  658, 95,  742),
    'coca.png':      (104, 658, 166, 742),
    '7up.png':       (178, 658, 240, 742),
    'tra_olong.png': (252, 658, 314, 742),
    'revive.png':    (328, 658, 390, 742),
    'sting.png':     (402, 658, 464, 742),
    'bo_huc.png':    (478, 658, 540, 742),
    'nuoc_suoi.png': (552, 658, 614, 742),
}

for name, box in drinks.items():
    cropped = img.crop(box)
    dst = os.path.join(out_dir, name)
    cropped.save(dst, format='PNG')
    print(f"Clean cropped {name} from box {box}")

print("Done clean cropping drinks from menu poster!")
