import React from "react";
import Header from "@/components/layout/Header/Header";
import VerticalList from "@/components/ui/VerticalList/VerticalList";
import { useNavigate } from "react-router-dom";
import useMemoStore from "@/store/useMemoStore";
import { formatDateTime } from "@/units/formatDate";
import usePriorities from "@/hooks/usePriorities";
import useRealTimeClock from "@/hooks/useRealTimeClock";
import useFilteredMemos from "@/hooks/useFilteredMemos";
import useExpiredMemoDeleter from "@/hooks/useExpiredMemoDeleter"; // 新しく追加したフック
import styles from "./Deadline.module.css";

const PRIORITY_OPTIONS = ["高", "中", "低"];

const Deadline = () => {
    const navigate = useNavigate();
    const { memos } = useMemoStore(); // ストアからメモと削除関数を取得
    const [selectedPriorities, togglePriority] = usePriorities(["高"]);
    const todayDate = useRealTimeClock(); // 毎秒更新される現在時刻
    const filteredMemos = useFilteredMemos(memos, selectedPriorities);

    // 期限切れメモの定期削除処理を呼び出す
    useExpiredMemoDeleter();

    const handleNavigate = (id) => {
        const selectedIds = [id];  // 選択されたidをstateに渡す
        navigate("/memoData", { state: { selectedIds } }); // stateを渡して遷移
    };

    // 残り時間を計算して返す関数
    const calculateRemainingTime = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffMs = deadlineDate - now;

        if (diffMs < 0) return { text: "締切済み", className: styles.red, blink: false };

        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 3) {
            return { text: `残り${diffDays}日`, className: styles.lightBlue, blink: false };
        } else if (diffDays <= 3 && diffDays > 0) {
            return { text: `残り${diffDays}日`, className: styles.yellow, blink: false };
        } else if (diffHours <= 24 && diffHours > 0) {
            return { text: `残り${diffHours}時間`, className: styles.yellow, blink: false };
        } else if (diffMins <= 60 && diffMins > 0) {
            return { text: `残り${diffMins}分${diffSecs % 60}秒`, className: styles.red, blink: true };
        } else if (diffSecs <= 60 && diffSecs > 0) {
            return { text: `残り${diffSecs}秒`, className: styles.red, blink: true };
        }

        return { text: "残り不明", className: styles.lightBlue, blink: false };
    };

    return (
        <div className={styles.container}>
            <Header title="締切" />

            {/* 現在時刻の表示 */}
            <div className={styles.dateContainer}>
                <p>現在:{formatDateTime(todayDate, true)}</p>
            </div>
            <div className={styles.body}>
                <h4 className={styles.subTitle}>表示させる予定の優先度</h4>
                <div className={styles.toggleGroup}>
                    {PRIORITY_OPTIONS.map((level) => (
                        <button
                            key={level}
                            className={`${styles.toggleButton} ${selectedPriorities.includes(level) ? styles.active : ""}`}
                            onClick={() => togglePriority(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <h2 className={styles.subTitle}>選択した優先度のメモ</h2>
            </div>

            {/* スクロール可能なラッパー */}
            <div className={styles.scrollContainer}>
                <VerticalList
                    items={filteredMemos.map((memo) => {
                        const { text, className, blink } = calculateRemainingTime(memo.deadline);

                        return {
                            id: memo.id,
                            label: (
                                <div onClick={() => handleNavigate(memo.id)}>
                                    <div>{memo.title}</div>
                                    <div className={`${className} ${blink ? styles.blinkRed : ""}`}>
                                        <span>締切: {formatDateTime(memo.deadline)}</span>
                                        <br />
                                        <span className={styles.reminder}>{text}</span>
                                    </div>
                                </div>
                            ),
                        };
                    })}
                />
            </div>
        </div>
    );
};

export default Deadline;
