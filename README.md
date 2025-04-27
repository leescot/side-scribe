# 錄音轉文字並摘要Chrome擴充功能PRC (產品需求文件)

## 1. 專案概述

開發一個Chrome擴充功能，能夠在網頁上提供側邊抽屜式錄音面板，錄製完成後將音頻發送到Groq API使用Whisper v3模型進行轉錄為中文（繁體），然後將文字傳送給Llama 3.3 70b模型進行摘要整理。系統將每30秒（可自定義間隔時間）進行一次轉錄更新並刷新摘要內容，提供即時反饋。

## 2. 市場分析

目前市場上有一些類似功能的擴充功能，但大多專注於單一功能，如純錄音或純轉錄：

1. WriteHear錄音筆：簡單的中文語音辨識工具，但功能較為基礎，缺乏進階摘要功能。

2. Groq Toolbox：支援多種AI功能，包括文字處理、圖像分析和語音轉文字，但需要用戶自行整合各功能。

3. Google Chrome即時字幕功能：只提供英文內容的轉錄，且缺乏摘要功能。

我們的擴充功能將整合錄音、實時轉錄和動態摘要更新為一體化流程，針對中文使用者提供完整解決方案。

## 3. 技術架構

### 3.1 前端技術
- React + Vite：提供高效的開發環境和快速的熱更新
- Material UI (MUI)：構建美觀且響應式的用戶界面
- Chrome Extension API：實現瀏覽器擴充功能所需的各種功能

### 3.2 後端技術
- Web Audio API：用於錄音功能
- MediaRecorder API：控制錄音格式和品質
- Groq API整合：
  - Whisper-large-v3：用於音頻轉文字
  - Llama3-70b-8192：用於生成摘要

## 4. 用戶界面設計

### 4.1 Popup頁面
Popup頁面作為擴充功能的配置中心，包含以下元素：

1. **API設置區域**：
   - Groq API密鑰輸入欄位（帶有加密存儲）
   - 連接狀態指示器
   - 測試連接按鈕

2. **轉錄設置區域**：
   - 回傳間隔時間滑動條（範圍：20-60秒）
   - 音頻格式選擇（mp3、ogg、webm等）
   - 音頻品質設置

3. **摘要設置區域**：
   - 摘要提示詞（prompt）文本輸入框
   - 預設提示詞模板選擇
   - 摘要語言選項
   - 摘要長度設置

4. **外觀設置區域**：
   - 側邊面板寬度調整
   - 深色/淺色主題選擇
   - 面板位置選擇（左側/右側）

### 4.2 側邊抽屜式面板
側邊抽屜式面板作為主要操作和顯示界面，包含以下元素：

1. **控制區域**：
   - 開始/暫停/停止錄音按鈕
   - 錄音狀態指示器和時間計時器
   - 摘要更新狀態指示

2. **轉錄區域**：
   - 實時顯示轉錄文字的滾動面板
   - 自動滾動至最新內容
   - 轉錄文字的複製按鈕
   - 原始轉錄文字的下載選項

3. **摘要區域**：
   - 動態更新的摘要文字面板
   - 摘要更新時間戳
   - 摘要文字的複製按鈕
   - 摘要的下載選項

4. **側邊標籤**：
   - 在不使用時收起的標籤
   - 點擊展開整個側邊面板
   - 指示當前錄音狀態的顏色變化

## 5. 功能規格

### 5.1 錄音功能
- 支援多種音頻格式（mp3、ogg、webm等）
- 自定義音頻品質和採樣率
- 錄音格式優化以符合Whisper API要求
- 自動控制音頻大小，避免超出25MB限制
- 可自定義的錄音回傳間隔（20-60秒）

### 5.2 轉錄功能
- 使用Groq的Whisper-large-v3模型
- 支援中文（繁體）轉錄
- 增量式轉錄更新，保留歷史內容
- 顯示轉錄信心度和品質指標
- 處理錄音噪音和背景聲音

### 5.3 摘要功能
- 使用Groq的Llama3-70b模型
- 根據增量轉錄內容動態更新摘要
- 自定義摘要提示詞和風格
- 支援多種摘要類型（關鍵點、會議紀要、行動項目等）
- 摘要內容突出顯示重要信息

### 5.4 數據管理
- 本地加密存儲API密鑰
- 暫存錄音和轉錄數據
- 提供歷史記錄管理
- 支援數據導出（文字、JSON、PDF等）

## 6. 技術實現細節

### 6.1 錄音模塊
```javascript
// 使用MediaRecorder API實現分段錄音
const startRecording = async (intervalSec) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  // 設定音頻格式和品質
  const options = {
    mimeType: selectedAudioFormat, // 從用戶設置獲取
    audioBitsPerSecond: selectedAudioQuality // 從用戶設置獲取
  };
  
  mediaRecorder = new MediaRecorder(stream, options);
  
  let chunks = [];
  let timer = 0;
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
      timer += 1;
      
      // 根據設定的間隔時間處理音頻段
      if (timer >= intervalSec) {
        const audioBlob = new Blob(chunks, { type: selectedAudioFormat });
        processAudioChunk(audioBlob);
        timer = 0;
        chunks = [];
      }
    }
  };
  
  // 每秒獲取一次數據
  mediaRecorder.start(1000);
};
```

### 6.2 API整合模塊
```javascript
// 處理音頻塊並發送到Groq API
const processAudioChunk = async (audioBlob) => {
  try {
    // 發送到Groq API進行轉錄
    const transcription = await transcribeAudio(audioBlob);
    
    // 更新全局轉錄文本
    updateTranscription(transcription);
    
    // 以累積的轉錄文本更新摘要
    updateSummary(fullTranscription);
  } catch (error) {
    handleAPIError(error);
  }
};

// 轉錄功能
const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'zh');
  
  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });
  
  return await response.json();
};

// 摘要功能
const updateSummary = async (transcription) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: userSummaryPrompt || defaultSummaryPrompt
        },
        {
          role: 'user',
          content: transcription
        }
      ]
    })
  });
  
  return await response.json();
};
```

### 6.3 UI交互模塊
```javascript
// 側邊抽屜組件
const SidePanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transcription');
  
  // 展開/收起面板
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  return (
    <div className={`side-panel ${isPanelOpen ? 'open' : 'closed'}`}>
      {/* 側邊標籤 */}
      <div className="panel-tab" onClick={togglePanel}>
        <RecordingStatusIndicator />
      </div>
      
      {/* 面板內容 */}
      {isPanelOpen && (
        <div className="panel-content">
          <div className="control-section">
            <RecordingControls />
            <RecordingTimer />
          </div>
          
          <div className="tabs">
            <button 
              className={activeTab === 'transcription' ? 'active' : ''} 
              onClick={() => setActiveTab('transcription')}
            >
              轉錄
            </button>
            <button 
              className={activeTab === 'summary' ? 'active' : ''} 
              onClick={() => setActiveTab('summary')}
            >
              摘要
            </button>
          </div>
          
          {activeTab === 'transcription' && <TranscriptionPanel />}
          {activeTab === 'summary' && <SummaryPanel />}
        </div>
      )}
    </div>
  );
};
```

## 7. 技術注意事項

### 7.1 權限管理
- 需要請求麥克風權限
- 需要網絡訪問權限用於API通信
- 需要存儲權限用於保存配置和歷史記錄

### 7.2 安全性考量
- API密鑰使用Chrome Storage API加密存儲
- 所有網絡請求使用HTTPS
- 不將用戶數據發送到第三方服務器

### 7.3 性能優化
- 使用Web Workers處理音頻轉換
- 實現增量更新而非完全重新加載
- 通過批處理減少API調用次數
- 使用緩存減少重複處理

### 7.4 錯誤處理
- 實現API請求重試機制
- 網絡錯誤的優雅降級策略
- 本地錄音備份機制
- 用戶友好的錯誤提示

## 8. 開發路線圖

### 8.1 第一階段（原型開發）
- 設計基本UI元素和交互流程
- 實現基本錄音功能
- 建立Groq API連接測試

### 8.2 第二階段（功能開發）
- 完成側邊抽屜式面板實現
- 實現分段錄音和轉錄功能
- 建立動態摘要更新機制

### 8.3 第三階段（優化與測試）
- 優化用戶界面和響應式設計
- 實現配置保存和歷史記錄
- 進行跨瀏覽器兼容性測試

### 8.4 第四階段（發布與維護）
- 準備Chrome Web Store發布材料
- 完成產品文檔和用戶指南
- 建立用戶反饋和更新機制

## 9. 結論

這個Chrome擴充功能將提供高效的錄音、轉錄和摘要解決方案，特別針對中文使用者優化。通過側邊抽屜式面板設計，它能在不干擾用戶瀏覽體驗的同時提供豐富的功能。結合React、Vite和MUI的技術架構以及Groq API的強大能力，這個擴充功能將能夠滿足會議記錄、學習筆記和內容創作等多種使用場景的需求。