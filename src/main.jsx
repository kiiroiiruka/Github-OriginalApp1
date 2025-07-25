import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // 正しいインポート
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter をインポート
import App from './App.jsx';
import "./index.css"

// サブディレクトリでの動作を考慮して、basename を設定
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* basenameを追加 */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
