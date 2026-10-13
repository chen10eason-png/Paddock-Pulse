# Paddock Pulse V1.16.3 — Track Reliability + Helmet/Car Visuals

## 賽道圖
保留既有已核實 slug，不更動賽道身份。

每一張已核實賽道圖，現在先嘗試 F1DB 的 CC BY 4.0 white-outline SVG：
1. GitHub raw
2. jsDelivr
3. 再回到 V1.16.2 既有來源與 fallback

F1DB 的 circuit SVG assets 同樣源自 Jules Roy，授權 CC BY 4.0。
未知或未核實的 layout 仍不猜。

## 車手視覺
依使用者要求，不畫真人臉。
車手卡改成較寫實的原創頭盔 SVG：
- 更接近完整賽車頭盔比例
- visor / 下巴 / 通風結構更立體
- 使用車隊色與車號
- 不複製官方頭盔塗裝

## 車隊 / 車子視覺
車隊卡的原創賽車 SVG 改成更接近現代 F1 單座車比例：
- 寬前翼 / 後翼
- 暴露輪胎
- 窄鼻
- 側箱
- Halo / cockpit
- 車隊主色

## 上傳
覆蓋：
- `live-integration.js`
- `sw.js`

新增：
- `visual-enhancement.js`

README 可不必上傳。
