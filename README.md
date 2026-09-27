# Paddock Pulse V1.9.0

非官方 F1 iPhone / iPad PWA。

這一版延續你前面要求的賽道方向，進一步把賽道模組做完整：

## 這版更新
- 逐站加入 **官方賽道圖 source / alias 檢查狀態**。
- 重做 **賽道詳情頁**，讓畫面更高級、更接近 BoxBox 那種資訊卡風格。
- 新增 **特色彎角**。
- 新增 **超車點 / DRS 區**。
- 新增 **Sector 節奏整理**。
- 首頁本週賽道卡片也會顯示 map check 狀態。
- 保留官方賽道圖來源策略：若未來某站抓不到正確 slug，會明確顯示檢查資訊，方便修正。

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
- map source / alias 檢查。

## 資料來源
- Jolpica-F1：https://api.jolpi.ca/docs/
- OpenF1：https://openf1.org/docs/
- Formula1.com 官方分站頁 Circuit 區塊賽道圖：https://www.formula1.com/

## 使用方式
將 `paddock-pulse-v1.9.0` 資料夾內所有檔案上傳到 GitHub Pages repository 根目錄即可部署。

建議使用：
- GitHub Pages
- HTTPS 網址
- iPhone Safari / iPad Safari 加入主畫面

## 測試說明
已完成程式語法檢查與本機結構檢查。部署後建議重新整理 Safari / PWA 快取，並逐站檢查 circuit detail 頁的 map source 狀態。
