// hooks/useFilteredMemos.js
import { useMemo } from "react";

const useFilteredMemos = (memos, selectedPriorities) => {
    return useMemo(() => {
        return memos
            .filter((memo) => selectedPriorities.includes(memo.priority))
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }, [memos, selectedPriorities]);
};

export default useFilteredMemos;
