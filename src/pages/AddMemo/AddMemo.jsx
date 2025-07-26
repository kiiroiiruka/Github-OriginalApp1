import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMemoStore from '@/store/useMemoStore';
import Button from '@/components/ui/Button/Button';
import { formatDateTime } from '@/units/formatDate';
import styles from './AddMemo.module.css';
import Header from '@/components/layout/Header/Header';

const AddMemo = () => {
    const location = useLocation();
    const priority = location.state?.priority || '中';

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deadline, setDeadline] = useState('');
    const [currentTime, setCurrentTime] = useState(formatDateTime(new Date()));

    const addMemo = useMemoStore((state) => state.addMemo);
    const navigate = useNavigate();

    // ✅ 各入力欄のref
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const deadlineRef = useRef(null);

    const isValidTitle = (text) => {
        const cleaned = text.replace(/\s/g, '');
        return /[一-龠ぁ-んァ-ンa-zA-Z0-9]/.test(cleaned);
    };

    const handleSubmit = () => {
        const newMemo = {
            id: Date.now(),
            title,
            content,
            deadline,
            priority,
        };
        addMemo(newMemo);
        navigate(-1);
    };

    // ✅ 現在時刻を1秒ごとに更新
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(formatDateTime(new Date()));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // ✅ フォーカスを与える関数
    const focusInput = (ref) => {
        if (ref.current) {
            ref.current.focus(); // ユーザー操作直後ならiOSでもOK
        }
    };

    return (
        <div className={styles.container}>
            <Header title={`優先度: ${priority}`} onBack={() => navigate(-1)} />

            <div className={styles.currentTime}>
                <p>現在: {currentTime}</p>
            </div>

            {/* ✅ タイトル入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>タイトル（必須）:</label>
                <div className={styles.inputRow}>
                    <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        className={styles.focusButton}
                        onClick={() => focusInput(titleRef)}
                        onTouchEnd={() => focusInput(titleRef)}
                    >
                        入力
                    </button>
                </div>
                {!isValidTitle(title) && title.length > 0 && (
                    <p className={styles.errorText}>
                        タイトルには少なくとも1文字の有効な文字を入力してください。
                    </p>
                )}
            </div>

            {/* ✅ 内容入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>内容（最大100文字）:</label>
                <div className={styles.inputRow}>
                    <textarea
                        ref={contentRef}
                        value={content}
                        maxLength={100}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.textarea}
                    />
                    <button
                        className={styles.focusButton}
                        onClick={() => focusInput(contentRef)}
                        onTouchEnd={() => focusInput(contentRef)}
                    >
                        入力
                    </button>
                </div>
                <p className={styles.remainingText}>残り {100 - content.length} 文字</p>
            </div>

            {/* ✅ 締切日時入力 */}
            <div className={styles.formGroup}>
                <label className={styles.label}>締切日時:</label>
                <div className={styles.inputRow}>
                    <input
                        ref={deadlineRef}
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={styles.dateInput}
                    />
                    <button
                        className={styles.focusButton}
                        onClick={() => focusInput(deadlineRef)}
                        onTouchEnd={() => focusInput(deadlineRef)}
                    >
                        入力
                    </button>
                </div>
            </div>

            <div className={styles.buttonWrapper}>
                <Button
                    label="追加する"
                    onClick={handleSubmit}
                    disabled={!isValidTitle(title)}
                />
            </div>
        </div>
    );
};

export default AddMemo;
