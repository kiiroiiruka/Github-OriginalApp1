import { useCallback, useEffect, useState } from "react";
import {
  completeEmailVerificationFromUrl,
  reloadUser,
  subscribeAuth,
} from "../../../firebase/client/auth.js";
//認証状態をグローバルに管理できるようにするためのContext API
import { AuthContext } from "./useAuth.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //ログイン状態を取得する
    const unsubscribe = subscribeAuth((firebaseUser) => {
      //ログイン状態を取得したらログイン状態をセット
      setUser(firebaseUser);
      //ログイン状態を取得したら読み込み中を解除
      setLoading(false);
    });

    //メール認証を確認する
    completeEmailVerificationFromUrl().then((updated) => {
      if (updated) setUser(updated);
    });

    //アンマウントでComponentの実行状態を削除するためにreturnでセットする。
    return unsubscribe;
  }, []);

  /*
    useCallbackで宣言した関数は、宣言した時点で一度実行される。(ログイン状態を取得する)
    宣言だけをメモリ効率化させて、普通に外部から利用可能な関数を作成。
    最新のユーザー情報が外部ファイルでrefreshUser関数を呼び出した時に入る。
    呼び出す際のコード例:「await refreshUser();」
  */
  const refreshUser = useCallback(async () => {
    const updated = await reloadUser(); //最新のユーザ情報を引っ張ってきてくる関数
    setUser(updated); //最新のユーザ情報をセット
    return updated; //最新のユーザ情報を返す
  }, []);

  /*
    Context APIで管理できる変数の値をセットしている。
    グローバルで呼び出して活用できる値の例
    user:ログイン状態
    loading:読み込み中
    isEmailVerified:メール認証状態
    refreshUser:ログイン状態を更新する関数
  */
  const value = {
    user,
    loading,
    isEmailVerified: user?.emailVerified ?? false,
    refreshUser,
  };

  //returnでラッパーで包んだコンポーネント内で上記valueの値を利用できるようになる。
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
