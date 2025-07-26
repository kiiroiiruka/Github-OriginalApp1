import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useMemoStore from "@/store/useMemoStore";
import Button from "@/components/ui/Button/Button";
import { formatDateTime } from "@/units/formatDate";
import styles from "./AddMemo.module.css";
import Header from "@/components/layout/Header/Header";
import IOSInput from "@/components/ui/IOSInput/IOSInput";

const AddMemo = () => {
    const location = useLocation();
    const priority = location.state?.priority || "中";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [deadline, setDeadline] = useState("");
    const [currentTime, setCurrentTime] = useState(formatDateTime(new Date()));

    const addMemo = useMemoStore((state) => state.addMemo);
    const navigate = useNavigate();

    const isValidTitle = (text) => {
        const cleaned = text.replace(/\s/g, "");
        return /[一-龠ぁ-んァ-ンa-zA-Z0-9]/.test(cleaned);
    };

    const isValidDeadline = (deadline) => {
        if (!deadline) return true;
        return new Date(deadline) >= new Date();
    };

    const handleSubmit = () => {
        addMemo({
            id: Date.now(),
            title,
            content,
            deadline,
            priority,
        });
        navigate(-1);
    };

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
                <IOSInput
                    value={title}
                    onChange={setTitle}
                    as="input"          // ← ここを as に変更
                    maxLength={50}
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
                <IOSInput
                    value={content}
                    onChange={setContent}
                    as="textarea"      // ← textarea の場合も as を使用
                    maxLength={100}
                />
                <p className={styles.remainingText}>
                    残り {100 - content.length} 文字
                </p>
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

            <div className={styles.buttonWrapper}>
                <Button
                    label="追加する"
                    onClick={handleSubmit}
                    disabled={
                        !isValidTitle(title) ||
                        !isValidDeadline(deadline) // ← 締切が必須になる
                    }
                />
            </div>
        </div>
    );
};

export default AddMemo;
