import os
import numpy as np
from PIL import Image
import requests
from werkzeug.utils import secure_filename

def download_and_process_image(image_url: str) -> np.ndarray:
    response = requests.get(image_url)
    if response.status_code != 200:
        raise ValueError(f"Failed to download image: {response.status_code}")
    
    temp_path = os.path.join('/tmp', secure_filename('image.jpg'))
    with open(temp_path, 'wb') as f:
        f.write(response.content)
    
    img = Image.open(temp_path).resize((299, 299))
    img_array = np.array(img).astype('float32') / 255
    img_array = np.expand_dims(img_array, axis=0)
    
    os.remove(temp_path)
    
    return img_array