import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Button from "@/components/ui/Button/Button";
import useMemoStore from "@/store/useMemoStore";
import { formatDateTime } from "@/units/formatDate";
import { getDefaultDeadline } from "@/units/getDefaultDeadline";
import styles from "./AddMemo.module.css";

const AddMemo = () => {
  //遷移前に送った値を受け取る。
  const location = useLocation();
  // 送られてきた優先度を取得。もし送られてこなかった場合は「中」をデフォルトにする。
  const priority = location.state?.priority || "中";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const defaultDeadline = getDefaultDeadline();
  const [deadline, setDeadline] = useState(defaultDeadline); //締め切り日時の状態を管理するためのuseStateフック。翌日の0時を初期値とする。
  const [currentTime, setCurrentTime] = useState(formatDateTime(new Date())); // 現在時刻を表示するための状態

  const addMemo = useMemoStore((state) => state.addMemo); // ZustandストアからaddMemo関数を取得
  const navigate = useNavigate(); // 画面遷移のためのフック

  const isValidTitle = (text) => {
    const cleaned = text.replace(/\s/g, "");
    return /[一-龠ぁ-んァ-ンa-zA-Z0-9]/.test(cleaned);
  }; // タイトルのバリデーション関数。空白を除去した後、英数字か日本語が含まれているかをチェックする。

  // 締切日時が現在時刻より後であるかを検証する関数
  const isValidDeadline = (deadline) => {
    if (!deadline) return true;
    return new Date(deadline) >= new Date();
  }; // 締切日時が現在時刻より後であるかを検証する関数

  // 送信ボタンがクリックされたときの処理
  const handleSubmit = async () => {
    await addMemo({
      id: Date.now(),
      title,
      content,
      deadline,
      priority,
    });
    navigate(-1); //前のページに戻る。
  };

  // 現在時刻(ページに表示される方のやつ)を毎秒更新するためのuseEffectフック
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatDateTime(new Date()));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <Header title={`優先度: ${priority}`} onBack={() => navigate(-1)} />

      <div className={styles.currentTime}>
        <p>現在: {currentTime}</p>
      </div>

      {/* タイトル入力 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>タイトル（必須）:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          placeholder="タイトルを入力"
          className={styles.input}
        />
        {!isValidTitle(title) && title.length > 0 && (
          <p className={styles.errorText}>
            タイトルには少なくとも1文字の有効な文字（英数字・日本語）を入力してください。
          </p>
        )}
      </div>

      {/* 内容入力 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>内容（任意 ※最大100文字）</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={100}
          placeholder="内容を入力"
          className={styles.textarea}
        />
        <p className={styles.remainingText}>残り {100 - content.length} 文字</p>
      </div>

      {/* 締切入力 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>締切日時（必須）:</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={styles.dateInput}
        />
        {!isValidDeadline(deadline) && deadline && (
          <p className={styles.errorText}>
            締切日時は現在時刻より後の日時を設定してください。
          </p>
        )}
      </div>

      <Button
        label="追加する"
        onClick={handleSubmit}
        disabled={!isValidTitle(title) || !isValidDeadline(deadline)}
      />
    </div>
  );
};

export default AddMemo;
