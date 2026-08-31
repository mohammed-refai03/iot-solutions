import os
from PIL import Image

def convert_to_webp(image_path, target_kb=90):
    try:
        img = Image.open(image_path)
        base_name = os.path.splitext(image_path)[0]
        webp_path = base_name + '.webp'
        
        # Start with quality 90
        quality = 90
        img.save(webp_path, 'webp', quality=quality)
        
        # Reduce quality if size > target_kb
        while os.path.getsize(webp_path) > target_kb * 1024 and quality > 10:
            quality -= 5
            img.save(webp_path, 'webp', quality=quality)
            
        print(f'Converted {image_path} to {webp_path} ({os.path.getsize(webp_path)//1024} KB)')
        
        # Remove original
        os.remove(image_path)
    except Exception as e:
        print(f'Error processing {image_path}: {e}')

images_dir = r'd:\office-tasks\smart-home\assets\images'
for filename in os.listdir(images_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        convert_to_webp(os.path.join(images_dir, filename))
