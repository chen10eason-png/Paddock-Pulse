# Paddock Pulse V1.15.0 — Dashboard & UX Refresh

基準：正式 repo V1.14.2.3。

## 本版
- 首頁新增 Race Weekend Hub
- 同時顯示「最新完成 Session」與「下一個 Session」
- 最新完成 Session 可直接進賽果
- Track / Tyres / Weather 入口集中
- Tyres 只顯示既有 `officialTyreFor()` 已核實資料，未核實就明確顯示「尚未核實」
- Results 頁新增 Latest Completed / Next Up context
- 保留 V1.14.2.3 的 Results Auto Advance
- 不修改 Live Race PoC
- 不新增新的 sports-data API

## 穩定性
- observer 只監看既有 app 會重新 render 的 `homeWeekend` / `resultRaceBanner`
- observer 本身不修改被監看的節點，避免 V1.14.2 的自觸發循環
- 所有 Hub 功能失敗時都不影響原本賽程/賽果頁
- iPhone 小螢幕使用單欄 Session 卡片

## 檔案
覆蓋：
- `sw.js`
- `ui-refresh.js`

新增：
- `v115.css`

保留原本：
- `ui-refresh.css`
- `index.html`
- manifest / icons / assets

## 備註
這版先完成使用者可見的 Dashboard/UX 升級。
因目前 ChatGPT 的 GitHub 連線是 read-only，無法直接把大型 `index.html`
在 repository 內做 source consolidation；後續 source cleanup 再把 UI layer
正式併回 `index.html`，Service Worker 回歸純 cache。
