import { initializeApp } from "firebase/app"; //firebaseを使用するためのモジュールをインポート。
import { getAuth } from "firebase/auth"; //authを使用するためのモジュールをインポート。
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"; //firestoreを使用するためのモジュールをインポート。
import { getStorage } from "firebase/storage"; //storageを使用するためのモジュールをインポート。

//firebaseのAPIキーを.envファイルから取得してセットさせる。
//デプロイ後はNetlifyにセットされた環境変数がセットされて動作する。

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
//firebaseを使用するためのオブジェクトを作成してappに代入。
//以降でappを使用しfirebaseの操作を可能にするオブジェクトの作成をしている。
const app = initializeApp(firebaseConfig);

//firestoreオブジェクトを作成してdbに代入。オフライン時は IndexedDB にキャッシュする。
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
//storageを使うためのオブジェクトを作成している。呼び出して画像データを保存できる。
export const storage = getStorage(app);
//auth(認証)を使うためのオブジェクトを作成してauthに代入。呼び出して認証機能を使用
export const auth = getAuth(app);
