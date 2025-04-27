# Side Scribe - 錄音轉文字與摘要 Chrome 擴充功能

Side Scribe 是一個 Chrome 擴充功能，可以在瀏覽網頁時即時錄音、轉錄成文字並生成摘要，方便使用者保存和整理會議、課程或其他重要語音內容。

## 功能特點

- 側邊抽屜式面板設計，不干擾網頁瀏覽
- 即時錄音和語音轉文字
- 自動生成摘要
- 支持中文（繁體）
- 可自定義設置和提示詞
- 完全本地保存數據，確保隱私

## 技術架構

- **前端框架**: React + TypeScript + Vite
- **UI 庫**: Material UI (MUI)
- **API 集成**: Groq API (Whisper 語音辨識 + Llama 摘要生成)
- **擴充功能**: Chrome Extension Manifest V3

## 開發環境設置

### 需求

- Node.js 18+
- npm 8+
- Chrome 瀏覽器

### 安裝步驟

1. Clone 專案:
   ```bash
   git clone https://github.com/yourusername/side-scribe.git
   cd side-scribe
   ```

2. 安裝依賴:
   ```bash
   npm install
   ```

3. 開發模式:
   ```bash
   npm run dev
   ```

4. 構建擴充功能:
   ```bash
   npm run build
   ```

5. 在 Chrome 中載入擴充功能:
   - 打開 Chrome 瀏覽器，進入 `chrome://extensions/`
   - 啟用「開發人員模式」
   - 點擊「載入未封裝項目」
   - 選取專案的 `dist` 資料夾

## 使用方式

1. 點擊擴充功能圖示，設置 Groq API 金鑰
2. 瀏覽任意網站，點擊側邊標籤展開面板
3. 點擊「開始錄音」按鈕開始錄音
4. 實時查看轉錄文字和自動生成的摘要
5. 可隨時暫停或停止錄音，並下載轉錄內容

## 專案結構

```
side-scribe/
├── public/               # 靜態資源
│   ├── icons/            # 擴充功能圖示
│   ├── manifest.json     # 擴充功能配置
│   ├── popup.html        # 彈出窗口 HTML
│   └── panel.html        # 側邊面板 HTML
├── src/
│   ├── api/              # API 通信模塊
│   ├── background/       # 背景腳本
│   ├── components/       # React 元件
│   ├── content/          # 內容腳本
│   ├── hooks/            # React 自定義 hooks
│   ├── panel/            # 側邊面板
│   ├── popup/            # 彈出設置窗口
│   ├── types/            # TypeScript 類型定義
│   └── utils/            # 工具函數
├── package.json          # 專案配置
└── vite.config.ts        # Vite 配置
```

## 授權

MIT

## 作者

[Your Name]