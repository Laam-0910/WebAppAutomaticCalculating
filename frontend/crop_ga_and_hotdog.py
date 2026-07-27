from PIL import Image
import os

img_path = r'public\icons\menu_poster.png'
img = Image.open(img_path)
out_dir = r'public\icons\items'

# Crop GÀ & KHÁC sections with exact boundaries:
# 1. Đùi gà rán: upper image in GÀ section
cropped_dui_ga = img.crop((25, 360, 220, 465))
cropped_dui_ga.save(os.path.join(out_dir, 'dui_ga.png'))
print("Cropped dui_ga.png:", cropped_dui_ga.size)

# 2. Gà viên popcorn CP: red CP bucket with popcorn chicken (strictly y=470..595)
cropped_ga_popcorn = img.crop((25, 470, 285, 595))
cropped_ga_popcorn.save(os.path.join(out_dir, 'ga_popcorn.png'))
print("Cropped ga_popcorn.png:", cropped_ga_popcorn.size)

# 3. Hotdog xúc xích mini: hotdog sandwich (strictly y=630..755)
cropped_hotdog = img.crop((25, 630, 285, 755))
cropped_hotdog.save(os.path.join(out_dir, 'hotdog.png'))
print("Cropped hotdog.png:", cropped_hotdog.size)

print("Done fixing Gà popcorn CP & Hotdog images!")
