from PIL import Image
import os

img_path = 'public/icons/menu_poster.png'
if not os.path.exists(img_path):
    print("Error: menu_poster.png not found")
    exit(1)

img = Image.open(img_path)
width, height = img.size
print(f"Image size: {width}x{height}")

# Precise drink crop coordinates in the bottom row (Y: 650 to 775)
drinks = {
    'pepsi.png': (10, 650, 85, 775),
    'coca.png': (88, 650, 160, 775),
    '7up.png': (165, 650, 235, 775),
    'tra_olong.png': (240, 650, 310, 775),
    'revive.png': (315, 650, 385, 775),
    'sting.png': (390, 650, 460, 775),
    'bo_huc.png': (465, 650, 535, 775),
    'nuoc_suoi.png': (540, 650, 610, 775),
}

output_dir = 'public/icons/items'
os.makedirs(output_dir, exist_ok=True)

for name, box in drinks.items():
    cropped = img.crop(box)
    cropped.save(os.path.join(output_dir, name))
    print(f"Saved drink image: {name} (box: {box})")

print("All drink images cropped perfectly!")
