from PIL import Image
import os

img_path = 'public/icons/menu_poster.png'
if not os.path.exists(img_path):
    print("Error: menu_poster.png not found")
    exit(1)

img = Image.open(img_path)
width, height = img.size
print(f"Image size: {width}x{height}")

# Define crop bounding boxes (left, upper, right, lower)
crops = {
    # Mì
    'mi_tron.png': (20, 70, 150, 235),
    
    # Xúc xích
    'xuc_xich.png': (500, 70, 610, 245),
    
    # Gà
    'dui_ga.png': (25, 355, 135, 465),
    'ga_popcorn.png': (155, 520, 285, 615),
    
    # Xiên
    'xien_que.png': (525, 350, 615, 690),
    
    # Khác
    'hotdog.png': (30, 630, 175, 720),
    
    # Nước giải khát (hàng dưới cùng)
    'pepsi.png': (25, 645, 95, 765),
    'coca.png': (98, 645, 168, 765),
    '7up.png': (172, 645, 242, 765),
    'tra_olong.png': (248, 645, 318, 765),
    'revive.png': (322, 645, 392, 765),
    'sting.png': (398, 645, 468, 765),
    'bo_huc.png': (472, 645, 542, 765),
    'nuoc_suoi.png': (545, 645, 610, 765),
}

output_dir = 'public/icons/items'
os.makedirs(output_dir, exist_ok=True)

for name, box in crops.items():
    cropped = img.crop(box)
    cropped.save(os.path.join(output_dir, name))
    print(f"Saved: {name}")

print("Done cropping menu items!")
