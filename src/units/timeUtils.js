// 現在の時刻をフォーマットして返す関数
export const getFormattedTime = () => {
    return new Date().toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24時間表示
    });
};

// 1秒ごとに時刻を更新する関数
export const startRealTimeClock = (setTime) => {
    const intervalId = setInterval(() => {
        setTime(getFormattedTime());
    }, 1000);

    // クリーンアップ関数: コンポーネントがアンマウントされるときにタイマーをクリア
    return () => clearInterval(intervalId);
};
