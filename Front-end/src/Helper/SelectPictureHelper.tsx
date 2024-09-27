import * as ImagePicker from "expo-image-picker";
import { useLoading } from "src/context/LoadingContext";
import { useToast } from "src/context/ToastContext";
import { uploadImageAsync } from "src/services/firebase";
function UseTakePictureHelper() {
  const { showToast } = useToast();
  const { startLoading } = useLoading();

  const onPressTakePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      showToast("Library access permission denied", "ERROR");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.canceled) {
      return;
    }
    startLoading();
    const asset = result.assets[0];
    if (!asset) return;
    const image_url = await uploadImageAsync(asset.uri);
    return image_url;
  };
  const onPressCamera = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      showToast("Camera permission denied", "ERROR");
      return;
    }

    // Launch camera and capture image
    const result = await ImagePicker.launchCameraAsync({ base64: true });

    if (result.canceled) {
      showToast("Camera permission denied", "ERROR");
      return;
    }

    const asset = result.assets[0];
    if (!asset) {
      return;
    }

    startLoading();

    const image_url = await uploadImageAsync(asset.uri);
    return image_url;
  };

  return {
    onPressTakePicture,
    onPressCamera,
  };
}

export default UseTakePictureHelper;
