# Paddock Pulse V1.12.0

本版從 GitHub 公開版本 V1.10.0（index.html blob 4c5839a37a05b29f18d41c1167dc8615c09da955）接續修改。

## 賽道資料與授權
採用 **julesr0y/f1-circuits-svg** 公開提供的 detailed / white-outline SVG；2026 適用版號按該專案 circuits.json 的 `seasons` 選用，**不再猜測 Formula1.com 的圖片網址**。23 條列為 2026 有效版號的賽道加上 Sepang、Bahrain、Jeddah 等特殊場地做精確別名；未匹配版號不顯示臆測圖。SVG 為外部 CDN 引用，使用相同檔案的 GitHub 原始來源作備援，需首次連網。

© 2024–2026 ROY Jules，原始專案與 SVG 以 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 授權，來源：https://github.com/julesr0y/f1-circuits-svg。App 只用該 SVG 外部網址呈現，沒有宣稱為 F1 官方圖。

## 輪胎
2026 配胎僅提供已經核實的 Pirelli 公告或 Formula1.com 轉載，標示每站 C1–C5 的硬中軟對應與原始來源。不憑賽道類型預測一停兩停；未核實站標示未知。

## 天氣
Open-Meteo 免費預報 API https://open-meteo.com/en/docs，按賽道座標及實際場次時間取得當地時區逐小時氣溫、降雨機率、預估雨量、風速。預報範圍僅限 16 天內且尚未結束的週末；非當年歷史觀測或賽道測站，無資料時顯示等待／錯誤，不使用氣候統計冒充預報。

## 部署
ZIP 解壓後，將資料夾**內部** 7 個檔案上傳至 GitHub Pages repo 根目錄：index.html、manifest.webmanifest、sw.js、icon-192.png、icon-512.png、TRACK_AUDIT.json、README.md。GitHub Pages deployment 不會因為 ZIP 下載而自動更新（目前 GitHub connector 對此 repo 僅有讀取權限）。

## 版本核對
index.html `APP_VERSION`、收藏頁文字、ZIP 檔名、Service Worker cache、README 全部設定為 V1.12.0。

## 核實的重要賽事更新與規則
- 2026 第 16 站「巴林大獎賽」於 10 月 2–4 日在馬來西亞 Sepang 舉辦，即使原始賽程快取尚未更新也會正確映射；來源：https://www.formula1.com/en/latest/article/formula-1-and-fia-confirm-formula-1-and-fia-confirm-malaysia-will-join-2026-calendar-as-host-venue-for-the-bahrain-grand-prix.6lL7vjFEM2VVynRHvg1TCf
- 2026 已無傳統 DRS，取而代之的是 Active Aero 與 Overtake Mode，未核實 FIA 當站圖的啟用區域不會畫成已確認資料；來源：https://www.fia.com/news/f1s-new-era-everything-you-need-know-about-how-fia-making-formula-1-more-competitive-more

## 驗證範圍
已核對賽道資料庫內 25 個 SVG 名稱與版號；iPhone / iPad 尺寸以模擬網路回應測試場次切換、圖片成功載入、已公告配胎及 Open-Meteo 逐小時時區轉換。實際 CDN 與天氣 API 的部署端到端連線仍須在可對外連線的真實網站確認，不能將模擬測試視作已驗證實際預報。

## V1.12.0
- **Las Vegas map offline-stable**: `assets/las-vegas-1.svg` bundles the exact documented 2023–2026 layout from Jules Roy/f1-circuits-svg, modified stroke colors; full attribution under CC BY 4.0; remote identical SVG remains fallback.
- **Floating glass bottom dock**: rounded translucent floating pill, strong Safari backdrop blur/saturation, bright specular strokes, animated selected lens, crisp five SVG icons, safe-area-aware iPhone/iPad responsive spacing, reduced-motion support. This is a CSS recreation; Apple's proprietary native Liquid Glass renderer is not exposed to website PWAs.
- Same existing localStorage favorites and weather/tyre policy; version and PWA cache updated.
