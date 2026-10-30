# 01: Logo mark — 3 treatment cùng nội dung favicon

**What to build:** Ba treatment vector cho mark ShiftPay, giữ nguyên nội dung favicon: waiter bưng khay, vòng tròn, monogram "AT". Khác nhau ở tỷ lệ và độ tinh chỉnh, không đổi thành phần. Trình bày một concept sheet đen trắng kèm khuyến nghị, chờ người dùng chọn trước khi dựng kit.

**Blocked by:** None.

Status: resolved

## Ràng buộc

- Nội dung cố định: waiter nhìn sang phải, khay có chân đỡ, vòng tròn hai khe, "AT" serif. Không thêm mascot/monogram khác.
- Được cân lại tỷ lệ: figure lớn hơn, "AT" rõ hơn, vòng tròn mở đúng chỗ khay đi ra; giữ đủ chi tiết (nắp, nơ, 6 nút, mặt nghiêng, tay áo).
- Vẽ SVG đen trên trắng, không gradient, không filter, không text sống trong mark.
- Mỗi treatment phải đọc được ở 16/32/64 px; ưu tiên silhouette rõ.
- Màu chưa quyết; mark trình bày đen trắng.

## Checklist

- [x] 3 file SVG mark (256×256, đen trắng), khác tỷ lệ/độ đậm rõ rệt.
- [x] Render PNG 512 và kiểm tra bằng mắt; audit SVG.
- [x] Kiểm tra 16/32/64 px trên concept sheet.
- [x] Concept sheet + một dòng ý tưởng mỗi treatment + khuyến nghị.
- [x] Người dùng chọn đúng một treatment; ghi lựa chọn vào ticket.

## Comments

2026-10-30 — Bắt đầu. Đã đọc favicon gốc 234×234, đo vòng tròn (tâm 117,116; bán kính ngoài 90; hai khe ở 198–233° và 296–346°), vị trí AT/khay/tay áo. Dựng trên lưới 234 rồi scale 256 để giữ đúng tỷ lệ gốc.

2026-10-30 — Checkpoint. Ba treatment dựng từ vector trace của chính favicon để giữ đúng nội dung, đã tách lớp body/head/AT:
- A — Chuẩn hóa: trace đúng tỷ lệ gốc, normalize vào 256, lề ~29.
- B — Cân tỷ lệ (khuyến nghị): AT ×1.07, đầu ×1.03, neo đáy AT/neck để không rời khay/cổ.
- C — Đậm nét: trace + stroke 6 (trong hệ 776) để dày đều toàn mark.

Audit: 825 anchor, 1 màu, bbox fill 0.6, score 83/100; cảnh báo độ phức tạp và nét gần 90° (210,95). 16px hiện bị bết ở A/B; kit sẽ có bản small-size cut rút gọn riêng. File: `logo/trace-{a,b,c}.svg`, `logo/concepts.png`.

2026-10-30 — **Chọn B — Cân tỷ lệ.** B thành mark nguồn cho 3 hướng UI. Wordmark, mono/reversed, app icon và small-size cut sẽ làm trong ticket logo kit sau khi chốt accent. Ticket complete.

