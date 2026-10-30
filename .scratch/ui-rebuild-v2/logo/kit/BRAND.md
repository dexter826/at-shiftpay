# ShiftPay — brand kit

Hướng: **Bảng ca**. Mark giữ nguyên nội dung favicon gốc (waiter bưng khay, vòng tròn, "AT"); wordmark outline từ Playfair Display SemiBold.

## Màu

| Token | Hex | Dùng |
| --- | --- | --- |
| Teal | `#0D6B5F` | Mark + wordmark trên nền sáng; app icon |
| Teal light | `#63D2C0` | Mark + wordmark trên nền tối |
| Chalk | `#F2F4F0` | Nền sáng; mark trên tile teal |
| Ink | `#101613` | Wordmark mono trên nền sáng; nền tối |
| Chartreuse | `#DDE84A` | Highlight UI, không dùng cho logo |

Contrast: teal/chalk 5.78; teal light/ink 10.37; chalk/teal 6.08.

## File

- `mark-primary.svg` — teal, nền sáng.
- `mark-reversed.svg` — teal light, nền tối.
- `mark-mono-black.svg`, `mark-mono-white.svg` — một màu.
- `lockup-horizontal*.svg` — mark + wordmark ngang; bản teal, reversed, mono.
- `lockup-stacked*.svg` — mark trên wordmark; bản teal, reversed.
- `wordmark-*.svg` — wordmark riêng.
- `mark-small*.svg` — bản rút gọn cho 16–32px.
- `app-icon.svg` — tile teal bo góc; `app-icon-maskable.svg` — nền vuông cho PWA.
- `app-icon-small.svg`, `favicon-16/32/48.png`, `favicon.ico` — favicon.
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `manifest.json`.
- `BRAND.md` — file này.

## Dùng

- Nền sáng: mark + wordmark teal. Nền tối: bản reversed. Một màu khi in/khắc.
- Khoảng trống quanh logo tối thiểu **0.25× chiều cao mark**; không đặt chữ/sát mép.
- Cỡ tối thiểu: mark 24px (dùng `mark-small` dưới 32px); lockup ngang 120px rộng; stacked 80px rộng.
- App icon: tile teal + mark chalk; bản maskable dùng nền vuông, mark nằm trong safe zone.
- Chỉ dùng file có sẵn; không gõ lại wordmark bằng font khác, không kéo giãn, xoay, đổ bóng, gradient, hay đổi màu ngoài palette.
- Không vẽ lại waiter/AT. Nếu cần kích thước mới, scale từ SVG gốc.

## Ghi chú

- Wordmark là logotype dựng từ **Playfair Display SemiBold** (SIL Open Font License 1.1), đã outline và chỉnh spacing; chưa phải lettering vẽ tay hoàn toàn. Nếu cần bản độc quyền hoàn toàn, làm một pass lettering riêng.
- Mark là bản trace/refine từ favicon gốc, không phải hình mới. Bản nhỏ 96px đã lược chi tiết mặt/khuy nhưng giữ waiter, khay, vòng tròn, AT.
