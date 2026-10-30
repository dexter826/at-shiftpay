# 07: Login — Bảng ca brand

**What to build:** Rebuild toàn bộ màn đăng nhập/auth UI theo Bảng ca + logo kit; giữ nguyên flow Firebase (đăng nhập, đăng ký, xác thực email, quick login, quên mật khẩu). Không đụng shell/màn khác.

**Blocked by:** 06 (commit `dee5691`/`9090f7a`).

Status: resolved

## Audit hiện tại

- `login.tsx` 328 dòng: card `max-w-md`, `LoginHeader` dùng `logo_text.png`, footer "Made with ❤ by MOB".
- `AuthForm` 284 dòng: input tự viết, `ValidationError`, icon User/Lock/Eye; flow sign in/sign up.
- `QuickLoginView` 164 dòng: avatar `/avatar.png`, mật khẩu, đổi/xóa tài khoản lưu.
- `VerificationView` 81 dòng: email xác thực, gửi lại, kiểm tra, quay lại.
- `ForgotPasswordModal` 82 dòng: input tự viết, toast.
- `LoginIllustration` + `MonkeyAvatar` + CSS: dead code, không import; `logo_text.png` chỉ còn login/illustration; `background.png` không thấy dùng.
- Logic validation/Firebase nằm trong `login.tsx`; phải giữ nguyên.

## Thiết kế

### Desktop ≥1024

- Split 46/54, full height. Trái: panel `brand` teal, lockup white, headline **"Ca làm rõ ràng. Lương minh bạch."**, 3 dòng lợi ích ngắn (xếp ca, chốt công, thanh toán), credit MOB nhỏ. Không mascot/illustration.
- Phải: form trên `canvas`, cột `max-w-md`, không card/shadow; theme toggle ở góc; title + subline; fields; submit; link đổi mode.
- Sign up dài hơn vẫn nằm trong cột; nếu viewport thấp thì cuộn dọc (chuẩn C đã chốt, không ép một màn).

### Mobile

- Brand strip teal phía trên (lockup white, headline ngắn) + form trên canvas; sign up cuộn dọc; không bottom nav/shell.

### States

- Sign in / sign up: Field + Input (44px, label, hint/error inline).
- Password visibility: trailing icon button 44px, aria label; remember; quên mật khẩu mở Modal.
- Auth error: một summary `role="alert"` phía trên form; không toast trùng cùng lỗi.
- Quick login: account row (ảnh hoặc initials), mật khẩu, "Đăng nhập tài khoản khác", "Xóa tài khoản đã lưu".
- Verification: email, 2 bước ngắn, "Tôi đã xác thực", "Gửi lại email", "Quay lại đăng nhập".
- Forgot: Modal + Field/Input, lỗi inline; success toast.
- Loading: Button loading + aria-busy; không đổi flow.

## Copy (UX writing standard)

- Title: "Đăng nhập", "Tạo tài khoản", "Xác thực email", "Đặt lại mật khẩu".
- Subline: "Tiếp tục vào bảng ca của bạn.", "Bắt đầu quản lý ca làm và lương."
- Links: "Chưa có tài khoản? Tạo tài khoản", "Đã có tài khoản? Đăng nhập", "Quên mật khẩu?"
- Lỗi: "Email không hợp lệ.", "Mật khẩu phải có ít nhất 6 ký tự.", "Mật khẩu không khớp.", "Email hoặc mật khẩu không đúng.", "Tài khoản chưa xác thực email."
- Bỏ exclamation ("Xin chào!" → "Xin chào"); câu ngắn, sentence case; CTA khớp hành động.

## File dự kiến

- `src/app/routes/login.tsx` — layout mới, giữ logic.
- `src/features/auth/components/login/LoginLayout.tsx` (mới): brand panel + form column + theme toggle.
- `AuthForm.tsx`, `QuickLoginView.tsx`, `VerificationView.tsx` — rewrite bằng Field/Input/Button/Checkbox/Modal.
- `src/features/auth/components/ForgotPasswordModal.tsx` — Field/Input, error inline.
- `src/components/ui/Input.tsx` — thêm optional leading icon/trailing action (hoặc PasswordInput feature component; chọn cách ít đụng primitive nhất).
- Xóa `LoginIllustration.tsx`, `MonkeyAvatar.tsx` + CSS, `LoginHeader.tsx`, `ValidationError.tsx` sau khi thay.
- Xóa `public/logo_text.png`/`background.png` nếu hết dùng; giữ `avatar.png` (AccountSection + quick fallback) và `/brand/lockup-white.svg`.
- Không sửa: shell, dashboard, tokens, Firebase, routes.

## Verify (static)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: diff `login.tsx` chỉ đổi UI/import, logic auth giữ nguyên; không còn `logo_text`/Monkey/LoginIllustration/ValidationError; không có input tự style ngoài primitive (trừ field đặc biệt).
- Không browser test/screenshot theo yêu cầu. Login không nằm sau auth nhưng vẫn chỉ kiểm static; user tự mở `/` để xem.
- Giới hạn: không có test suite; Firebase flows không test được static; chỉ code review.

## Trạng thái nhánh

- Dashboard committed `dee5691`/`9090f7a`; `src/` sạch. Ticket 07 chưa sửa code.


## Kết quả triển khai

2026-10-30 — Login Bảng ca implemented; static only theo yêu cầu.

- Desktop split 46/54: panel brand teal, white lockup, headline, 3 lợi ích, credit MOB; form column canvas, theme toggle, max-w-md, không card.
- Mobile: brand strip + form; theme on-brand; sign up cuộn dọc.
- AuthForm/Quick/Verification/Forgot dùng Field/Input/Button/Checkbox/Modal; Input thêm leadingIcon/trailingAction; password toggle 44px.
- Giữ logic Firebase/validation; bỏ toast trùng lỗi auth (chỉ summary `role=alert`); unverified chuyển VerificationView, không toast; copy chuẩn hóa.
- Xóa LoginHeader/LoginIllustration/MonkeyAvatar/ValidationError; xóa `logo_text.png`, `background.png`; sw cache bỏ 2 asset; giữ `avatar.png` (settings).
- Auth logic diff chỉ ở UI/error/toast; không đổi persistence, signup verification, saved user flow.

## Static verify

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check` pass.
- `rg` sạch LoginHeader/LoginIllustration/MonkeyAvatar/ValidationError/logo_text/background; login chỉ còn 4 component mới + Forgot.
- Không browser test/screenshot theo yêu cầu; login mở được ở `/` nhưng chỉ kiểm static; Firebase flows chưa test runtime.

## Giới hạn

- Không test auth thật (login/signup/reset/verify) vì static; logic giữ nguyên nhưng cần user kiểm khi chạy.
- `avatar.png` vẫn còn cho AccountSection; login quick dùng initials.
