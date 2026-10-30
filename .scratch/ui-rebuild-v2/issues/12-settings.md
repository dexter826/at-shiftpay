# 12: Cài đặt — Tài khoản, công việc, giao diện

**What to build:** Rebuild màn Cài đặt theo hướng Bảng ca: header rõ, các nhóm Tài khoản / Công việc / Giao diện / Phiên / Vùng nguy hiểm; form dùng primitive; theme 3 lựa chọn; đổi mật khẩu và xóa tài khoản có kiểm tra. Giữ nguyên auth/Firebase, settings service và luồng xóa dữ liệu.

**Blocked by:** 11 (commit `e20f8aa`).

Status: resolved

## Audit hiện tại

- `settings.tsx` 71 dòng: không có h1/eyebrow, container không giới hạn bề rộng; các khối card rời; theme chỉ có switch Sáng/Tối, **không có "Theo hệ thống"** dù store đã hỗ trợ.
- `AccountSection` 256 dòng: avatar fallback `/avatar.png` (asset cũ); sửa tên bằng input raw, nút 40px; `updateProfile` xong **không cập nhật auth store** nên tên trên Navbar có thể cũ; xóa tài khoản nằm lẫn trong nhóm tài khoản.
- `WorkConfigSection` 149 dòng: input số raw 40px, không chặn số âm/không phải số; action bar chỉ hiện khi đổi và dùng motion chiều cao; so sánh JSON; lưu không có validation.
- `ChangePasswordModal` (auth): input raw 40px, placeholder mật khẩu dạng chỉ dẫn (trái chuẩn placeholder đã chốt), lỗi gom một khối, success tự đóng sau 2s.
- `DeleteAccountModal`: input raw 40px, placeholder mật khẩu, so khớp chính xác từng ký tự "XÓA TÀI KHOẢN" (không trim), lỗi chỉ toast, copy có "!".
- Theme store có `'system' | 'light' | 'dark'`; Navbar toggle nhanh ghi đè light/dark; Settings chưa cho quay lại system.
- SW cache còn `/avatar.png`; asset chỉ còn dùng ở AccountSection.
- `updateProfile`/`updatePassword`/`deleteUser` dùng trực tiếp Firebase; delete data gồm settings + employees/locations/events/shifts/payments.

## Sự thật dữ liệu

- `UserSettings`: `shiftRate`, `morningTime` (`HH:mm`), `afternoonTime`, `userId`; mặc định 250.000đ, 07:30, 13:30.
- `updateSettings` merge document settings; không đổi schema.
- Tài khoản: `displayName`, `email`, `photoURL` từ Firebase Auth; email không đổi trong màn này.
- Upload avatar đi qua `ImageCropperModal` + `imageService`; giới hạn 5MB, file ảnh.
- Đổi/xóa tài khoản cần reauthenticate bằng mật khẩu; `requires-recent-login` có thể xảy ra.
- Xóa tài khoản: xóa settings + 5 collection theo `userId`, sau đó `deleteUser`; **không xóa file ảnh trên Storage**; nếu bước xóa Auth lỗi sau khi đã xóa data, dữ liệu đã mất (hành vi hiện tại).
- Theme lưu localStorage; `system` theo media query, có listener.
- Không có version app/legal trong dữ liệu.

## Quyết định thiết kế

### Trang

- Container `max-w-3xl` (cài đặt không cần full 1400), `px-4 py-5 md:px-6 md:py-6`.
- Header: eyebrow mono email; h1 **Cài đặt**.
- Các section theo thứ tự:
  1. `Tài khoản` — hồ sơ, đổi mật khẩu.
  2. `Cấu hình công việc` — lương/ca, giờ sáng/chiều.
  3. `Giao diện` — Theo hệ thống / Sáng / Tối.
  4. `Phiên đăng nhập` — Đăng xuất.
  5. `Vùng nguy hiểm` — Xóa tài khoản.
- Mỗi section: nhãn mono + surface border, dòng kẻ; không card nổi/shadow; 44px.

### Tài khoản

- Avatar 72px (ảnh hoặc initials), bấm để đổi ảnh; giữ upload/crop 5MB; loading overlay.
- Tên hiển thị + email. Sửa tên inline bằng `Field`/`Input`, Save/Cancel 44px; lỗi "Nhập tên hiển thị."; lưu xong cập nhật Firebase **và** auth store/Navbar.
- Dòng `Đổi mật khẩu` mở modal; dòng `Xóa tài khoản` chuyển sang Vùng nguy hiểm.
- Fallback avatar bằng initials; bỏ `/avatar.png` nếu hết tham chiếu và xóa khỏi SW cache.

### Cấu hình công việc

- `Lương mỗi ca` — Input số, min 0, step 1000, hint VND, ví dụ `250000`; hiển thị preview `formatCurrency`.
- `Giờ bắt đầu ca sáng` / `ca chiều` — TimePicker, 44px, aria label.
- Action bar luôn hiển thị: `Hủy` + `Lưu thay đổi`; lưu disabled khi không đổi/đang lưu; hint "Chưa có thay đổi để lưu."; bỏ motion.
- Validate lương là số nguyên ≥0; lưu thành công toast; lỗi toast giữ form.

### Giao diện

- Segmented 3 lựa chọn 44px: `Theo hệ thống` (Monitor), `Sáng` (Sun), `Tối` (Moon); `aria-pressed`; đọc `theme` preference từ store và `setTheme`.
- Mô tả: "Theo hệ thống sẽ đổi theo cài đặt thiết bị."; hiển thị theme đang áp dụng nếu là system (Sáng/Tối).
- Navbar toggle nhanh vẫn giữ nguyên (đặt light/dark); Settings là nơi quay lại system.

### Đổi mật khẩu

- Rewrite `ChangePasswordModal` bằng `Field`/`Input`, nút hiện/ẩn 44px; **không placeholder mật khẩu**; hint "Ít nhất 6 ký tự.".
- Validate hiện tại/mới/xác nhận, lỗi inline/summary ngắn; map lỗi Firebase; submit footer qua form id.
- Thành công: toast + đóng ngay (bỏ tự đóng 2s); loading chặn double.

### Xóa tài khoản

- Trigger nằm trong section `Vùng nguy hiểm` (đỏ, tách khỏi tài khoản).
- Modal: cảnh báo không thể hoàn tác (sentence case, bỏ "!"); nêu rõ xóa nhân viên, địa điểm, sự kiện, ca, thanh toán và settings; không xóa file ảnh Storage.
- Xác nhận: nhập `XÓA TÀI KHOẢN` (tự uppercase + trim) và mật khẩu hiện tại (Input password 44, có hiện/ẩn); lỗi inline từ mã Firebase; CTA `Xóa tài khoản` loading.
- Giữ thứ tự reauth → xóa data → `deleteUser`; clear saved user; giới hạn lỗi giữa chừng ghi trong ticket.

## States

- Loading upload/name/password/delete: spinner trong nút/avatar, disable liên quan.
- Không có thay đổi công việc: nút lưu disabled + hint.
- Theme system: hiển thị resolved Sáng/Tối.
- Lỗi auth: inline theo mã; lỗi lưu settings: toast.
- Avatar lỗi ảnh: initials; xóa tài khoản thành công: app về login qua auth state.
- Không có trạng thái empty đặc biệt.

## Copy

- H1 `Cài đặt`; section `Tài khoản`, `Cấu hình công việc`, `Giao diện`, `Phiên đăng nhập`, `Vùng nguy hiểm`.
- Theme `Theo hệ thống` / `Sáng` / `Tối`.
- Công việc `Lương mỗi ca`, `Giờ bắt đầu ca sáng`, `Giờ bắt đầu ca chiều`, `Lưu thay đổi`, `Hủy`.
- Password `Mật khẩu hiện tại`, `Mật khẩu mới`, `Xác nhận mật khẩu mới`; lỗi: "Nhập mật khẩu hiện tại.", "Mật khẩu mới phải có ít nhất 6 ký tự.", "Mật khẩu xác nhận không khớp.", "Mật khẩu hiện tại không đúng.", "Không thể đổi mật khẩu. Thử lại."
- Delete: "Xóa tài khoản?" / "Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn. Không thể hoàn tác." / "Gõ XÓA TÀI KHOẢN để xác nhận." / CTA `Xóa tài khoản`.
- Toast sentence case, có dấu câu; bỏ "Click để thay đổi ảnh" → "Nhấn để đổi ảnh".

## File dự kiến

- `src/app/routes/settings.tsx` — rewrite header/layout/theme/session/danger; giữ onLogout.
- `components/AccountSection.tsx` — rewrite profile/password; bỏ delete; fallback initials; cập nhật auth store khi đổi tên/ảnh.
- `components/WorkConfigSection.tsx` — rewrite fields/action bar/validation; bỏ motion.
- `components/DeleteAccountModal.tsx` — rewrite form/inline errors/copy.
- `src/features/auth/components/ChangePasswordModal.tsx` — rewrite bằng primitive (chỉ Settings dùng).
- `public/sw.js` — bỏ `/avatar.png` nếu asset bị xóa.
- `public/avatar.png` — xóa sau khi hết tham chiếu.
- Không sửa settingsService, schema, auth logic, màn khác.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: không raw input/textarea (trừ file ẩn avatar), không motion, 44px, placeholder đúng chuẩn, theme 3 lựa chọn, không còn `/avatar.png`, name update store, delete modal copy/inline error, save disabled khi không đổi.
- Không browser test/screenshot; không test Firebase auth/upload/delete runtime. Giới hạn: chưa có test suite, chưa kiểm visual.

## Điểm cần bạn chốt (kèm đề xuất)

1. Thêm lựa chọn **Theo hệ thống** cho theme trong Settings (3 lựa chọn)? **Đề xuất: có** (store đã hỗ trợ).
2. Tách xóa tài khoản sang section **Vùng nguy hiểm**? **Đề xuất: có.**
3. Fallback avatar bằng initials và xóa `avatar.png`/SW cache? **Đề xuất: có.**
4. Rewrite luôn `ChangePasswordModal` trong ticket này? **Đề xuất: có** (màn Settings là nơi duy nhất dùng).
5. Action bar công việc luôn hiện, nút lưu disabled khi không đổi (thay vì trượt ra bằng motion)? **Đề xuất: có.**
6. Xác nhận xóa chấp nhận chữ thường/khoảng trắng bằng cách tự uppercase + trim? **Đề xuất: có** (vẫn yêu cầu gõ đúng cụm từ).

## Trạng thái nhánh

- `HEAD` `e20f8aa`; ticket 12 đã sửa `src`, chưa commit.

## Kết quả triển khai

2026-10-31 — Cài đặt implemented; static only theo yêu cầu.

- Header `Cài đặt` + email, container `max-w-3xl`; sections mono `Tài khoản / Cấu hình công việc / Giao diện / Phiên đăng nhập / Vùng nguy hiểm`.
- Account: avatar 72 fallback initials (bỏ `/avatar.png`), upload/crop 5MB giữ nguyên; sửa tên inline bằng Input + Save/Cancel 44px; cập nhật auth store snapshot để Navbar đổi tên, cập nhật saved user nếu có; đổi mật khẩu ở dòng riêng.
- Work config: Input số + preview currency, TimePicker sáng/chiều có aria label; action bar luôn hiện, lưu disabled khi không đổi; bỏ motion; validate/clamp lương.
- Theme: segmented `Theo hệ thống / Sáng / Tối` 44px, `aria-pressed`; hiển thị resolved theme khi system; Navbar toggle giữ nguyên.
- ChangePasswordModal: Field/Input, hiện/ẩn 44px, không placeholder mật khẩu, lỗi inline/summary, submit footer, toast + đóng ngay.
- DeleteAccountModal: Field/Input, xác nhận tự uppercase + trim, lỗi cụm từ/mật khẩu inline, copy không "!", cảnh báo không xóa file Storage; vẫn reauth → xóa data → delete user.
- Vùng nguy hiểm tách khỏi tài khoản; logout vẫn mở confirm của shell.
- SW cache bỏ `/avatar.png`; xóa `public/avatar.png`.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: không `/avatar.png`, không motion trong settings, raw input chỉ còn file ẩn/hidden username, control 44px, theme đủ 3 lựa chọn, placeholder mật khẩu đã bỏ, lỗi xóa inline.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa test runtime Firebase Auth/Storage/upload/delete.
- Không có test suite.
- Xóa tài khoản xóa data trước rồi mới xóa Auth user; nếu bước Auth lỗi sau khi data đã xóa, dữ liệu đã mất (giữ hành vi cũ).
- File ảnh trên Storage không được xóa tự động.
- Không đổi email; không có version app/legal.
- Snapshot auth store khi đổi tên/ảnh là bản sao User để Navbar cập nhật ngay; các field dùng trong app đều còn, method Firebase vẫn lấy từ `auth.currentUser`.
