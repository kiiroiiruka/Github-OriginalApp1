const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// 日付をフォーマットする関数
export const formatDateTime = (dateString, showSeconds = false) => {
    if (!dateString) return "未設定";

    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    // showSeconds=true の場合は曜日と秒も表示
    if (showSeconds) {
        return `${month}月${day}日 (${weekday}) ${hour}:${minute}:${second}`;
    }

    // それ以外は曜日なし・秒なし
    return `${month}月${day}日 ${hour}:${minute}`;
};
