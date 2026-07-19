import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { autoDeleteAtom } from "@/atom/autoDeleteAtom";
import { useAuth } from "@/context/auth/useAuth";
import { subscribeSettings } from "../../firebase/client/settings.js";

/**
 * ログイン済みユーザーの設定を Firestore と同期する。
 * ドキュメントがなければ autoDelete: false をデフォルトとする。
 */
const useSettingsSync = () => {
  const { user, isEmailVerified } = useAuth();
  const setAutoDelete = useSetAtom(autoDeleteAtom);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;

    const unsubscribe = subscribeSettings(
      user.uid,
      (settings) => setAutoDelete(Boolean(settings.autoDelete)),
      (error) => {
        console.error("設定の取得に失敗しました:", error);
        setAutoDelete(false);
      },
    );

    return () => {
      unsubscribe();
      setAutoDelete(false);
    };
  }, [user?.uid, isEmailVerified, setAutoDelete]);
};

export default useSettingsSync;
