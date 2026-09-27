# Paddock Pulse v1.3.0

非官方 F1 iPhone/iPad PWA；保留 v1.2.0 賽程、積分榜、收藏資料鍵與 Jolpica 2026 API。

## 本版
- 首頁「你的 Paddock」展示已收藏車手與車隊
- 收藏展廳：可橫向滑動的大型車手／車隊卡片、原創頭盔與賽車 SVG 插畫、隊色視覺主題；未使用授權肖像或隊徽
- 車手／車隊完整詳情頁：排名、積分、勝場、陣容或車手資料；車手近期 5 站賽果（連線可用時）
- 排名與收藏卡片可進入詳情頁，詳情頁亦可收藏／取消收藏
- 舊版 localStorage 收藏沿用，Service Worker 快取版本獨立

## 部署
將 ZIP 內資料夾所有檔案置於 GitHub Pages repo 根目錄，或使用 localhost/HTTPS。首次進入需網路同步；公開 API 可能延遲。

沒有真正即時賽況、原生 iOS Widget、Live Activities 或背景通知。
