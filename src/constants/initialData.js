// initialData.js
export const initialMemos = [
    {
        id: Date.now(), // タイムスタンプを使って一意な ID を生成
        title: '緊急タスク',
        content: 'このタスクはすぐに終わらせる必要があります。',
        deadline: '2025-08-01T12:00:00',
        priority: '高',
    },
    {
        id: Date.now() + 1, // 次の ID は少しずらして一意に
        title: '中程度のタスク',
        content: 'これは中程度の優先度のタスクです。',
        deadline: '2025-08-05T14:00:00',
        priority: '中',
    },
    {
        id: Date.now() + 2, // 同じく一意の ID を生成
        title: '低優先タスク',
        content: 'これは低優先度のタスクです。',
        deadline: '2025-08-10T15:00:00',
        priority: '低',
    },
];
