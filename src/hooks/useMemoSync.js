import { useEffect } from "react";
import { useAuth } from "@/context/auth/useAuth";
import useMemoStore from "@/store/useMemoStore";

/**
 * ログイン済みユーザーのメモを Firestore と同期する。
 * MainRoutes マウント時に一度だけ呼ぶ。
 */
const useMemoSync = () => {
  const { user, isEmailVerified } = useAuth();

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;

    let unsubscribe = () => {};

    useMemoStore
      .getState()
      .initMemosForUser(user.uid)
      .then((unsub) => {
        unsubscribe = unsub ?? (() => {});
      })
      .catch((error) => {
        console.error("メモの初期化に失敗しました:", error);
      });

    return () => {
      unsubscribe();
      useMemoStore.getState().clearMemos();
    };
  }, [user?.uid, isEmailVerified]);
};

export default useMemoSync;
