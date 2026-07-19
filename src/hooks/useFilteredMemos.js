// hooks/useFilteredMemos.js
import { useMemo } from "react";

const useFilteredMemos = (memos, selectedPriorities) => {
  // 引数から送られてきたユーザーの選択した優先度とユーザーのメモデータを抜き取って
  // 優先度でフィルタリングして、さらに期限が近い順にソートしてまとめたものを値として返すフック。
  return useMemo(() => {
    return memos
      .filter((memo) => selectedPriorities.includes(memo.priority))
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      );
  }, [memos, selectedPriorities]);
};

export default useFilteredMemos;
