// components/MemoListDisplay.jsx
import useMemoStore from "@/store/useMemoStore";

const MemoListDisplay = () => {
  const memos = useMemoStore((state) => state.memos);

  return (
    <div className="memo-list-container">
      {memos.length > 0 ? (
        memos.map((memo) => (
          <div key={memo.id} className="memo-item">
            <h3>{memo.title}</h3>
            <p>{memo.content}</p>
          </div>
        ))
      ) : (
        <p>メモがありません。</p>
      )}
    </div>
  );
};

export default MemoListDisplay;
