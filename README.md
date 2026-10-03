# Paddock Pulse V1.14.2.1 — UI Refresh Hotfix

修正 V1.14.2 會讓 Safari / PWA 卡住的問題。

## 問題原因
V1.14.2 的 `ui-refresh.js` 用 `MutationObserver` 監聽 `.view` 的 `class`，
動畫函式又修改同一個 `.view` 的 `class`，observer 因而反覆觸發自己，
形成無限循環，造成網站卡死或看起來壞掉。

## 修正
- 移除自我觸發的 MutationObserver
- 保留 UI Refresh 其他功能
- 頁面動畫只在初始載入執行一次
- Service Worker cache 升級
- UI 資源 query 升級為 1.14.2.1

## 上傳
只要覆蓋：
- sw.js
- ui-refresh.js

ui-refresh.css 不用改。
