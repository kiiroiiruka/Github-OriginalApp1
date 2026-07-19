import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../config.js";

export const DEFAULT_SETTINGS = {
  autoDelete: false,
};

const settingsDoc = (uid) => doc(db, "users", uid, "settings", "app");

export const subscribeSettings = (uid, onChange, onError) =>
  onSnapshot(
    settingsDoc(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(DEFAULT_SETTINGS);
        return;
      }
      onChange({ ...DEFAULT_SETTINGS, ...snapshot.data() });
    },
    onError,
  );

export const updateAutoDeleteSetting = async (uid, autoDelete) => {
  await setDoc(settingsDoc(uid), { autoDelete }, { merge: true });
};
