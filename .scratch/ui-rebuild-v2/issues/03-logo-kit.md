# 03: Logo kit — Bảng ca

**What to build:** Bộ logo hoàn chỉnh cho hướng Bảng ca: mark B vector, wordmark "ShiftPay", lockup ngang/dọc, bản một màu/đảo, app icon + favicon, bản rút gọn cho 16px, và hướng dẫn dùng tối thiểu. Màu mark = accent teal của hướng.

**Blocked by:** 02 (đã xong).

Status: resolved

## Ràng buộc

- Mark giữ đúng nội dung favicon gốc (waiter, khay, vòng tròn, AT); mark nguồn là B đã chọn, không vẽ lại thành hình khác.
- Wordmark serif hiện đại; wordmark hiện tại chỉ là placeholder trong mockup.
- Palette: teal `#0D6B5F` trên nền sáng, `#63D2C0` trên nền tối; mono trắng/đen.
- Không dùng gradient, filter, text sống trong file mark/lockup cuối.
- Bản 16px phải đọc được; được rút gọn chi tiết nhỏ nhưng giữ waiter/khay/vòng tròn/AT.

## Checklist

- [x] Mark B sạch, chuẩn hóa 256, các biến thể teal/reversed/mono.
- [x] Wordmark serif dựng outline, kiểm tra kerning; ghi rõ font gốc + license.
- [x] Lockup ngang, dọc, symbol-only; khoảng cách chuẩn.
- [x] App icon 512/192/180 + favicon.ico + web manifest; bản nhỏ 16/32.
- [x] Hướng dẫn dùng (clear space, min size, misuse) trong `BRAND.md`.
- [x] Board trình bày + audit SVG + kiểm tra 16/32/64.

## Comments

2026-10-30 — Bắt đầu sau khi chọn Bảng ca. Wordmark dự kiến dựng từ Playfair Display SemiBold (OFL), outline và chỉnh spacing; sẽ ghi rõ đây là logotype dựng từ font, chưa phải lettering vẽ tay. Mark giữ nguyên trace B.


2026-10-30 — Kit hoàn thiện trong `logo/kit/`:
- Mark: primary teal, reversed, mono; wordmark dựng outline từ Playfair Display SemiBold (OFL 1.1), chỉnh kerning tP/ft; lockup ngang + dọc.
- App icon: tile teal bo góc, mark chalk; maskable nền vuông; small cut trace 96px cho favicon 16/32/48; icon 192/512 + apple-touch 180 + manifest.
- Board: `kit.png`; hướng dẫn: `BRAND.md`.
- Audit: mark 825 anchor (complex; có small cut 139), wordmark 332 anchor 97/100, mark-small 139 anchor 91/100, app icon 83/100. Lockup audit báo tiny-detail vì không đọc nested SVG; bản nhỏ dùng mark-small.
- Contrast: teal/chalk 5.78; teal light/ink 10.37; chalk/teal 6.08.
- Chưa copy vào `public/`. Wordmark là logotype dựng từ font, chưa phải lettering vẽ tay; nếu cần bản full-custom, làm pass riêng.
