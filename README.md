# Paddock Pulse V1.14.2.3 — Results Auto Advance Hotfix

## Root cause
V1.14.2.2 的 Results Auto Advance 邏輯本身已在 `ui-refresh.js`，
但 Service Worker 用來注入外部 JS 的 closing tag 寫成了 escaped 形式，
導致瀏覽器不一定會正確執行 `ui-refresh.js`。

因此你實機上仍然使用 index.html 原本的：
`resultRoundDefault()`
它只看「正賽日期是否已過」，所以目前週末尚未跑正賽時仍停在上一站。

## 修正
- Service Worker 改成直接注入合法的：
  `<script src="./ui-refresh.js?v=1.14.2.3" defer></script>`
- 保留「最新已完成 Session」邏輯。
- 一般「賽果」入口會先改：
  - `state.resultRound`
  - `state.resultSession`
  再交給原本 `openResults()`。
- 如果 PWA restore 時剛好已停在 Results 頁，也會做一次自動校正。
- 明確點某站的「本站賽果」仍尊重使用者指定，不自動跳站。

## 預期
目前如果排位已結束：
一般「賽果」 → 本站 → 排位賽。

不用等正賽結束。

## 上傳
覆蓋：
- `sw.js`
- `ui-refresh.js`

`index.html`、`ui-refresh.css` 不用改。
