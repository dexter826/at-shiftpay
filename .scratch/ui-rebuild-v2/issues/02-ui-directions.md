# 02: UI directions — 3 hướng Dashboard + Lịch

**What to build:** Ba hướng giao diện hoàn chỉnh cho ShiftPay, mỗi hướng gồm Dashboard desktop (light) và Lịch sự kiện mobile (dark), dùng mark B đã chọn, một cặp font tiếng Việt và một accent riêng. Trình bày screenshot + rationale, chờ người dùng chọn một hướng trước khi làm token/primitive.

**Blocked by:** 01 (đã xong).

Status: resolved

## Ràng buộc

- Mỗi hướng phải khác nhau ở ít nhất 3 trục: palette, typography, cấu trúc layout, shape language, mật độ dữ liệu.
- Nội dung tiếng Việt thật, đúng nghiệp vụ: ca làm, sự kiện, lương, địa điểm, nhân sự.
- Mark B hiển thị đúng; màu mark = accent của hướng.
- Dashboard: 1440×1000, light. Lịch: 390×844, dark.
- WCAG AA cho text/control xuất hiện trong screenshot; focus states có trong HTML; reduced-motion.
- Chỉ file tĩnh trong `.scratch/ui-rebuild-v2/directions/`; không đụng `src/`.
- Không lấy tài liệu/hướng cũ làm tham chiếu.

## Checklist

- [x] 3 hướng dựng xong, mỗi hướng 2 màn, screenshot đủ.
- [x] Kiểm tra contrast các cặp màu chính; ghi lại số đo.
- [x] So sánh 3 hướng trên một ảnh tổng hợp + khuyến nghị.
- [x] Người dùng chọn đúng một hướng; ghi lựa chọn vào ticket.

## Comments

2026-10-30 — Ba hướng đề xuất, đều dùng mark B, accent = màu logo:

- **Sổ quầy** — giấy ấm, mực oxblood, Lora + Be Vietnam Pro. Cấu trúc sổ công: bảng có kẻ dòng, cột mốc thời gian, tem "đã chốt". Mobile dark là sổ lịch buổi tối.
- **Bảng ca** — nền phấn, teal + chartreuse, IBM Plex Sans + Plex Mono. Cấu trúc bảng phân ca 7×3, rail icon, nhãn giờ mono. Mobile dark là timetable dọc.
- **Đêm tiệc** — kem/aubergine, coral, Archivo + Be Vietnam Pro. Cấu trúc editorial bất đối xứng, số lớn, timeline sự kiện. Mobile dark là timeline tiệc tối.


2026-10-30 — Ba hướng đã dựng xong, dùng mark B (trace) làm logo, wordmark tạm bằng font display của từng hướng (sẽ thay bằng custom wordmark trong kit).

- **Sổ quầy** (`directions/so-quay/`): giấy ấm #F2E9DA, mực #241611, oxblood #7A2E26; Lora + Be Vietnam Pro; sidebar + sổ công có kẻ dòng; mobile dark là sổ lịch. Contrast: oxblood/paper 7.77, ink 14.56, muted 5.34, warning 5.23, accent dark/canvas 7.50.
- **Bảng ca** (`directions/bang-ca/`): chalk #F2F4F0, ink #101613, teal #0D6B5F, chartreuse #DDE84A; IBM Plex Sans + Plex Mono; rail icon + bảng 7×3, mobile timetable 2 làn. Contrast: teal/chalk 5.78, on teal 6.08, muted 5.40, highlight 12.53, warning 6.08, accent dark/canvas 10.37.
- **Đêm tiệc** (`directions/dem-tiec/`): cream #F4E9DD, ink #24141E, coral #C8412C, plum #5A2340; Archivo + Be Vietnam Pro; top nav + editorial bất đối xứng; mobile dark là timeline đêm. Contrast: accent-ink 5.85, on-action 6.47, muted 5.26, warning 5.47, dark accent/canvas 8.36. Coral #C8412C trên cream = 4.13 nên chỉ dùng cho logo/graphic/large; text nhỏ dùng accent-ink.

Ảnh tổng hợp: `directions/compare.png`. Khuyến nghị: **Bảng ca** vì bảng phân ca là vật thể lõi của sản phẩm, quét nhanh, mobile timetable mạnh; đánh đổi là lạnh hơn Sổ quầy và đậm đặc hơn. Chờ người dùng chọn.


2026-10-30 — **Chọn Bảng ca.** Accent chốt: teal `#0D6B5F` (light) / `#63D2C0` (dark), highlight chartreuse `#DDE84A`. Wordmark trong mockup là placeholder; kit sẽ dựng wordmark serif. Hướng này thành nguồn cho token, primitive và shell. Ticket complete.
