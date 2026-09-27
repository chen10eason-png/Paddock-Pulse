# Paddock Pulse V1.0.1

獨立非官方 F1 資訊 PWA，適合 iPhone/iPad 及 GitHub Pages。

## 功能
- 深色賽事首頁、下一站倒數（依裝置當地時間）
- 2026 賽程，含能從公開 API 取得的練習、排位與衝刺賽場次
- 車手及車隊積分榜
- 車手收藏儲存在瀏覽器 localStorage
- 基礎 Service Worker 離線快取；資料失敗時保留上次成功同步內容
- iOS「分享 → 加入主畫面」可安裝

## 資料來源
Jolpica-F1: https://api.jolpi.ca/ergast/f1/2026/races.json （含積分相關端點）。這是公開、非官方的賽季資料服務，可能延遲，請遵守其服務政策。此版本不包含即時圈速、比賽直播及官方圖像/商標。

## 使用
將本資料夾所有檔案放入 GitHub repository 根目錄，Settings → Pages → Deploy from branch → main / root。開啟 https://USERNAME.github.io/REPO/ 。首頁的 ↻ 可重新抓資料，iPhone Safari 分享 → 加入主畫面。

瀏覽器直接打開本機 file:// 時，遠端請求或 Service Worker 可能受限；請透過 HTTPS 或 localhost 使用。

## 未來開發
整合 OpenF1 公開 API 的歷史圈速/賽況、經查證的即時賽況供應商、新聞、通知以及（若需原生 iOS）WidgetKit 和 ActivityKit。外部來源授權及平台速率限制需個別檢查。

## V1.0.1 修正
- 正確顯示 Jolpica DriverStandings.Driver 的姓名與 ConstructorStandings.Constructor 的車隊名稱。
- 車手收藏使用 Driver.driverId，兼容之前儲存的資料。
- 更新離線快取版本；部署後重新整理以取得新版。
