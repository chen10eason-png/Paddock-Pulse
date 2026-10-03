# Paddock Pulse V1.14.2.2 — Results Auto Advance

正式 repo 基準：V1.14.2.1。

「賽果」現在會自動跳到本季最新已完成的 Session，而不是等正賽結束才換分站。

例：
- FP1 結束 → 本站 FP1
- FP2 結束 → 本站 FP2
- FP3 結束 → 本站 FP3
- 排位結束 → 本站排位
- 正賽結束 → 本站正賽

保護：
- 下一個 Session 已開始時，前一個 Session 一定視為完成。
- 本機已有該 Session 結果 cache 時，視為已確認完成。
- 否則採保守時間，避免把還在進行中的 Session 誤判結束。
- 使用者明確點某一站「本站賽果」時，不會被自動跳走。

上傳只需覆蓋：
- sw.js
- ui-refresh.js

index.html、ui-refresh.css 不用改。
