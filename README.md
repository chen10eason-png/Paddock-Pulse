# Paddock Pulse V1.16.4 — Art Render Fix

## 根因
V1.16.3 新增了新的 helmet/car SVG 函式，但正式 `index.html` 仍保留原本的 `helmetArt()` / `carArt()`。
單純嘗試覆寫函式，對已經 render 完成或後續由原始 render path 重建的卡片不夠可靠，所以實機看起來可能完全沒變。

## V1.16.4
不再只覆寫函式。

`visual-enhancement.js` 現在直接對實際 DOM 生效：
- 每次 Favorites / Profile 重新 render 後，自動找到 `.display-art` / `.profile-art`
- 直接替換成新版 SVG
- MutationObserver 只監看 childList，不監看 class，避免先前 UI observer 自觸發問題
- 每個 art 加 `data-pp-art=1.16.4`，避免重複替換

## 車手
- 仍只使用頭盔，不畫真人臉
- 更接近完整 full-face motorsport helmet
- visor、下巴、側面固定機構、冠部圖樣更明顯
- 車號、車隊主色、第二配色做辨識

## 車隊
- 從原本較抽象的俯視車，改成更像現代 F1 的側前視覺
- 前翼 / 後翼 / 暴露輪胎 / 窄鼻 / sidepod / cockpit / halo 都更明顯
- 依車隊名稱加入第二配色差異

## 上傳
覆蓋：
- `visual-enhancement.js`
- `live-integration.js`
- `sw.js`

README 可不必上傳。
