import { StrictMode } from 'react';//F12 のコンソールで「危ない書き方じゃないか」といった警告を確認できるようにするために使用
import { createRoot } from 'react-dom/client';//React の JSX を、ブラウザの画面に表示できるようにさせるために使用
import { BrowserRouter } from 'react-router-dom';//ページ遷移を管理するためのラッパー
import { AuthProvider } from '@/context/auth/AuthProvider';//Context APIを使用してログイン状態をアプリ全体で共有できるようにするためのラッパー
import App from './App.jsx';//アプリの表示内容が全て詰め込まれたコンポーネント
import "./index.css"//アプリ全体にデフォルトで適応されるCSSのデザインのセット

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
