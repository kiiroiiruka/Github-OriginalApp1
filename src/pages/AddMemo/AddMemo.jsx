import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMemoStore from '@/store/useMemoStore';
import Button from '@/components/ui/Button/Button';
import { formatDateTime } from '@/units/formatDate';  // formatDateをインポート
import styles from './AddMemo.module.css';
import Header from '@/components/layout/Header/Header';
import Keypad from '@/components/ui/Keypad/Keypad';
const AddMemo = () => {
    const location = useLocation();
    const priority = location.state?.priority || '中';

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deadline, setDeadline] = useState(''); // ← datetime-local 用
    const [currentTime, setCurrentTime] = useState(formatDateTime(new Date())); // 現在時刻を表示

    const addMemo = useMemoStore((state) => state.addMemo);
    const navigate = useNavigate();

    const isValidTitle = (text) => {
        const cleaned = text.replace(/\s/g, '');
        return /[一-龠ぁ-んァ-ンa-zA-Z0-9]/.test(cleaned);
    };

    // ✅ 現在時刻より前の期限をチェックする関数
    const isValidDeadline = (deadline) => {
        if (!deadline) return true;  // 空の場合は無条件に有効
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        return deadlineDate >= currentDate;  // 現在時刻より前なら無効
    };

    const handleSubmit = () => {
        const newMemo = {
            id: Date.now(),
            title,
            content,
            deadline, // ← datetime-local の値をそのまま保存
            priority,
        };
        addMemo(newMemo);
        navigate(-1);
    };

    // ✅ 時刻を1秒ごとに更新
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(formatDateTime(new Date()));
        }, 1000);  // 1秒ごとに更新

        return () => clearInterval(intervalId); // クリーンアップ
    }, []);
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };
    return (
        <div className={styles.container}>
            <Header
                title={`優先度: ${priority}`}
                onBack={() => navigate(-1)}
            />

            {/* ✅ 現在時刻表示 */}
            <div className={styles.currentTime}>
                <p>現在: {currentTime}</p> {/* 現在時刻を表示 */}
            </div>

            {/* ✅ タイトル入力 */}
            {/* ✅ タイトル入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>タイトル（必須）:</label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                    readOnly={isIOS()} // iOS のときは入力不可
                />

                {isIOS() && (
                    <Keypad
                        onInput={(char) => setTitle((prev) => prev + char)}
                        onDelete={() => setTitle((prev) => prev.slice(0, -1))}
                    />
                )}

                {!isValidTitle(title) && title.length > 0 && (
                    <p className={styles.errorText}>
                        タイトルには少なくとも1文字の有効な文字（英数字・日本語）を入力してください。
                    </p>
                )}
            </div>


            {/* ✅ 内容入力 */}
            {/* ✅ 内容入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>内容（最大100文字）:</label>

                <textarea
                    value={content}
                    maxLength={100}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                    readOnly={isIOS()} // iOS のときは Keypad 経由で入力
                />

                {isIOS() && (
                    <Keypad
                        onInput={(char) => setContent((prev) => prev + char)}
                        onDelete={() => setContent((prev) => prev.slice(0, -1))}
                    />
                )}

                <p className={styles.remainingText}>
                    残り {100 - content.length} 文字
                </p>
            </div>

            {/* ✅ 日付 + 時刻入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>締切日時:</label>
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

            {/* ✅ 追加ボタン */}
            <div className={styles.buttonWrapper}>
                <Button
                    label="追加する"
                    onClick={handleSubmit}
                    disabled={!isValidTitle(title) || !isValidDeadline(deadline)}  // 追加ボタンの無効化条件にdeadlineチェックも追加
                />
            </div>
        </div>
    );
};

export default AddMemo;
