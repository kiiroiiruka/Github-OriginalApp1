import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { autoDeleteAtom } from "@/atom/autoDeleteAtom";
import Header from "@/components/layout/Header/Header";
import Button from "@/components/ui/Button/Button";
import CustomCheckbox from "@/components/ui/CustomCheckbox/CustomCheckbox";
import VerticalList from "@/components/ui/VerticalList/VerticalList";
import { useAuth } from "@/context/auth/useAuth";
import useExpiredMemoDeleter from "@/hooks/useExpiredMemoDeleter";
import { logout } from "../../../firebase/client/auth.js";
import { updateAutoDeleteSetting } from "../../../firebase/client/settings.js";
import styles from "./MemoHome.module.css";

const MemoHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [autoDelete, setAutoDelete] = useAtom(autoDeleteAtom);
  // ページ開くたびに自動削除処理の呼び出し
  useExpiredMemoDeleter();

  // メモリストの優先度を選択した場合の遷移処理
  const handleNavigate = (level) => {
    navigate("/memoList", { state: { level } });
  };

  // トグルボタンの状態を変更するハンドラ
  const handleToggle = async (newState) => {
    if (!user?.uid) return;

    setAutoDelete(newState);
    try {
      await updateAutoDeleteSetting(user.uid, newState);
    } catch (error) {
      console.error("設定の保存に失敗しました:", error);
      setAutoDelete(!newState);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const listItems = [
    { label: "高", onClick: () => handleNavigate("高") },
    { label: "中", onClick: () => handleNavigate("中") },
    { label: "低", onClick: () => handleNavigate("低") },
  ];

  return (
    <div className={styles.page}>
      <Header title="メモ" />
      <main className={styles.container}>
        {/* 優先度選択セクション */}
        <div className={styles.prioritySection}>
          <h2 className={styles.subTitle}>優先度の選択</h2>
          <VerticalList
            items={listItems.map((item) => ({
              ...item,
              className: styles.listItem,
            }))}
          />
        </div>

        {/* 設定セクション */}
        <div className={styles.settingsSection}>
          <h3>設定</h3>
          <div className={styles.toggleWrapper}>
            <label className={styles.toggleLabel}>
              締切過ぎたメモを自動削除
            </label>
            <CustomCheckbox checked={autoDelete} onChange={handleToggle} />
          </div>
          <div className={styles.accountSection}>
            <p className={styles.accountEmail}>{user?.email}</p>
            <Button label="ログアウト" onClick={handleLogout} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemoHome;
