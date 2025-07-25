import React, { useState, useEffect } from 'react';
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
    const [isDeadlinePast, setIsDeadlinePast] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const addMemo = useMemoStore((state) => state.addMemo);
    const navigate = useNavigate();

    // 入力欄フォーカス検知
    useEffect(() => {
        const handleFocus = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                setIsInputFocused(true);
            }
        };
        const handleBlur = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                setIsInputFocused(false);
            }
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);

        return () => {
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleBlur);
        };
    }, []);

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

    // 現在時刻の更新
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(formatDateTime(new Date()));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // 締切が過去か判定
    useEffect(() => {
        if (deadline) {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            setIsDeadlinePast(deadlineDate < now);
        }
    }, [deadline]);

    return (
        <div className={styles.container}>
            <Header
                title={`優先度: ${priority}`}
                onBack={() => navigate(-1)}
                isInputFocused={isInputFocused}
            />

            <div className={styles.currentTime}>
                <p>現在: {currentTime}</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>タイトル（必須）:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={styles.input}
                />
                {!isValidTitle(title) && title.length > 0 && (
                    <p className={styles.errorText}>
                        タイトルには少なくとも1文字の有効な文字（英数字・日本語）を入力してください。
                    </p>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>内容（最大100文字）:</label>
                <textarea
                    value={content}
                    maxLength={100}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                />
                <p className={styles.remainingText}>残り {100 - content.length} 文字</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>締切日時:</label>
                <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={styles.dateInput}
                />
                {isDeadlinePast && (
                    <p className={styles.errorText}>
                        締切は過去の日時を設定できません。
                    </p>
                )}
            </div>

            <div className={styles.buttonWrapper}>
                <Button
                    label="追加する"
                    onClick={handleSubmit}
                    disabled={!isValidTitle(title) || isDeadlinePast}
                />
            </div>
        </div>
    );
};

export default AddMemo;
