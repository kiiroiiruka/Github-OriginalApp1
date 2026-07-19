// 締切日時の初期値を翌日の00:00の値を返す処理。
export const getDefaultDeadline = () => {
  const d = new Date(); //現在時刻を取得
  d.setDate(d.getDate() + 1); // 明日にする
  d.setHours(0, 0, 0, 0); // 時間を00:00にリセット

  // ローカルタイムで YYYY-MM-DDTHH:MM に変換
  const yyyy = d.getFullYear(); //年を取得
  const mm = String(d.getMonth() + 1).padStart(2, "0"); //月を取得（0-11なので+1して1-12にする）して、2桁になるようにゼロパディング
  const dd = String(d.getDate()).padStart(2, "0"); //日を取得して、2桁になるようにゼロパディング
  const hh = String(d.getHours()).padStart(2, "0"); //時間を取得して、2桁になるようにゼロパディング
  const min = String(d.getMinutes()).padStart(2, "0"); //分を取得して、2桁になるようにゼロパディング

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`; //YYYY-MM-DDTHH:MMの形式で文字列を返す。
};
