# Paddock Pulse V1.14.2 — UI Refresh Patch

以正式 GitHub `main` 的 V1.14.1 為基準，這一版只動 UI / UX，不改賽程、賽果、收藏、天氣、配胎、賽道圖與資料 API 邏輯。

## 第一階段
- 首頁 Hero 視覺層級重整
- 加入三個快速入口：賽程 / 賽果 / 我的
- Header 加 Online / Offline cache 狀態
- 卡片、Chip、Session timeline、Result list、Standings 視覺統一
- Bottom Dock 精修（仍是 Web CSS，不宣稱原生 Liquid Glass）
- 頁面切換加入非常輕微的進場動畫；Reduce Motion 會自動停用
- 關於版本顯示 V1.14.2

## 為什麼是 patch
目前 GitHub 連接權限為 read-only，無法直接替你 commit。為了不重寫 13 萬字元的單檔 `index.html`，這版採「Service Worker 注入 UI overlay」：
- `ui-refresh.css`
- `ui-refresh.js`
- 更新版 `sw.js`

原本 `index.html` 完全保留，因此 V1.14.1 的資料與功能程式不會被改動。

## 上傳
把這 4 個檔案加入/覆蓋到 repo 根目錄：
- `sw.js`
- `ui-refresh.css`
- `ui-refresh.js`
- `README.md`

**不要刪除既有 index.html、manifest、icons、assets。**

GitHub Pages 部署後，關閉 PWA 再重新開啟一次；若仍看到舊畫面，再重新整理一次，讓新 Service Worker 接管。
