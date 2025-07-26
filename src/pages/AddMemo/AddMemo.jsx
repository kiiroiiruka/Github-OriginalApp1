import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMemoStore from '@/store/useMemoStore';
import Button from '@/components/ui/Button/Button';
import { formatDateTime } from '@/units/formatDate';  // formatDateをインポート
import styles from './AddMemo.module.css';
import Header from '@/components/layout/Header/Header';

const AddMemo = () => {
    const location = useLocation();
    const priority = location.state?.priority || '中';

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deadline, setDeadline] = useState(''); // ← datetime-local 用
    const [currentTime, setCurrentTime] = useState(formatDateTime(new Date())); // 現在時刻を表示
    const [isDeadlinePast, setIsDeadlinePast] = useState(false);  // 締切が過去かどうかの状態

    // useRefを使ってフォーム要素を参照
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const deadlineRef = useRef(null);

    const addMemo = useMemoStore((state) => state.addMemo);
    const navigate = useNavigate();

    const isValidTitle = (text) => {
        const cleaned = text.replace(/\s/g, '');
        return /[一-龠ぁ-んァ-ンa-zA-Z0-9]/.test(cleaned);
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

    // 締切日時が過去かどうかをチェック
    useEffect(() => {
        if (deadline) {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            setIsDeadlinePast(deadlineDate < now);  // 現在時刻より締切が過去かどうか
        }
    }, [deadline]);

    // 入力欄にフォーカスを当てる関数
    const focusInput = (inputRef) => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
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
            <div className={styles.formGroup}>
                <label className={styles.label}>タイトル（必須）:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={styles.input}
                    ref={titleRef}  // refを追加
                />
                <Button
                    label="入力"
                    onClick={() => focusInput(titleRef)}  // ボタンタップで入力欄にフォーカス
                />
                {!isValidTitle(title) && title.length > 0 && (
                    <p className={styles.errorText}>
                        タイトルには少なくとも1文字の有効な文字（英数字・日本語）を入力してください。
                    </p>
                )}
            </div>

            {/* ✅ 内容入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>内容（最大100文字）:</label>
                <textarea
                    value={content}
                    maxLength={100}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                    ref={contentRef}  // refを追加
                />
                <Button
                    label="入力"
                    onClick={() => focusInput(contentRef)}  // ボタンタップで入力欄にフォーカス
                />
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
                    ref={deadlineRef}  // refを追加
                />
                <Button
                    label="入力"
                    onClick={() => focusInput(deadlineRef)}  // ボタンタップで入力欄にフォーカス
                />
                {isDeadlinePast && (
                    <p className={styles.errorText}>
                        締切は過去の日時を設定できません。
                    </p>
                )}
            </div>

            {/* ✅ 追加ボタン */}
            <div className={styles.buttonWrapper}>
                <Button
                    label="追加する"
                    onClick={handleSubmit}
                    disabled={!isValidTitle(title) || isDeadlinePast} // 締切が過去の場合ボタンを無効化
                />
            </div>
        </div>
    );
};

export default AddMemo;
