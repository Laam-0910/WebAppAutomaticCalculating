from PIL import Image
import os

img_path = r'public\icons\menu_poster.png'
if not os.path.exists(img_path):
    print("ERROR: menu_poster.png missing")
    exit(1)

img = Image.open(img_path)
w, h = img.size
print(f"Poster size: {w}x{h}")

# The menu poster has 8 drink items across the bottom row.
# Let's define exact bounding boxes (left, upper, right, lower) for each item:
# Total height = 781, bottom row is roughly y=620 to 770.
# Total width = 619, 8 items approx ~75px width each.

out_dir = r'public\icons\items'
os.makedirs(out_dir, exist_ok=True)

# 8 drinks from left to right:
# 1. Pepsi: x ~ 25..95, y ~ 625..775
# 2. Coca: x ~ 100..170, y ~ 625..775
# 3. 7Up: x ~ 175..245, y ~ 625..775
# 4. Trà Ô Long: x ~ 250..320, y ~ 625..775
# 5. Revive: x ~ 325..395, y ~ 625..775
# 6. Sting: x ~ 400..470, y ~ 625..775
# 7. Bò Húc: x ~ 475..545, y ~ 625..775
# 8. Nước Suối: x ~ 550..610, y ~ 625..775

drinks = {
    'pepsi.png':     (25,  625, 98,  775),
    'coca.png':      (100, 625, 172, 775),
    '7up.png':       (175, 625, 248, 775),
    'tra_olong.png': (250, 625, 322, 775),
    'revive.png':    (325, 625, 398, 775),
    'sting.png':     (400, 625, 472, 775),
    'bo_huc.png':    (475, 625, 548, 775),
    'nuoc_suoi.png': (550, 625, 615, 775),
}

for name, box in drinks.items():
    cropped = img.crop(box)
    dst = os.path.join(out_dir, name)
    cropped.save(dst, format='PNG')
    print(f"Cropped {name} from box {box}")

print("Done cropping drinks from menu poster!")
