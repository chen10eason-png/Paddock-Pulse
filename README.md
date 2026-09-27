# Paddock Pulse V1.10.0

非官方 F1 iPhone / iPad PWA。

這一版重點是繼續補強你剛剛提到的問題：

## 這版更新
- 針對賽道圖新增 **多候選官方圖網址 fallback 機制**。
  - 同一站不只嘗試一個網址。
  - 若第一個官方圖失敗，會自動往下嘗試其他候選網址。
  - 減少「有些賽道沒有圖 / 跑不出來」的情況。
- 保留並強化 **map source / alias 檢查**。
- 新增 **輪胎策略**。
- 新增 **車輛設定重點**。
- 新增 **天氣 / 賽道摘要**。
- 保留賽道頁的：
  - 特色彎角
  - 超車點 / DRS 區
  - Sector 節奏

## 目前功能
- 深色風格 F1 首頁與下一站倒數。
- 2026 賽程總覽。
- 車手 / 車隊積分榜。
- 車手 / 車隊收藏（localStorage）。
- 分站賽果頁：可查看各場練習、衝刺、排位與正賽結果。
- Race Weekend timeline：用時間軸切換各場次。
- 車手 / 車隊詳情頁與近期賽果。
- 官方來源賽道圖、賽道資訊、放大頁。
- 賽道 guide：特色彎角、超車點、DRS 區、sector 節奏。
- 額外賽道卡：輪胎策略 / 設定重點 / 天氣摘要。
- map source / alias 檢查。

## 資料來源
- Jolpica-F1：https://api.jolpi.ca/docs/
- OpenF1：https://openf1.org/docs/
- Formula1.com 官方分站頁 Circuit 區塊賽道圖：https://www.formula1.com/

## 使用方式
將 `paddock-pulse-v1.10.0` 資料夾內所有檔案上傳到 GitHub Pages repository 根目錄即可部署。

## 測試說明
已完成程式語法檢查與本機結構檢查。部署後建議重新整理 Safari / PWA 快取，並逐站查看是否有更多賽道成功載入官方圖。
