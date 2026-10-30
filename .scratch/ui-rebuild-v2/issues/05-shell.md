# 05: Shell — rail desktop + bottom nav + chrome

**What to build:** Khung ứng dụng Bảng ca: rail desktop, bottom nav mobile, offline indicator, splash, scroll-to-top, pull-to-refresh, PWA icons/manifest. Không đổi bố cục nội dung màn hình, không đụng login.

**Blocked by:** 04 (đã xong, commit `553ac4f`).

Status: resolved

## Hiện trạng

- `Navbar` đang là sidebar 248px + bottom nav 64px; logo cũ; theme button; logout; user card.
- `AppShell` bọc `<main className="md:pl-[var(--sidebar-width)]">`, `PullToRefresh`, routes, `ScrollToTopButton`.
- `OfflineIndicator` là banner full-width success/danger dùng motion.
- `Splashscreen` dùng Lottie 2s + `logo_text.png`; `lottie-react` chỉ dùng ở đây.
- `public/manifest.json` + `sw.js` vẫn dùng màu/icon cũ (vàng, logo_text).
- Token 04 đã có rail width placeholder, primitives, theme system, gallery.

## Thiết kế shell (từ hướng Bảng ca)

### Desktop (≥768px)

- Rail trái cố định 76px, nền `#101613` ở cả hai theme; mark light-teal 34px; không wordmark.
- 5 nav: Tổng quan, Lịch tiệc, Nhân sự, Thanh toán, Cài đặt; icon 19 + label 9px.
- Active: nền chartreuse + chữ ink; hover: nền `#1B2521` + chữ rail-ink.
- Đáy rail: avatar initials (từ auth user), nút theme 44px, nút logout 44px (mở confirm modal hiện có).
- Main: `md:pl-[var(--rail-width)]`; không thêm topbar — header thuộc từng màn.

### Mobile (<768px)

- Bottom nav 64px + safe-area, 5 item, active accent + accent-soft; label 9px.
- Main padding-bottom đủ chỗ cho nav + safe-area.
- ScrollToTop nổi trên nav (`bottom-20`), 44px; chỉ hiện sau 400px như hiện tại.

### Chrome

- Offline: banner mảnh trên cùng, mono label, success/danger, `role="status"`, safe-area; không đổi layout khi ẩn/hiện (fixed).
- Splash: nền teal `#0D6B5F`, lockup trắng (mark + wordmark) căn giữa; 800ms, reduced-motion 300ms; bỏ Lottie, `splashscreen.json`, `lottie-react`, chunk `lottie-vendor`.
- PullToRefresh: giữ hành vi; indicator token hóa, reduced-motion; không đổi logic.
- PWA: copy `favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `manifest.json` từ kit vào `public/`; cập nhật `index.html` links/meta; `sw.js` cache v3 + icon mới; giữ `logo_text.png`/`avatar.png`/`background.png` cho login tới ticket login.

## Token/asset

- Thêm semantic rail: `rail`, `rail-ink`, `rail-muted`, `rail-hover`, `rail-line`; active dùng `highlight`/`highlight-ink`.
- Copy brand: `mark-reversed.svg` cho rail; lockup white cho splash; giữ file SVG trong `src/assets/brand/`.
- Không đổi token/primitive khác.

## File dự kiến

- `src/components/layouts/Navbar.tsx` (rail + bottom nav; nhận `user`)
- `src/app/app.tsx` (truyền user; padding rail/nav)
- `src/components/layouts/OfflineIndicator.tsx`
- `src/components/Splashscreen.tsx`
- `src/components/PullToRefresh.tsx`
- `src/components/ui/ScrollToTopButton.tsx`
- `src/index.css` (rail tokens)
- `index.html`, `public/favicon.ico`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`, `public/manifest.json`, `public/sw.js`
- `src/assets/brand/*`, xóa `src/assets/splashscreen.json`
- `package.json`, `package-lock.json`, `vite.config.ts` (bỏ lottie)
- `.scratch/.../issues/05-shell.md`

Không sửa: screens, login, API/Firebase, business logic, gallery.

## Strings

- Giữ label nav/page hiện tại: Tổng quan, Lịch tiệc, Nhân sự, Thanh toán, Cài đặt.
- Thêm aria-label cho rail/logout/theme/avatar; offline giữ câu hiện tại; splash alt "ShiftPay".

## Verify

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- `npm run dev`: splash trước login; ảnh 375/768/1024/1440 sau khi đăng nhập; rail/bottom nav active, keyboard focus, logout confirm, theme, offline toggle, scroll-to-top, pull-to-refresh; console sạch.
- PWA: favicon/manifest/icon files; SW cache v3.
- Giới hạn: shell nằm sau auth; cần user đăng nhập để chụp/QA. Nếu không có tài khoản test, tôi chỉ verify splash + build, và báo rõ phần chưa xem.

## Trạng thái

- `src/` sạch sau commit 04; ticket 05 chưa sửa code. Chưa commit gì thêm.


## Kết quả triển khai

2026-10-30 — Đã apply shell, chỉ kiểm static theo yêu cầu.

- Rail desktop 76px nền `rail` tối, mark reversed, 6 nav label 9px (thêm Địa điểm sau review), active chartreuse; đáy avatar nhận diện 44 (không phải nút, `role="img"` + tên người dùng) + theme 44 + logout 44. Mobile bottom nav 64px + safe area, active accent; main `md:pl-[var(--rail-width)]`, padding bottom mobile.
- Splash mới: nền `brand` teal, lockup white, 800ms / reduced 300ms; bỏ Lottie, `splashscreen.json`, `lottie-react` và chunk build. Subtitle `on-brand/90` = 5.28:1.
- Offline banner mảnh, `role=status`, mono, `md:left` sau rail; PullToRefresh reduced-motion; ScrollToTop giữ token sẵn có.
- PWA: copy favicon/apple-touch/icon-192/512/manifest từ kit; `sw.js` cache v3 + brand assets; `index.html` links cũ đã đúng nên không sửa.
- Brand assets dùng `public/brand` (không phải `src/assets/brand`) để tham chiếu URL trực tiếp.
- `--sidebar-width` cũ đã xóa; `rg` không còn lottie/splashscreen/sidebar-width/harness.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: brand refs `src` → `public/brand` files tồn tại; PWA icons/manifest/sw cache trỏ file tồn tại; manifest JSON hợp lệ; không còn import Lottie.

## Giới hạn

- Theo yêu cầu: không chạy browser test/screenshot. Shell nằm sau auth nên rail/bottom nav/offline chưa được xem trong app thật; cần user đăng nhập kiểm.
- Login và các màn vẫn là layout cũ, sẽ đổi ở ticket screen tương ứng.
- Harness preview tạm đã xóa, không commit.
