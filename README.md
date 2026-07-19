# ミニメモ

優先度と締切を設定できる、シンプルなメモ管理アプリです。  
Firebase 認証・Firestore でユーザーごとにデータを同期し、PWA 対応のためスマートフォンにインストールしてオフラインでも利用できます。

## 主な機能

- **優先度別メモ管理** — 高・中・低の3段階でメモを分類
- **締切タイマー** — 残り時間をリアルタイム表示（締切間近は警告表示）
- **メモの追加・編集・削除**
- **期限切れメモの自動削除** — 設定で ON/OFF 切り替え可能（Firestore に保存）
- **ユーザー認証** — メールアドレス / パスワードでのログイン・新規登録、メール認証必須
- **クラウド同期** — メモ・設定を Firestore に保存（ログインユーザーごとに分離）
- **オフライン対応** — Firestore のローカルキャッシュ（IndexedDB）でオフライン時も閲覧・操作可能
- **PWA** — ホーム画面への追加・スタンドアロン表示に対応

## 技術スタック

### コア

| ライブラリ | 用途 |
|-----------|------|
| [React](https://react.dev/) 19 | UI フレームワーク |
| [Vite](https://vite.dev/) 7 | ビルドツール・開発サーバー |
| [React Router](https://reactrouter.com/) 7 | ページルーティング |

### バックエンド（Firebase）

| サービス | 用途 |
|---------|------|
| [Firebase Authentication](https://firebase.google.com/docs/auth) | メール / パスワード認証、メール確認 |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | メモ・ユーザー設定の保存・リアルタイム同期 |
| [Firebase Storage](https://firebase.google.com/docs/storage) | 将来のファイル保存用（ルール定義済み） |
| [Firebase Analytics](https://firebase.google.com/docs/analytics) | 画面遷移のトラッキング |

### 状態管理

| ライブラリ | 用途 |
|-----------|------|
| [Zustand](https://zustand.docs.pmnd.rs/) | メモデータの UI キャッシュ（Firestore と `onSnapshot` で同期） |
| [Jotai](https://jotai.org/) | 自動削除設定など UI 状態（Firestore の設定を反映） |

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
- Firebase プロジェクト（Authentication・Firestore を有効化）

```bash
# nvm を使っている場合
nvm use
```

### 環境変数

`.env.example` をコピーして `.env` を作成し、Firebase コンソールのプロジェクト設定から値を入力します。

```bash
cp .env.example .env   # Windows の場合は手動でコピー
```

| 変数名 | 説明 |
|--------|------|
| `VITE_FIREBASE_API_KEY` | Web API キー |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth ドメイン |
| `VITE_FIREBASE_PROJECT_ID` | プロジェクト ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage バケット |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

本番デプロイ（Netlify など）では、同じ変数をホスティング側の環境変数に設定してください。

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
npm run build         # 本番ビルド
npm run preview       # ビルド結果のプレビュー
npm run lint          # Biome で Lint + フォーマットチェック
npm run lint:fix      # Biome で自動修正
npm run format        # フォーマットのみ適用
npm run format:check  # フォーマットチェックのみ
```

## Firebase のデプロイ

Firestore ルール・インデックス・Storage ルールは `firebase/` フォルダで管理しています。  
プロジェクト ID は `firebase/.firebaserc` で指定されています。

```bash
cd firebase

# Firestore ルール・インデックス、Storage ルールをデプロイ
firebase deploy --only firestore,storage
```

### Firestore データ構造

```
users/{userId}/
├── memos/{memoId}     # メモ（title, content, deadline, priority）
└── settings/app       # ユーザー設定（autoDelete: boolean）
```

セキュリティルールにより、認証済みユーザーは自分の `userId` 配下のデータのみ読み書きできます。

## プロジェクト構成

```
.
├── firebase/
│   ├── client/          # Auth / Firestore / Analytics のクライアント API
│   ├── config.js        # Firebase 初期化（オフラインキャッシュ含む）
│   ├── firestore.rules  # Firestore セキュリティルール
│   ├── storage.rules    # Storage セキュリティルール
│   └── firebase.json    # Firebase CLI 設定
├── src/
│   ├── atom/            # Jotai の atom 定義
│   ├── components/
│   │   ├── layout/      # Header, Footer, 認証レイアウト
│   │   └── ui/          # ボタン・リストなど再利用 UI
│   ├── constants/       # フッタータブ定義など
│   ├── context/auth/    # 認証コンテキスト（AuthProvider）
│   ├── hooks/           # Firestore 同期・フィルターなどのカスタムフック
│   ├── pages/           # 各画面コンポーネント
│   ├── store/           # Zustand ストア（メモの UI キャッシュ）
│   └── units/           # 日付・メモ関連のユーティリティ
├── biome.json           # Biome 設定
└── jsconfig.json        # パスエイリアス（@/ → src/）
```

`@/` エイリアスは `jsconfig.json`（エディタ補完）と `vite.config.js`（ビルド）の両方で設定されています。

## 画面一覧

| パス | 画面 | 説明 |
|------|------|------|
| `/` | 締切 | 締切が近いメモを優先度フィルター付きで一覧表示 |
| `/deadline` | — | `/` へリダイレクト |
| `/memo` | メモホーム | 優先度の選択・自動削除設定 |
| `/memoList` | メモ一覧 | 選択した優先度のメモ一覧 |
| `/memoData` | メモ詳細 | メモの内容確認・編集 |
| `/addMemo` | メモ追加 | 新規メモの作成 |

未ログイン時はログイン / 新規登録画面、メール未認証時は確認メール案内画面が表示されます。

## 認証フロー

1. ログインまたは新規登録（新規登録時は確認メールを送信）
2. メール認証完了後、アプリ本体（締切画面 `/`）へ遷移
3. ログイン中は Firestore からメモ・設定をリアルタイム同期
