// hooks/usePriorities.js
import { useState } from "react";

const usePriorities = (initialPriorities = ["高"]) => {
  //選択されている優先度の状態を管理するためのフック。
  const [selectedPriorities, setSelectedPriorities] =
    useState(initialPriorities);

  const togglePriority = (level) => {
    //中にすでにある変数の値の活用した関数。
    setSelectedPriorities(
      (prev) =>
        prev.includes(level) //すでに中に値が入っているか入っていないかの確認
          ? prev.filter((p) => p !== level) //すでに選択済みのやつの場合は前の値から選択された内容を除いた内容に更新。
          : [...prev, level], //入っていなかったら加える(levelを加えた新しい配列に更新)
    );
  };

  //選択されている内容を管理して返す内容。
  //togglePriorityに押した値を入れて起動させると追加、または選択解除される関数。
  return [selectedPriorities, togglePriority];
};

export default usePriorities;
