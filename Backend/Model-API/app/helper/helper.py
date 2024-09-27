import tensorflow as tf
import numpy as np
import google.generativeai as genai
import os



class SingletonModel:
    _instance = None

    @classmethod
    def get_instance(cls):
        if not cls._instance:
            cls._instance = cls()
        return cls._instance


class LocationModel(SingletonModel):
    def __init__(self):
        self.model = tf.keras.models.load_model('app/models/location.h5')

    def predict(self, img_array):
        predictions = self.model.predict(img_array)
        predicted_class = np.argmax(predictions, axis=1)
        classes = [
            "Bao_Tang_Chung_Tich_Chien_Tranh",
            "Bao_Tang_Lich_Su",
            "Bao_Tang_My_Thuat",
            "Bao_Tang_Thanh_Pho",
            "Ben_Nha_Rong",
            "Bitexco",
            "Bui_Vien_Tay",
            "Buu_Dien_TPHCM",
            "Cau_Mong",
            "Cho_Ben_Thanh",
            "Cho_Binh_Tay",
            "Chua_Ba_Thien_Hau",
            "Chua_Buu_Long",
            "Chua_Ngoc_Hoang",
            "Chua_Phap_Hoa",
            "Chua_Vinh_Nghiem",
            "Cot_Co_Thu_Ngu",
            "Dinh_Doc_Lap",
            "Ho_Con_Rua",
            "Landmark_81",
            "Nha_Hat_Thanh_Pho",
            "Nha_Tho_Duc_Ba",
            "Nha_Tho_Giao_Xu_Tan_Dinh",
            "Thao_Cam_Vien",
            "UBND_TPHCM",
            "Unknown"
        ]
        class_names = classes[predicted_class[0],predicted_class[1],predicted_class[2]]
        return class_names
    
class FoodModel(SingletonModel):
    def __init__(self):
        self.model = tf.keras.models.load_model('app/models/food.h5')

    def predict(self, img_array):
        predictions = self.model.predict(img_array)
        predicted_class = np.argmax(predictions, axis=1)
        classes = [
            'Banh_Beo',
            'Banh_Can',
            'Banh_Gio',
            'Banh_Mi',
            'Banh_Trang_Nuong',
            'Banh_Xeo',
            'Bap_Xao',
            'Bun_Bo',
            'Bun_Cha',
            'Bun_Dau',
            'Bun_Mam',
            'Bun_Thit_Nuong', 
            'Cao_Lau', 
            'Chao_Long', 
            'Com_Tam', 
            'Goi_Cuon', 
            'Hu_Tieu', 
            'Mi_Quang', 
            'Pha_Lau', 
            'Pho', 
            'Unknown']
        class_names = classes[predicted_class[0],predicted_class[1],predicted_class[2]]
        return class_names

location_model = LocationModel.get_instance()
food_model = FoodModel.get_instance()
    
