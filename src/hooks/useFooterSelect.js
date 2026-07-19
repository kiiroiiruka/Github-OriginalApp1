import { useState } from "react";
import { useNavigate } from "react-router-dom"; //ページ遷移ライブラリ

function useFooterSelect(options) {
  const [selected, setSelected] = useState(options[1]); //デフォルトは右側の方を選択
  const navigate = useNavigate(); //ページ遷移のためのフック

  const handleSelect = (key) => {
    if (key === selected) return; // returnなのですでに選択されていれば何もしないで終了。
    setSelected(key); //違う方を選択している場合は更新
    if (key === "memoHome") {
      navigate("/memo"); //memoに割り当てたページに遷移
    } else if (key === "deadlineHome") {
      navigate("/"); //締切に割り当てたページに遷移
    }
  };

  return {
    options,
    selected,
    handleSelect,
  };
}

export default useFooterSelect;
