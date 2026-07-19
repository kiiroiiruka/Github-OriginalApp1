# ミニメモ

優先度と締切を設定できる、シンプルなメモ管理アプリです。  
PWA 対応のため、スマートフォンにインストールしてオフラインでも利用できます。

## 主な機能

- **優先度別メモ管理** — 高・中・低の3段階でメモを分類
- **締切タイマー** — 残り時間をリアルタイム表示（締切間近は警告表示）
- **メモの追加・編集・削除**
- **期限切れメモの自動削除** — 設定で ON/OFF 切り替え可能
- **ローカル保存** — ブラウザの localStorage にデータを永続化
- **PWA** — ホーム画面への追加・スタンドアロン表示に対応

## 技術スタック

### コア

| ライブラリ | 用途 |
|-----------|------|
| [React](https://react.dev/) 19 | UI フレームワーク |
| [Vite](https://vite.dev/) 7 | ビルドツール・開発サーバー |
| [React Router](https://reactrouter.com/) 7 | ページルーティング |

### 状態管理

| ライブラリ | 用途 |
|-----------|------|
| [Zustand](https://zustand.docs.pmnd.rs/) | メモデータの管理・localStorage への永続化 |
| [Jotai](https://jotai.org/) | 自動削除設定など UI 設定の管理 |

### その他

| ライブラリ | 用途 |
|-----------|------|
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | PWA 対応（マニフェスト・Service Worker） |
| [axios](https://axios-http.com/) | HTTP クライアント |
| [wanakana](https://www.npmjs.com/package/wanakana) | ひらがな・カタカナ・ローマ字変換 |
| [react-virtual-keyboard](https://www.npmjs.com/package/react-virtual-keyboard) | 仮想キーボード UI |

### 開発ツール

| ライブラリ | 用途 |
|-----------|------|
| [Biome](https://biomejs.dev/) | フォーマット・Lint |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | React Fast Refresh 対応 |

## セットアップ

### 必要環境

- Node.js **22.15.1** 以上（`.nvmrc` 参照）

```bash
# nvm を使っている場合
nvm use
```

### インストール & 起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev
```

スマートフォンから同じ Wi-Fi 経由でアクセスする場合、開発サーバーは LAN 上の IP でも接続可能です（`vite.config.js` の `server.host: true` 設定）。

### その他のコマンド

```bash
npm run build    # 本番ビルド
npm run preview  # ビルド結果のプレビュー
npm run lint     # Biome で Lint + フォーマットチェック
npm run lint:fix # Biome で自動修正
npm run format   # フォーマットのみ適用
```

## プロジェクト構成

```
src/
├── atom/           # Jotai の atom 定義
├── components/
│   ├── layout/     # Header, Footer など
│   └── ui/         # ボタン・リストなど再利用 UI
├── constants/      # 初期データ
├── hooks/          # カスタムフック
├── pages/          # 各画面コンポーネント
├── store/          # Zustand ストア
└── units/          # 日付・メモ関連のユーティリティ
```

## 画面一覧

| パス | 画面 | 説明 |
|------|------|------|
| `/` `/deadline` | 締切 | 締切が近いメモを優先度フィルター付きで一覧表示 |
| `/memo` | メモホーム | 優先度の選択・自動削除設定 |
| `/memoList` | メモ一覧 | 選択した優先度のメモ一覧 |
| `/memoData` | メモ詳細 | メモの内容確認・編集 |
| `/addMemo` | メモ追加 | 新規メモの作成 |
