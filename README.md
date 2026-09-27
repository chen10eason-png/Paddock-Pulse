# Paddock Pulse V1.7.0

非官方 F1 iPhone / iPad PWA。

這一版聚焦在 **賽道功能強化**，除了保留首頁、收藏展廳、車手 / 車隊詳情、積分榜、賽果頁與 Race Weekend timeline，也新增更完整的賽道體驗。

## 這版更新
- 修正各分站對應的 **賽道地圖**，讓每一站有更合理的專屬輪廓。
- 新增 **賽道詳細資訊**：方向、彎數、圈長、正賽圈數、賽道型態、首辦年份。
- 新增 **賽道放大詳情頁**。
- 首頁新增 **本週賽道卡片**。
- 賽果頁與賽程頁都能進一步查看賽道圖與詳情。
- 更新 Service Worker 快取版本，避免部署後仍載入舊版。

## 目前功能
- 深色風格 F1 首頁與下一站倒數。
- 2026 賽程總覽。
- 車手 / 車隊積分榜。
- 車手 / 車隊收藏（localStorage）。
- 分站賽果頁：可查看各場練習、衝刺、排位與正賽結果。
- Race Weekend timeline：用時間軸切換各場次。
- 車手 / 車隊詳情頁與近期賽果。
- 原創風格化賽道地圖、賽道資訊與放大頁。

## 資料來源
- Jolpica-F1：https://api.jolpi.ca/docs/
- OpenF1：https://openf1.org/docs/

說明：
- 正賽、衝刺賽、排位賽結果優先使用 Jolpica-F1。
- 練習賽與衝刺排位等場次，若公開資料可取得，則用 OpenF1 補足。
- 本版賽道圖為 **App 內建原創風格化示意**，目的是提升辨識度與閱讀性，不是官方授權賽道圖。
- 本版不是即時轉播，不包含原生 iOS Widget 或 Live Activities。

## 使用方式
將 `paddock-pulse-v1.7.0` 資料夾內所有檔案上傳到 GitHub Pages repository 根目錄即可部署。

建議使用：
- GitHub Pages
- HTTPS 網址
- iPhone Safari / iPad Safari 加入主畫面

直接用 `file://` 開啟時，遠端 API 或 Service Worker 可能受限制。

## 測試說明
已完成程式語法檢查與本機結構檢查。真實 API 連線與 iPhone / iPad 實機測試，仍建議部署後再確認。
