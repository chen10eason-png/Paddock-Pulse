# Paddock Pulse V1.6.0

非官方 F1 iPhone / iPad PWA。

這一版延續既有的首頁、收藏展廳、車手 / 車隊詳情、積分榜、賽果頁與賽事週末時間軸，並加入 **賽道地圖** 功能。

## 這版更新
- 新增 **賽道地圖**：賽果頁會顯示目前分站的原創風格化 track map。
- 賽程頁展開各分站時，也能先預覽對應的賽道地圖。
- 保留賽事週末時間軸，可查看 FP1 / FP2 / FP3 / 衝刺排位 / 衝刺賽 / 排位賽 / 正賽。
- 保留收藏展廳、車手 / 車隊詳情頁、首頁本週賽事與個人收藏賽果摘要。
- 更新快取版本，避免部署後仍載入舊版畫面。

## 目前功能
- 深色風格 F1 首頁與下一站倒數。
- 2026 賽程總覽。
- 車手 / 車隊積分榜。
- 車手 / 車隊收藏（localStorage）。
- 分站賽果頁：可查看各場練習、衝刺、排位與正賽結果。
- Race Weekend timeline：用時間軸切換各場次。
- 車手 / 車隊詳情頁與近期賽果。
- 原創風格化賽道地圖展示。

## 資料來源
- Jolpica-F1：https://api.jolpi.ca/docs/
- OpenF1：https://openf1.org/docs/

說明：
- 正賽、衝刺賽、排位賽結果優先使用 Jolpica-F1。
- 練習賽與衝刺排位等場次，若公開資料可取得，則用 OpenF1 補足。
- 本版賽道圖為 **App 內建原創風格化示意**，方便辨識各分站輪廓，**不是官方授權賽道圖**。
- 本版不是即時轉播，不包含原生 iOS Widget 或 Live Activities。

## 使用方式
將 `paddock-pulse-v1.6.0` 資料夾內所有檔案上傳到 GitHub Pages repository 根目錄即可部署。

建議使用：
- GitHub Pages
- HTTPS 網址
- iPhone Safari / iPad Safari 加入主畫面

直接用 `file://` 開啟時，遠端 API 或 Service Worker 可能受限制。

## 測試說明
已完成程式語法檢查與本機結構檢查。真實 API 連線與 iPhone / iPad 實機測試，仍建議部署後再確認。
