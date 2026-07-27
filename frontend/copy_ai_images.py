import shutil, glob, os

brain = r'C:\Users\caonh\.gemini\antigravity\brain\20dff380-8839-449c-a57d-74caa8402796'
dest = r'public\icons\items'
os.makedirs(dest, exist_ok=True)

copies = {
    # Xiên viên chiên - dùng chung 1 ảnh cho cá/bò/tôm/mực viên
    'xien_vien_chien_*.png':   'xien_vien.png',
    # Phô mai viên - cheese balls
    'pho_mai_vien_*.png':      'pho_mai_vien.png',
    # Phô mai que - mozzarella sticks
    'pho_mai_que_*.png':       'pho_mai_que.png',
    # Xúc xích nướng
    'xuc_xich_nuong_*.png':    'xuc_xich.png',
    # Cốm hồng / cốm xanh
    'com_hong_xanh_*.png':     'com_hong.png',
    # Chả bắp hồng hà
    'cha_bap_hong_ha_*.png':   'cha_bap.png',
    # 7Up green can
    'drink_7up_green_*.png':   '7up.png',
}

for pattern, dest_name in copies.items():
    matches = sorted(glob.glob(os.path.join(brain, pattern)))
    if matches:
        src = matches[-1]
        dst = os.path.join(dest, dest_name)
        shutil.copy2(src, dst)
        print(f'OK: {os.path.basename(src)} -> {dest_name}')
    else:
        print(f'MISSING: {pattern}')

# Also copy cốm xanh from same cốm image
src_com = os.path.join(dest, 'com_hong.png')
dst_com_xanh = os.path.join(dest, 'com_xanh.png')
if os.path.exists(src_com):
    shutil.copy2(src_com, dst_com_xanh)
    print('OK: com_hong.png -> com_xanh.png')

print('Done!')
