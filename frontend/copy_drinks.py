import shutil, glob, os

brain = r'C:\Users\caonh\.gemini\antigravity\brain\20dff380-8839-449c-a57d-74caa8402796'
dest = r'public\icons\items'
os.makedirs(dest, exist_ok=True)

copies = {
    'drink_7up_*.png': '7up.png',
    'drink_tra_olong_*.png': 'tra_olong.png',
    'drink_revive_*.png': 'revive.png',
    'drink_sting_*.png': 'sting.png',
    'drink_redbull_*.png': 'bo_huc.png',
    'drink_aquafina_*.png': 'nuoc_suoi.png',
}

for pattern, dest_name in copies.items():
    matches = sorted(glob.glob(os.path.join(brain, pattern)))
    if matches:
        src = matches[-1]  # newest file
        dst = os.path.join(dest, dest_name)
        shutil.copy2(src, dst)
        print(f'Copied {os.path.basename(src)} -> {dest_name}')
    else:
        print(f'NOT FOUND: {pattern}')

print('All done!')
