# ShiftPay — Design System

Hướng thiết kế: **Bảng ca**. Giao diện là một cuốn sổ vận hành: nền giấy nhạt, mực đậm, đường kẻ rõ, một màu teal làm điểm nhấn và một ô chartreuse đánh dấu việc cần xử lý. Không trang trí thừa; dữ liệu, trạng thái và hành động phải đọc được ngay.

## 1. Visual Theme & Atmosphere

- Cảm giác: bảng ca giấy, sổ lương, lịch phân công — tin cậy, gọn, có nhịp.
- Mật độ: dày vừa phải; metadata dùng mono, nội dung chính dùng sans.
- Bề mặt phẳng: `surface` trên `canvas`, phân tách bằng `line`, **không shadow, không gradient, không card nổi**.
- Bo góc 2px cho mọi control; avatar tròn là ngoại lệ.
- Mỗi màn có một điểm nhấn: teal cho hành động/đang chọn, chartreuse cho “cần xếp”.
- Chuyển động 120ms/180ms; một khoảnh khắc có chủ đích, không animation trang trí.

## 2. Color Palette & Roles

### Primitive (light)

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `chalk-50` | `#fbfcf9` | surface |
| `chalk-100` | `#f2f4f0` | canvas |
| `chalk-200` | `#e8ece7` | surface-2 |
| `chalk-300` | `#d5dbd4` | line |
| `chalk-400` | `#b9c2ba` | line-strong |
| `ink-900` | `#101613` | ink |
| `ink-450` | `#3f4b44` | ink-soft |
| `ink-400` | `#5b665f` | ink-muted |
| `teal-600` | `#0d6b5f` | accent, brand |
| `teal-700` | `#0b5a50` | accent-ink |
| `teal-100` | `#dcede8` | accent-soft |
| `teal-25` | `#f4fbf7` | on-accent, on-brand |
| `lime-300` | `#dde84a` | highlight |
| `lime-950` | `#1a2008` | highlight-ink |
| `green-700` | `#15734f` | success |
| `amber-700` | `#7e5a0f` | warning |
| `red-700` | `#b23a2c` | danger |
| `blue-700` | `#2f5d8a` | info |

### Semantic (light → dark)

| Semantic | Light | Dark |
| --- | --- | --- |
| `canvas` | `#f2f4f0` | `#0c1210` |
| `surface` | `#fbfcf9` | `#131a17` |
| `surface-2` | `#e8ece7` | `#1b2521` |
| `line` | `#d5dbd4` | `#27332c` |
| `line-strong` | `#b9c2ba` | `#3a4a40` |
| `ink` | `#101613` | `#ecf2ec` |
| `ink-soft` | `#3f4b44` | `#c4cec7` |
| `ink-muted` | `#5b665f` | `#a6b3aa` |
| `accent` | `#0d6b5f` | `#63d2c0` |
| `accent-ink` | `#0b5a50` | `#9fe6da` |
| `accent-soft` | `#dcede8` | `#123a33` |
| `on-accent` | `#f4fbf7` | `#06201b` |
| `highlight` | `#dde84a` | `#d7e36a` |
| `highlight-ink` | `#1a2008` | `#121505` |
| `success` | `#15734f` | `#63c79b` |
| `warning` | `#7e5a0f` | `#e0b768` |
| `danger` | `#b23a2c` | `#f08a7a` |
| `info` | `#2f5d8a` | `#8fb8e0` |

Quy tắc:
- Chỉ dùng token semantic trong component; không hardcode hex (ngoại lệ: meta theme-color).
- Chartreuse là **trạng thái cần xếp/highlight**, không dùng cho nút chính.
- Teal là accent/selection/CTA; đỏ chỉ cho phá hủy/lỗi; vàng cho chờ xử lý; xanh dương cho “đã ứng”.
- Không dùng màu làm tín hiệu duy nhất: luôn kèm chữ hoặc icon.
- Các cặp chính đã kiểm AA: ink-muted/surface 5.81 (light), 8.12 (dark); ink-soft/surface 8.86/10.94; accent-ink/surface 7.87/12.46; trạng thái ≥5.67; highlight 12.53/13.29; on-brand/brand 6.08; rail-muted/rail 7.26/6.37.

## 3. Typography Rules

- Sans: **IBM Plex Sans** (400/500/600) cho toàn bộ UI.
- Mono: **IBM Plex Mono** (400/500) cho số, ngày, nhãn metadata, eyebrow.
- Scale:
  - `text-display` 28px/1.2, −0.02em — tiêu đề trang.
  - `text-title` 18px/1.4 — tiêu đề section/modal.
  - `text-body` 16px/1.5.
  - `text-body-sm` 14px/1.5 — nội dung bảng, nút.
  - `text-label` 12px/1.4 — caption/hint.
  - `text-mono-label` 11px/1.4, +0.02em — eyebrow/cột bảng.
  - `text-data` 22px/1.2 — số liệu KPI.
- Số dùng `tabular-nums`; tiền dùng `font-mono`.
- Không viết hoa toàn bộ câu; chỉ label mono ngắn có thể uppercase.
- Không dùng font ngoài cặp trên; Playfair chỉ tồn tại dưới dạng wordmark đã outline trong logo.

## 4. Component Stylings

- **Button**: `min-h-11`, radius 2px, chữ 14px semibold. Variants: primary teal, secondary surface-2, outline, danger, success, warning; loading thay icon bằng spinner.
- **Input/Field**: `min-h-11`, surface, border line; focus ring 2px; label trên, hint/error dưới; lỗi `aria-invalid` + text danger; placeholder chỉ là ví dụ định dạng, không phải chỉ dẫn.
- **SearchInput**: icon trái, clear 44px, cùng chiều cao input.
- **Checkbox/Switch/Radio**: Radix; hit area ≥44px qua label/hàng.
- **Dropdown/TimePicker**: trigger 44px; listbox keyboard; searchable khi danh sách dài.
- **Tabs**: Radix; trigger 44px, border-bottom accent.
- **Tag**: mono 11px, border + nền nhạt, không dùng thay button.
- **Ledger row**: surface phẳng, đường kẻ giữa dòng, hover surface-2; tên là nút mở chi tiết; action 44px.
- **KPI strip**: lưới ô kẻ, border-top 2px ink; số mono data; note trạng thái; highlight chartreuse khi cần.
- **Modal**: Radix Dialog; mobile bottom sheet, desktop center, `max-h-[85dvh]`, footer dính; title rõ; đóng 44px; không lồng modal.
- **Toast**: Radix; 1 dòng, icon trạng thái; không dùng toast cho lỗi field.
- **EmptyState**: icon + title + một dòng mô tả; action optional và không lặp CTA ở header.
- **Nav**: rail 76px desktop (mark, 5 tab, theme/logout); bottom nav mobile 5 tab; active chartreuse; focus ring trên rail.
- **Calendar**: lưới tháng Thứ 2-first, 42 ô; ô ngày là gridcell; chip sự kiện; mobile dot; agenda ngày.
- **Payment**: modal 2 cột; chọn ca bằng Checkbox; QR ở cột phải; footer CTA.
- **BankCard**: khối phẳng nhãn mono, số tài khoản mono.
- **ImageCropper**: khung ảnh, slider zoom 44px, lỗi/đang xử lý rõ.

## 5. Layout Principles

- Container dữ liệu: `max-w-[1400px]`, padding 16/24px; Settings `max-w-3xl`.
- Header màn: eyebrow mono (scope) + h1 display + CTA phải; border-bottom.
- Dùng border và khoảng trắng thay card; spacing 4px scale (4/8/12/16/20/24).
- Bảng/sổ: header mono, dòng kẻ, cột cố định cho số/action; mobile chuyển sang xếp dọc có nhãn.
- Page scroll bình thường; không ép overview vào một màn trừ khi là yêu cầu sản phẩm rõ.
- Modal form: nhóm section có nhãn mono, border-top; footer luôn thấy.
- Mobile: nội dung dưới bottom nav, safe-area bottom; không nested scroll trừ picker/QR list có chủ đích.

## 6. Depth & Elevation

- Không shadow, không gradient.
- Tầng bề mặt: canvas < surface < surface-2; phân tách bằng `line`.
- Overlay dùng `scrim` + border; modal/popover/toast có z-index riêng; không tạo card lồng card.
- Focus ring 2px + offset; trên rail dùng ring highlight; trên brand dùng ring on-brand.
- Selected dùng `accent-soft` + border accent, không nâng khối.

## 7. Do's and Don'ts

**Do**
- Nói đúng dữ liệu: “N ca”, “N sự kiện”, “N người”; nêu phạm vi tháng/tuần khi trộn.
- Một CTA chính mỗi trạng thái; CTA lặp lại chỉ khi thật sự khác hành động.
- Disable kèm lý do; lỗi field đặt tại field, lỗi tổng dùng `role=alert`.
- Dùng “Chưa có…” khi chưa có dữ liệu, “Không tìm thấy…” khi lọc không ra.
- Giữ trạng thái loading/empty/error/offline; skeleton đúng hình dạng.
- Kiểm tra 44px, focus, keyboard, reduced motion, zoom 200%.

**Don't**
- Không dùng “công” để đếm ca (chỉ “công nợ” là khoản tiền).
- Không quảng cáo tính năng không có (ví dụ chấm công/giờ công).
- Không dùng placeholder làm label hoặc chỉ dẫn thay hint.
- Không dùng chấm màu trần cho trạng thái; luôn có chữ.
- Không hardcode màu ngoài token; không dùng icon-only thiếu `aria-label`.
- Không thêm modal chồng modal, không auto-mở thanh toán khi chỉ muốn xem chi tiết.
- Không tạo số liệu giả/leading zero/“đã đủ” khi chưa có dữ liệu.

## 8. Responsive Behavior

- Breakpoints kiểm: **375 / 768 / 1024 / 1440**, ưu tiên ngang nhau mobile/desktop.
- `<768`: một cột; bảng chuyển dòng có nhãn; KPI 1–2 cột; modal bottom sheet; bottom nav; page scroll.
- `768–1279`: lưới lịch full width, agenda dưới; bảng địa điểm/nhân sự xếp dọc tới `lg`.
- `≥1024`: ledger nhiều cột; `≥1280`: lịch + agenda cạnh nhau, Settings vẫn giới hạn đọc.
- Touch target tối thiểu 44×44; khoảng cách giữa target ≥8px.
- Viewport cho phép zoom; dùng `dvh`, safe-area `env(safe-area-inset-*)`; không cắt nội dung ở 200% zoom.
- Form dài cuộn trang; footer modal dính; không che bottom nav.

## 9. Agent Prompt Guide

Khi tạo/sửa UI ShiftPay:
- Đọc `src/index.css` cho token; chỉ dùng class semantic (`bg-surface`, `text-ink-muted`, `border-line`, `bg-accent`, `text-highlight-ink`…).
- Dùng primitive trong `src/components/ui/` trước khi viết control mới; Radix cho dialog/popover/tabs/checkbox/radio/switch/toast.
- Page header pattern: eyebrow mono + `text-display` h1 + CTA 44px; container `max-w-[1400px]` (Settings `max-w-3xl`).
- Danh sách dữ liệu dùng ledger row phẳng, không card nổi; số/ngày dùng mono; trạng thái có chữ + tag.
- Form: Field + Input/Textarea/TimePicker; lỗi tại field; nút submit loading; hint khi không có thay đổi.
- Modal: Radix, footer dính, mobile bottom sheet; không chồng modal.
- Empty/loading/error dùng `EmptyState`/Skeleton/Toast; copy theo GLOSSARY.
- Trước khi giao: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`; grep asset/token/motion chết; kiểm tra 44px, focus, zoom, reduced motion.
- Không tự thêm màu, font, shadow, gradient hay tính năng ngoài spec.

### PWA
- Manifest + icon brand, theme-color đồng bộ, splash teal, offline indicator, SW `at-shiftpay-v4` precache shell + asset hash.
- Fonts Google có thể fallback system khi offline; không chặn app.
- Cập nhật cache version khi đổi asset shell.

### Voice
- Tiếng Việt, câu ngắn, sentence case, không exclamation.
- Xưng “bạn” với người dùng; không dùng thuật ngữ kỹ thuật trong UI.
- Ví dụ: “Chưa có ca nào đang mở.”, “Không tìm thấy nhân viên.”, “Đã lưu cài đặt.”

Xem thêm `GLOSSARY.md` cho thuật ngữ nghiệp vụ và `src/index.css` cho giá trị token hiện tại.
