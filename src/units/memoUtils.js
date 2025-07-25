export const filterAndSortMemos = (memos, level) => {
    if (!Array.isArray(memos) || !level) return [];
    return memos
        .filter(memo => memo.priority === level)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
};
