# Paddock Pulse V1.13.0 — 穩定修復

本版以 `chen10eason-png/Paddock-Pulse` 公開 repository 的 V1.12.0 為基礎，保留首頁、賽程、賽果、積分榜、收藏、賽道詳情與原有 localStorage 收藏資料。原生 Apple Liquid Glass 待未來 SwiftUI 版本；本版保留現有 PWA 玻璃導覽。

## 修復項目

- **賽道圖**：按實際賽道 ID 對應核對版號的 SVG。Las Vegas 的 2023–2026 賽道圖同時放在根目錄 `las-vegas-1.svg` 和 `assets/las-vegas-1.svg`，兼容 GitHub 網頁上傳；其他賽道的圖需要網路，僅使用相同 SVG 的 CDN 與 GitHub 原始檔備援，不拿其他圖替代。
- **圖片效能**：摺疊賽程卡片不會全部同時下載圖片，展開時才載入。單一來源超過 9.5 秒無回應會切換同圖備援。資料庫有路徑不代表使用者網路一定能連上。
- **實際輪胎策略**：2026 官方已公布配胎依 Pirelli / Formula1.com 列出。Sepang 的一停／兩停可能性僅引用 Pirelli 賽前分析，不當成確定方案。已結束的比賽會向 Jolpica 按需讀取各車手**實際進站圈次**；該資料沒有輪胎配方，絕不填造各段胎種。
- **天氣**：透過 Open-Meteo 依實際賽道座標及當地時區取得逐小時預報。明確標示採用的整點、降雨機率、預估雨量、風速及取得時間；25 分鐘內使用已取得的預報，過期重抓。超過有效預報範圍或 API 失敗不顯示虛構數據。預報不是賽道測站實測。
- **2026 規則**：不把往年的 DRS 區域當作 2026 年資訊；以 FIA 的主動空力與 Overtake Mode 規則為準。歷史超車點清楚標為歷史參考。
- **PWA**：Service Worker 快取版本、首頁版本與 README 更新為 V1.13.0。

## 資料來源與授權

- 賽道圖：© 2024–2026 ROY Jules，[f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。現行 SVG 版號依作者 `circuits.json` 選擇。這不是 Formula1.com 官方原圖。
- 賽程、結果、進站：[Jolpica-F1](https://api.jolpi.ca/ergast/f1/2026)。
- 練習賽等來源備援：[OpenF1](https://openf1.org/docs/)。
- 官方配胎：[Pirelli 2026 首三站](https://press.pirelli.com/complete-f1-tyre-range-for-the-first-three-grands-prix-of-2026/)、[Pirelli 2026 Baku／Sepang／Singapore](https://press.pirelli.com/tyre-compound-selections-for-baku-sepang-and-singapore/)。
- 天氣：[Open-Meteo](https://open-meteo.com/en/docs)。
- 2026 年 10 月 2–4 日的巴林冠名大獎賽場地是馬來西亞 Sepang，[F1 官方公告](https://www.formula1.com/en/latest/article/formula-1-and-fia-confirm-formula-1-and-fia-confirm-malaysia-will-join-2026-calendar-as-host-venue-for-the-bahrain-grand-prix.6lL7vjFEM2VVynRHvg1TCf)。

## 部署

ZIP **已經將檔案放在壓縮檔根目錄**，不是再包一層版本資料夾。解壓縮後，將 `index.html`、`manifest.webmanifest`、`sw.js`、圖示、`TRACK_AUDIT.json`、`las-vegas-1.svg` 和整個 `assets/` 資料夾上傳到 `chen10eason-png/Paddock-Pulse` repository 根目錄。這個交付**尚未推送或部署**，必須先上傳網站才會更新。

## 測試限制

已對 JavaScript 與 Service Worker 做語法檢查；透過無外網的 Chromium 與**模擬 API 回傳**測試首頁、賽程展開、Las Vegas 圖片載入處理、Sepang 已公告配胎與逐小時天氣顯示，未見 JS runtime error。圖片與 Open-Meteo 在真實部署環境的網路成功率，需要部署後在 Safari 實測，不能將模擬資料誤當實際天氣。
