import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";

const firebaseConfig = {
  apiKey: "AIzaSyB3Po25Xnsl8suNV95kU9V_4TDGzk6Ua8g",
  authDomain: "travelappsu.firebaseapp.com",
  projectId: "travelappsu",
  storageBucket: "travelappsu.appspot.com",
  messagingSenderId: "1054577620610",
  appId: "1:1054577620610:web:92487b9cdcc38a5eb9a69b",
  measurementId: "G-2P50HC81TS",
};

// /=======

const app = initializeApp(firebaseConfig);

export async function uploadImageAsync(uri: string): Promise<string> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = (e) => reject(new TypeError("Network request failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4().toString());
  await uploadBytes(fileRef, blob);

  // blob.close();

  return await getDownloadURL(fileRef);
}

//isoClientId : 160269674777-v6tbcapbjm94b38geel3oqjv93nobkgu.apps.googleusercontent.com

// android = 160269674777-vgip01g5m7rpiho6k96scv8se2uuf43t.apps.googleusercontent.com
