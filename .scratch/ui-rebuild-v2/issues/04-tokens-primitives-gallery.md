# 04: Token + primitive + gallery (Bảng ca)

**What to build:** Nền tảng giao diện Bảng ca: token Tailwind v4, theme theo system, bộ primitive (Radix cho widget phức tạp), và gallery dev để duyệt visual trước khi đụng shell/màn hình. Không đổi bố cục màn hình trong ticket này.

**Blocked by:** 02, 03 (đã xong).

**Status:** in-progress — chờ duyệt plan trước khi sửa `src/`.

## Quyết định

- Giữ tên token semantic hiện tại (`canvas`, `surface`, `ink`, `accent`…) để 1.150 chỗ dùng không phải đổi hàng loạt; chỉ đổi giá trị + thêm token mới. Không phải compat layer — cùng một vai trò semantic.
- Theme mặc định **system**; toggle ghi đè light/dark; lưu lựa chọn.
- 8 package Radix: dialog, popover, switch, checkbox, tabs, tooltip, toast, radio-group.
- Dropdown tìm kiếm = Radix Popover + listbox ARIA tự viết; không thêm cmdk.
- TimePicker = hai Dropdown (giờ/phút) thay wheel picker; bỏ `@ncdai/react-wheel-picker`.
- Không thêm shadcn; primitive là code nội bộ dùng Radix.

## Token

### Màu semantic

| Token | Light | Dark | Dùng |
| --- | --- | --- | --- |
| `canvas` | `#F2F4F0` | `#0C1210` | nền app |
| `surface` | `#FBFCF9` | `#131A17` | panel, modal |
| `surface-2` | `#E8ECE7` | `#1B2521` | input, hover, header bảng |
| `line` | `#D5DBD4` | `#27332C` | border thường |
| `line-strong` | `#B9C2BA` | `#3A4A40` | border nhấn, header bảng |
| `ink` | `#101613` | `#ECF2EC` | text chính |
| `ink-soft` | `#3F4B44` | `#C4CEC7` | text phụ |
| `ink-muted` | `#5B665F` | `#A6B3AA` | label, meta |
| `accent` | `#0D6B5F` | `#63D2C0` | primary, focus |
| `accent-ink` | `#0B5A50` | `#9FE6DA` | text accent |
| `accent-soft` | `#DCEDE8` | `#123A33` | nền chọn, active |
| `on-accent` | `#F4FBF7` | `#06201B` | text trên accent |
| `highlight` | `#DDE84A` | `#D7E36A` | "Cần xếp", nhấn tạm |
| `highlight-ink` | `#1A2008` | `#121505` | text trên highlight |
| `success` | `#15734F` | `#63C79B` | đã chốt/đã trả |
| `warning` | `#7E5A0F` | `#E0B768` | chờ chốt/sắp tới |
| `danger` | `#B23A2C` | `#F08A7A` | lỗi/hủy |
| `info` | `#2F5D8A` | `#8FB8E0` | đã ứng |
| `scrim` | `#101613` | `#000000` | overlay modal |
| `ring` | = accent | = accent | focus ring |

Contrast đã đo: ink/canvas 16.6, muted/canvas 5.4, accent/chalk 5.78, on-accent/accent 6.08, highlight-ink/highlight 12.53, warning/surface 6.08. `info`/`danger` kiểm lại khi implement.

### Typography

- `--font-sans: 'IBM Plex Sans'`, `--font-mono: 'IBM Plex Mono'`; load 400/500/600 + mono 400/500 từ Google Fonts (đã xác nhận subset Vietnamese).
- `display` 28/1.2/−0.02em; `title` 18/1.4/−0.01em; `body` 16/1.5; `body-sm` 14/1.5; `label` 12/1.4; `mono-label` 11/1.4/+0.02em; `data` 22/1.2/−0.02em.
- Tabular nums cho tiền, giờ, số ca.

### Shape / motion

- Radius 2px cho control/card/modal; avatar tròn.
- Không shadow; phân tầng bằng border + surface.
- `--duration-fast: 120ms`, `--duration-base: 180ms`, `--ease-standard: cubic-bezier(0.2,0.8,0.2,1)`; giữ tên để `src/lib/motion.ts` đọc được.
- Focus: ring 2px accent + offset 2px canvas/surface.
- Reduced-motion tắt animation/transition.

## Theme

- `themeStore`: `theme: 'system' | 'light' | 'dark'` (default `system`), `resolvedTheme`, `setTheme`, `toggleTheme` (đặt light/dark).
- `<html class="dark">` khi tối; light không class. Bỏ `html.light`; base CSS là light, `.dark` override.
- Script pre-paint trong `index.html` đọc `theme` đã lưu; nếu system đọc `prefers-color-scheme`; set class + `color-scheme` trước paint.
- Lắng nghe `matchMedia` khi system; cập nhật `meta name="theme-color"` theo canvas.
- Call sites cần sửa: `Navbar`, `settings`, `locations` (đọc resolved), `Switch`.
- Settings giữ toggle light/dark trong ticket này; control 3 lựa chọn (Hệ thống/Sáng/Tối) làm ở ticket settings.

## Primitive

Giữ API công khai của primitive cũ; screens compile không phải sửa hàng loạt.

| Primitive | Nền | Ghi chú |
| --- | --- | --- |
| `Modal` | Radix Dialog | giữ `title/isOpen/onClose/children/footer`; focus trap/ESC/scroll lock do Radix |
| `Dropdown` | Radix Popover + listbox ARIA | giữ props hiện tại; thêm `aria-activedescendant`, Arrow/Home/End/Enter/Esc; searchable giữ nguyên |
| `Checkbox` | Radix Checkbox | giữ `checked/onChange/label/id` |
| `Switch` | Radix Switch | tách `Switch` generic (`checked/onCheckedChange/disabled/label`) + `ThemeSwitch` dùng theme store; settings đổi 1 dòng |
| `ToastProvider` | Radix Toast | giữ `useToast().showToast(message, type, duration)`; live region, swipe |
| `TimePicker` | 2 × Dropdown | giữ `value/onChange/className`; bỏ wheel picker |
| `Tabs` | Radix Tabs | mới; dùng cho settings/gallery sau |
| `Tooltip` | Radix Tooltip | mới; icon-only controls |
| `RadioGroup` | Radix RadioGroup | mới; theme 3 lựa chọn/forms |
| `Input`, `Textarea`, `Field` | native + token | mới; label/hint/error/id, 16px input |
| `Tag` | native | mới; neutral/success/warning/danger/info/highlight |
| `Button`, `SearchInput`, `Skeleton`, `Loader`, `LoadMore`, `Tiles`, `ScrollToTopButton` | native | giữ API, restyle token; Loader dùng mono + spin, bỏ loader road |

- Mọi control có target ≥44px hoặc hit area 44px; focus-visible; disabled rõ; loading có nhãn.
- Không hardcode màu trong primitive; chỉ token.
- Bỏ import/usage `@ncdai/react-wheel-picker`; xóa dependency.
- Xóa `src/hooks/useThemeStyles.ts` (không còn ai dùng).
- Giữ block `illustration` tạm thời cho splash/avatar cũ; xóa ở ticket splash/login.

## Gallery

- `src/dev/Gallery.tsx`, chỉ render khi `import.meta.env.DEV` và path `/gallery`; đặt trước splash/auth trong `App()`; không lộ ở production.
- Nội dung: token (màu light/dark, type scale, radius, focus, motion), Button variants/states, Input/Field/Checkbox/RadioGroup/Switch, Dropdown simple/searchable/disabled, TimePicker, Modal, Tabs, Tooltip, Toast, Tag, Skeleton/Loader, theme toggle.
- Mỗi control có state default/hover/focus/disabled/loading/error nếu áp dụng.
- Gallery dùng chính primitive, không mock.

## File dự kiến

- `package.json`, `package-lock.json`
- `index.html`
- `src/index.css`
- `src/stores/themeStore.ts`
- `src/components/ui/*` (13 cũ + 8 mới)
- `src/lib/utils.ts` (nếu cần focus ring)
- `src/config/colors.ts`
- `src/app/app.tsx` (chỉ nhánh gallery dev)
- `src/dev/Gallery.tsx`
- `src/app/routes/settings.tsx` (1 dòng ThemeSwitch)
- `src/components/layouts/Navbar.tsx`, `src/app/routes/locations.tsx` (đọc resolvedTheme)
- `src/hooks/useThemeStyles.ts` (xóa)

Không sửa: screens layout, shell layout, splash/login assets, `public/`, API/Firebase, business logic.

## Strings

- Không đổi copy nghiệp vụ. Thêm nhãn gallery/theme: "Hệ thống", "Sáng", "Tối", "Thử giao diện", "Màu", "Kiểu chữ", "Bộ điều khiển". Toast/modal giữ nguyên câu hiện có.

## Verify

- `npm install`; `npm run lint`; `npm run format:check`; `npx tsc --noEmit`; `npm run build`.
- `npm run dev` + Chrome: `/gallery` ở 375/768/1024/1440, light/dark/system; tab keyboard toàn bộ; Esc modal; dropdown Arrow/Home/End/Enter; toast live region; focus visible; reduced-motion; console sạch.
- Kiểm tra computed contrast các cặp chính; chụp gallery light/dark + vài state.
- App thật vẫn load được (login → dashboard) sau khi đổi token; shell/màn hình sẽ trông chuyển tiếp, không phải final.
- Giới hạn: repo không có test suite; không có visual regression tự động; QA là build/lint/tsc + trình duyệt thủ công.

## Trạng thái nhánh

- Branch `feat/ui-rebuild-v2`; `src/` chưa bị sửa; ticket 01–03 + mockup/kit nằm trong `.scratch` chưa commit. Có file `tmp_*` ở root cần dọn trước commit.
- Nếu muốn mốc trước khi sửa code: nói "commit 01–03" — tôi commit spec/ticket/mockup/kit (không gồm `tmp_*`).
