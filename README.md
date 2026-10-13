# Paddock Pulse V1.16.2 — Live History + 6 Dock + Track Map Fix

## 1. Live 最新狀態 / 歷史結果
正式版 Live 頁現在與獨立 Paddock Pulse Live 一樣，提供：
- 最新狀態
- 歷史結果
- 歷史賽事選單
- Session 選單

歷史資料直接讀：
- `/api/archive/meetings`
- `/api/archive/session?path=...`

切到歷史結果時停止 Live polling；切回最新狀態才恢復。

## 2. 底部導覽 6 格
根因是舊版 `.bottom` 仍固定：
`grid-template-columns: repeat(5, ...)`

所以第六個「我的」被排到第二列，再被 dock 的 `overflow:hidden` 裁掉。

V1.16.2 強制改為 6 欄：
首頁 / 賽程 / 賽果 / Live / 排名 / 我的

glass lens 也同步改為 1/6 寬度。

## 3. 賽道圖
舊版優先讀 `circuits/detailed/white-outline/`。
來源 repo 說明指出 detailed 圖目前主要針對 2026 layout；為提高 Safari/iPhone 成功率，V1.16.2 改成：

1. 已存在的本機 asset（Las Vegas / Lusail）
2. `minimal/white-outline` CDN
3. `minimal/white-outline` raw GitHub
4. `detailed/white-outline` CDN
5. `detailed/white-outline` raw GitHub

並補上常見 circuitId alias：
- `monte_carlo` → `monaco`
- `losail` → `lusail`
- `vegas` → `las_vegas`

沒有核實 layout 的賽道仍不亂猜。

## 上傳
覆蓋：
- `live-integration.js`
- `sw.js`

README 可不必上傳。
