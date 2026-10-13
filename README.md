# Paddock Pulse V1.16.1 — Native Live Integration

V1.16.0 iframe 方案移除。正式站直接向 Paddock-Pulse-Live Render relay 取得 JSON，再用正式 Paddock Pulse 的 UI 原生渲染。

## 架構
F1 Live Timing → Paddock-Pulse-Live / Render relay → `/api/live` → Paddock Pulse 正式站

兩個 repo 仍分開，但使用者只看到正式站的一個 Live 分頁。

## 保留
- Race/Sprint ~3 秒更新
- FP/Q ~5 秒更新
- LAP / Session Clock / Track Status / Weather
- Timing Tower / GAP / INTERVAL
- 輪胎 badge / IN PIT
- DNF / DNS / DSQ / NC
- 個人方格旗
- Q1/Q2/Q3、SQ1/SQ2/SQ3
- Race Control
- Live 不可用時 fallback `/api/archive/latest`

## 上傳
覆蓋：
- `live-integration.js`
- `sw.js`

README 可不必上傳。
