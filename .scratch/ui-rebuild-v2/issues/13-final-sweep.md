# 13: Final sweep — accessibility, PWA, cleanup, docs

**What to build:** Lượt cuối toàn app: sửa các lỗi accessibility/PWA còn lại, dọn asset/token/dependency chết, chuẩn hóa copy, viết `DESIGN.md` thật và chốt QA static. Không đổi tính năng, schema hay luồng dữ liệu.

**Blocked by:** 12 (commit `66f2ac1`).

**Status:** static verified — visual/browser chưa kiểm; 6 điểm chốt đã duyệt.

## Audit (đã kiểm tra code)

### Accessibility / shell

- `index.html` đang đặt `maximum-scale=1.0, user-scalable=no` và thiếu `viewport-fit=cover` → chặn zoom (WCAG 2.2 AA fail) và safe-area iOS có thể = 0.
- Chưa có skip link; `main` chưa có id/tabIndex để nhảy qua rail/bottom nav.
- `ErrorBoundary` dùng `min-h-screen`, `text-lg`, `rounded-lg`, nút raw không focus ring.
- App loading dùng `h-screen`; nên `min-h-dvh`.
- `ImageCropperModal`: range zoom cao 40px (<44), chưa có trạng thái lỗi/đang xử lý, confirm có thể bấm khi chưa có crop.
- `ScrollToTopButton`: scroll `behavior: 'smooth'` không tôn trọng reduced motion; `ENABLED_TABS` thiếu `calendar` và `settings` dù hai màn này dài.
- `OfflineIndicator`: timeout online không cleanup khi unmount.
- Đã kiểm contrast các cặp token chính (light/dark): ink-muted/surface 5.81/8.12, ink-soft 8.86/10.94, accent-ink 7.87/12.46, success/warning/danger/info ≥5.67, highlight-ink/highlight 12.53/13.29, on-brand/brand 6.08, rail-muted/rail 7.26/6.37 → **đều AA**. Cần giữ check này khi sửa token.
- Nhiều text 9–10px chỉ là metadata dày đặc trong board/calendar; contrast đạt nhưng cần xác nhận không phải body text.

### PWA

- SW cache tên `at-shiftpay-v3`; `/avatar.png` đã xóa khỏi list nhưng **chưa bump version** → client cũ giữ cache cũ.
- Install chỉ cache shell (`/`, index, icon, brand) không cache asset hash trong build. Sau khi SW kiểm soát, offline navigation có thể tải index từ cache nhưng thiếu JS/CSS hash → PWA offline lần đầu có thể trắng.
- OG/Twitter images đang là ảnh cũ (nền vàng, UI cũ, logo cũ, copy tiếng Anh "attendance tracking") — lệch hoàn toàn Bảng ca.
- OG/Twitter description vẫn "Nền tảng thanh toán và quản lý tài chính".
- Manifest icons/brand nhìn chung ổn; cần kiểm maskable safe zone khi thay asset.

### Dead code / tokens / dependencies

- `Tiles.tsx` không được import ở đâu; còn motion.
- `index.css` còn palette/token `illustration-*`, `avatar-*` và comment "legacy ... keep until splash/login rebuilt" — đã rebuild xong.
- `package.json` có `motion` không dùng; `recharts` không còn import (spec cũ nói giữ Recharts, cần chốt lại).
- `h-10` còn ở avatar payroll (không tương tác) và range cropper (cần sửa); các nút chính đã 44px.

### Copy / docs

- CSV export header `Tổng công` nhưng value là `workerNames.length` (số người) → sai nghĩa; đổi `Số người`.
- Login panel ghi "chấm công" nhưng app **không có tính năng chấm công/giờ công**; "Chốt công theo từng ca" cũng dễ hiểu sai → "Phân công theo từng ca" / "lịch ca, phân công và thanh toán".
- `DESIGN.md` hiện chỉ là 9 dòng tiêu đề mục, chưa có nội dung.
- `GLOSSARY.md` đang thiếu dù `AGENTS.md` mô tả domain docs at repo root.
- Placeholder mật khẩu đã sạch; các placeholder còn lại là ví dụ/format.

## Plan

1. **A11y + shell**
   - Viewport thành `width=device-width, initial-scale=1.0, viewport-fit=cover` (bỏ maximum-scale/user-scalable).
   - Thêm skip link `Bỏ qua điều hướng` → `#main-content`; đặt id/tabIndex=-1 trên main; chỉ hiện khi focus.
   - Rebuild `ErrorBoundary` bằng token/Button, `min-h-dvh`, focus ring.
   - App loading `min-h-dvh`; `OfflineIndicator` clear timer; `ImageCropperModal` range 44, confirm loading/disabled, lỗi crop; `ScrollToTopButton` reduced-motion + calendar/settings.
   - Audit icon-only button/aria-label và target 44 lần cuối; không đổi layout.

2. **PWA**
   - Bump cache `at-shiftpay-v4`, giữ activate cleanup.
   - Precache asset hash của build: đọc `index.html` trong install, trích `/assets/*.js|css`, cache cùng shell; fallback nếu parse lỗi vẫn chạy shell.
   - Cập nhật meta theme-color/OG/Twitter; thay OG/Twitter image bằng social card Bảng ca mới (lockup hiện tại + palette teal/chalk + copy "Quản lý ca làm, lịch sự kiện và thanh toán"). Nếu không render được PNG đúng brand, **bỏ meta ảnh cũ** thay vì ship ảnh sai.
   - Kiểm manifest icons/maskable; giữ PWA splash/offline.

3. **Cleanup**
   - Xóa `src/components/ui/Tiles.tsx` và token/palette illustration/avatar; bỏ comment legacy.
   - Bỏ dependency `motion` (không import). **Recharts**: giữ theo spec trừ khi bạn muốn bỏ; không đổi bundle runtime.
   - Grep lại asset cũ (`avatar`, `background`, `logo_text`, Monkey) và TODO/comment chết.

4. **Copy**
   - Export header `Tổng công` → `Số người`.
   - Login benefits: "Phân công theo từng ca"; subline "Một chỗ cho lịch ca, phân công và thanh toán."
   - Soát lại "công" còn lại: chỉ giữ "công nợ"/"phân công", không dùng cho số ca.
   - Placeholder/hint/period toàn app theo chuẩn đã chốt.

5. **Docs**
   - Viết `DESIGN.md` thật theo 9 mục hiện có: atmosphere, palette + semantic roles, typography, component states, layout, depth, do/don't, responsive/breakpoints/touch, agent prompt guide; kèm token names và các quyết định Bảng ca.
   - Tạo `GLOSSARY.md` ngắn: Ca sáng/chiều, Sự kiện, Cần xếp, Công nợ, Đã ứng, Quyết toán, Địa điểm, Sổ nhân sự/lương, trạng thái shift.
   - Không tạo ADR mới trong scope này; ghi nhận `docs/adr/` chưa có nếu cần.

6. **QA**
   - `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
   - Static: grep viewport, asset cũ, raw input, div click, icon-only thiếu aria, `h-10` controls, motion trong feature, "Tổng công", "chấm công".
   - Contrast script cho token light/dark (giữ kết quả AA).
   - Không browser test/screenshot theo yêu cầu; liệt kê rõ phần cần user kiểm thủ công: zoom 200%, keyboard skip link, offline sau install, social preview, crop/upload.

## Điểm cần bạn chốt (kèm đề xuất)

1. Sửa viewport cho zoom + `viewport-fit=cover`, thêm skip link? **Đề xuất: có.**
2. Thay OG/Twitter image bằng social card Bảng ca mới (fallback bỏ meta nếu không render đúng)? **Đề xuất: thay.**
3. Viết `DESIGN.md` đầy đủ + tạo `GLOSSARY.md`? **Đề xuất: có.**
4. Xóa `Tiles` + dependency `motion`, giữ `recharts` theo spec? **Đề xuất: có.**
5. Sửa copy export `Tổng công`→`Số người` và login bỏ "chấm công"/đổi "Chốt công"? **Đề xuất: có.**
6. Giữ QA static (không browser screenshot), chỉ ghi phần cần user kiểm? **Đề xuất: có.**

## Trạng thái nhánh

- `HEAD` `66f2ac1`; ticket 13 đã sửa, chưa commit.

## Kết quả triển khai

2026-10-31 — Final sweep implemented; static only theo yêu cầu.

- Viewport cho phép zoom + `viewport-fit=cover`; thêm skip link tới `#main-content`; main có tabIndex.
- Rebuild ErrorBoundary bằng token/Button, `min-h-dvh`; app loading `min-h-dvh`; OfflineIndicator dọn timer; ImageCropper range 44, loading/error/disabled; ScrollToTop tôn trọng reduced motion và mở cho calendar/settings.
- SW `at-shiftpay-v4`, precache shell + asset hash đọc từ index; chỉ cache GET cùng origin; activate xóa cache cũ; navigation offline fallback về index cho deep link SPA.
- Thay OG/Twitter bằng `public/social-card.png` mới (lockup hiện tại, palette Bảng ca, copy tiếng Việt); xóa ảnh cũ; cập nhật meta description/OG/Twitter.
- Thay `docs/images/mockup.jpg` bằng mockup Bảng ca mới (Lịch sự kiện light + Sổ lương dark, không còn UI/claim cũ); thêm `public/brand/lockup.svg` và sửa README dùng lockup mới thay `logo_text.png` đã xóa; refresh copy README theo tính năng thật.
- Xóa `Tiles.tsx`, palette/token illustration/avatar, dependency `motion`; giữ `recharts` theo spec.
- Copy: CSV `Tổng công` → `Số người`; login bỏ “chấm công”, “Chốt công” → “Chốt lương”; bỏ “VND ·” lặp trong Settings.
- Viết `DESIGN.md` thật (9 mục, token, component, layout, responsive, a11y, PWA, agent guide); tạo `GLOSSARY.md`.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Contrast script key pairs light/dark: tất cả ≥4.5.
- Grep: không `maximum-scale/user-scalable`, không `h-screen`, không `Tiles`/illustration, không ảnh OG cũ, `motion` đã khỏi package.json; recharts vẫn còn.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa kiểm runtime SW precache/offline sau install, zoom 200%, skip link, social preview, crop/upload.
- Social card dùng font work sans/không phải IBM Plex để render offline; lockup lấy từ asset brand.
- SW precache phụ thuộc HTML build có asset `/assets/*`; nếu regex không khớp sẽ fallback network-first (không chặn app).
- Google Fonts vẫn tải từ CDN; offline fallback system font.
- Không có test suite; không audit dependency vulnerabilities trong scope này.
