# Paddock Pulse V1.14.0 — Track Reliability

以線上 V1.13.0 為基準。此版不更動既有賽程、賽果、收藏、輪胎與天氣邏輯，集中改善賽道圖可靠性。

- 25 個已核對 layout ID 保留逐站固定對應，不以其他賽道替代。
- Las Vegas SVG 仍直接隨 PWA 內建。
- 其他核對 SVG 在首次成功載入後由 Service Worker 存入專用 Track Cache，後續可直接使用快取，降低 CDN / GitHub raw 暫時失敗造成的缺圖。
- CDN 與 GitHub raw 只作為「同一份 SVG」的雙來源，不做猜測式 fallback。
- TRACK_AUDIT.json 列出全部 25 個核對 layout。

資料來源：ROY Jules / f1-circuits-svg，CC BY 4.0。

> 注意：除 Las Vegas 外，其他 SVG 仍需至少成功連線一次才會進入裝置快取；這與把 25 個 SVG 全部實體打包進 ZIP 不同。本版不會把這件事誤標成完全離線內建。
