# 10: Nhân sự — Sổ nhân sự

**What to build:** Rebuild màn Nhân sự theo hướng Bảng ca: sổ nhân sự dạng dòng, tìm/sắp xếp rõ nghĩa, form hồ sơ + ngân hàng có kiểm tra, chi tiết gọn. Giữ nguyên dữ liệu, service, upload/crop ảnh, VietQR và quy tắc chặn xóa.

**Blocked by:** 09 (commit `803df8d`).

Status: resolved

## Audit hiện tại

- `employees.tsx` 250 dòng; nhận prop `events` nhưng không dùng; header nằm trong `EmployeeToolbar` với h1 là số nhân viên, CTA "Thêm mới".
- `shiftCountByEmployee` đếm **ca unpaid của tháng hiện tại** nhưng card chỉ hiện số trần cạnh icon cặp; sort "Nhiều công" không nêu phạm vi; dùng chữ "công".
- Tháng hiện tại và ngày hôm nay tính bằng `new Date()`/`toISOString()` UTC → có thể lệch ngày ở VN.
- Card grid vuông 2–5 cột, ảnh lớn, nút sửa/xóa 40px, overlay toàn card; badge ngân hàng chỉ nói "Ngân hàng" + chấm màu — **không nói trạng thái bằng chữ**.
- List còn `framer-motion`; empty tự viết "Chưa có nhân viên nào"/"Không tìm thấy nhân viên nào"; không dùng `EmptyState`.
- Toolbar: search placeholder "Nhập từ khóa tìm kiếm" (tìm cả tên/SĐT), sort không nhãn, cao 40px; add disabled khi loading.
- Xóa: dialog chung "Bạn có chắc muốn xóa nhân viên này?", không nêu tên; lỗi chặn xóa mở dialog "Không thể xóa" nhưng không nêu tên nhân viên; reason dùng "công"; toast không dấu câu. Quy tắc: chặn nếu còn ca unpaid bất kỳ, hoặc ca có ngày ≥ hôm nay.
- Detail: title "Hồ sơ nhân viên" + h3 tên lặp; phone link 40px; ngày tham gia, BankCard; không có xóa.
- Form: input/textarea tự viết 40px; lỗi gom một khối; không có trạng thái đang lưu/chặn double submit; effect khởi tạo; không chặn trùng SĐT; label ngân hàng không gắn Dropdown; bank cũ không còn trong list sẽ hiện placeholder; "Làm mới" thực chất xóa thông tin ngân hàng.
- BankCard là card tín dụng thu nhỏ; thông tin đầy đủ nhưng style lệch Bảng ca.
- Form tự gọi service + toast; route không quản lý submit. Giữ hướng này để không đổi kiến trúc.

## Sự thật dữ liệu

- `Employee`: `name`, `phone`, `imageUrl?`, `bankAccount?`, `createdAt`, `userId`. Không có chức danh, lương/giờ, email.
- `BankAccount`: `bankId` (BIN), `bankName`, `accountNumber`, `accountName`.
- SĐT optional; form hiện yêu cầu 9–11 chữ số nếu có.
- Không có unique index; dữ liệu có thể trùng tên/SĐT. Có thể chặn trùng SĐT ở UI.
- VietQR `getBankList` có fallback banks; `validateBankAccount` kiểm tra 6–20 số và tên ≥3 ký tự.
- Xóa nhân viên không cascade; shift cũ giữ `employeeName` denormalized. Quy tắc chặn xóa bảo vệ ca unpaid/sắp tới.
- Số “ca chưa trả” = shift `status === 'unpaid'` trong **tháng hiện tại**; phạm vi phải nói rõ.
- Không truyền shifts cho detail; không thêm lịch sử ca ngoài phạm vi.

## Quyết định thiết kế

### Desktop ≥1024

- Container `max-w-[1400px] px-6 py-6` như các màn đã rebuild.
- Header: eyebrow mono `Tháng 10 · 12 nhân viên · 3 chưa có tài khoản`; h1 **Sổ nhân sự**; CTA primary `Thêm nhân viên`.
- Toolbar: search có nhãn `Tìm kiếm`, placeholder `Tên hoặc số điện thoại`; sort có nhãn `Sắp xếp` + Dropdown `Tên A–Z / Nhiều ca chưa trả / Mới nhất` (44px).
- Danh sách là surface dạng sổ:
  - Header row mono: `Nhân viên` / `Ngân hàng` / `Ca chưa trả` / thao tác.
  - Mỗi dòng: avatar 48px (ảnh hoặc initials), tên là nút mở chi tiết 44px, SĐT dưới tên (hoặc "Chưa có SĐT"); bank `Tag` **Đã có / Chưa có**; số ca chưa trả trong tháng dạng mono (`—` khi 0, `aria-label` "Không có ca chưa trả"); sửa/xóa 44px có nhãn.
  - 12 dòng/trang + `LoadMore`; bỏ motion.
- Mobile: xếp dọc (avatar + tên + actions, SĐT, bank tag, số ca); cùng surface.

### Chi tiết

- Modal title là tên nhân viên; bỏ h3 lặp.
- Avatar 96, SĐT dạng link `tel:` 44px nếu có, ngày tham gia mono.
- Khối ngân hàng: `Tag` trạng thái; BankCard phẳng (bank name, số tài khoản mono, chủ tài khoản); chưa có → khối gọn "Chưa có tài khoản ngân hàng" + giải thích.
- Footer `Sửa hồ sơ`. Không thêm lịch sử ca.

### Form thêm/sửa

- Conditional mount để reset state; giữ `ImageCropperModal` + upload ảnh hiện có.
- Dùng `Field`/`Input`/`Dropdown`/`Button`; control ≥44px; lỗi inline.
- Nhóm:
  1. **Thông tin**: ảnh đại diện 96px (chọn/đổi ảnh, giữ crop), Họ tên bắt buộc, Số điện thoại optional (9–11 số). Chặn trùng SĐT với nhân viên khác (bỏ qua khi để trống/sửa chính mình).
  2. **Ngân hàng (tùy chọn)**: Dropdown tìm kiếm; nếu bank cũ không còn trong list, thêm option fallback từ hồ sơ; Số tài khoản (6–20 số); Chủ tài khoản (viết hoa, hint không dấu); nút `Xóa thông tin ngân hàng` 44px khi có dữ liệu. Điền thiếu → lỗi "Điền đủ ngân hàng, số tài khoản và chủ tài khoản hoặc để trống."; validate qua `vietQRService`.
  - Bank list đang tải: Dropdown disabled + hint "Đang tải danh sách ngân hàng…"; service có fallback nên không chặn lưu.
- Nút Lưu có loading, chặn double submit, khóa khi không có thay đổi + hint; form mới hint khi thiếu tên. Lỗi lưu dùng toast chung, không show message kỹ thuật.

### Xóa

- Giữ quy tắc chặn: còn ca unpaid bất kỳ, hoặc ca từ hôm nay trở đi. Dùng ngày local (`toDateKey`), không UTC.
- Nếu chặn: dialog `Không thể xóa nhân viên` nêu tên + lý do `N ca chưa thanh toán` / `N ca từ hôm nay trở đi`; CTA `Đã hiểu`.
- Nếu được xóa: dialog `Xóa nhân viên?` nêu tên; ghi rõ hồ sơ bị xóa nhưng ca cũ trong sổ lương vẫn giữ tên; CTA `Xóa nhân viên`, loading.
- Không cascade.

## States

- Loading: skeleton header + 8 dòng sổ.
- Chưa có nhân viên: `EmptyState` "Chưa có nhân viên" + "Thêm nhân viên để bắt đầu xếp ca."; không CTA (header đã có).
- Tìm không ra: `EmptyState` "Không tìm thấy nhân viên" + "Thử tên hoặc số điện thoại khác."; action `Xóa tìm kiếm` nếu có từ khóa.
- Ảnh lỗi: initials; upload lỗi: toast, giữ ảnh cũ; bank list lỗi: fallback; validate bank lỗi: inline.
- Lưu/xóa lỗi: toast, giữ form/dialog.

## Copy

- H1 `Sổ nhân sự`; eyebrow tháng + tổng + số chưa có tài khoản (ẩn phần 0).
- CTA `Thêm nhân viên`; search `Tên hoặc số điện thoại`; sort `Nhiều ca chưa trả`.
- Cột `Ca chưa trả` (phạm vi tháng ở eyebrow); zero hiển thị `—`, aria "Không có ca chưa trả".
- Bank tag `Đã có` / `Chưa có`; detail `Đã có tài khoản` / `Chưa có tài khoản`.
- Xóa: `Xóa nhân viên?` / "“X” sẽ bị xóa khỏi sổ. Các ca cũ vẫn giữ tên trong sổ lương." / `Xóa nhân viên`.
- Chặn xóa: "Không thể xóa nhân viên" / "“X” còn 3 ca chưa thanh toán." hoặc "“X” đang có 2 ca từ hôm nay trở đi."
- Lỗi form: "Nhập họ tên.", "Số điện thoại phải có 9–11 chữ số.", "Số điện thoại này đã có trong sổ.", "Điền đủ ngân hàng, số tài khoản và chủ tài khoản hoặc để trống."
- Toast: "Đã thêm nhân viên.", "Đã cập nhật nhân viên.", "Đã xóa nhân viên.", "Không thể lưu nhân viên. Thử lại.", "Không thể xóa nhân viên. Thử lại."
- Bỏ "công", "Thêm mới", "Làm mới", "Click để thay đổi ảnh"; dùng "ca", "Thêm nhân viên", "Xóa thông tin ngân hàng", "Nhấn để đổi ảnh".

## File dự kiến

- `src/app/routes/employees.tsx` — rewrite state/layout/dialog; bỏ prop `events`; tính tháng/ngày local.
- `components/EmployeeToolbar.tsx` — header + search/sort có nhãn (hoặc tách header ra route).
- `components/EmployeeList.tsx` — sổ dòng, empty/loading/load more.
- `components/EmployeeCard.tsx` → `EmployeeRow.tsx` (avatar 48, bank tag, ca chưa trả, actions 44).
- `components/EmployeeDetailModal.tsx` — rewrite.
- `components/EmployeeFormModal.tsx` — rewrite form/validation/saving; giữ upload/crop/VietQR.
- `components/BankCard.tsx` — restyle phẳng, mono số tài khoản.
- `src/app/app.tsx` — bỏ prop `events` của EmployeeView.
- Không sửa service, schema, Firebase, màn khác.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: không raw input/textarea trong form; không div click; icon-only 44px; không motion; không "công"; empty state dùng chung; ngày local; bank status bằng chữ; duplicate phone; count scope đúng; delete dialogs có tên.
- Không browser test/screenshot; không test runtime Firebase/Storage/VietQR. Giới hạn: chưa có test suite, chưa kiểm visual.

## Điểm cần bạn chốt (kèm đề xuất)

1. Bỏ card ảnh vuông, chuyển sổ dòng với avatar 48px? **Đề xuất: có.**
2. Tiêu đề trang **Sổ nhân sự** (nav vẫn `Nhân sự`)? **Đề xuất: có.**
3. “Ca chưa trả” giữ phạm vi **tháng hiện tại**, ghi ở eyebrow; sort đổi thành `Nhiều ca chưa trả`? **Đề xuất: có.**
4. Chặn trùng số điện thoại ở UI? **Đề xuất: có** (bỏ trống vẫn hợp lệ).
5. Giữ quy tắc chặn xóa hiện tại, chỉ sửa copy + dùng ngày local + không cascade? **Đề xuất: có.**

## Kết quả triển khai

2026-10-31 — Sổ nhân sự implemented; static only theo yêu cầu.

- Header `Sổ nhân sự`, eyebrow `Tháng N · N nhân viên · N chưa có tài khoản` (ẩn phần 0), CTA `Thêm nhân viên`; bỏ `events` prop và header cũ trong toolbar.
- Toolbar có nhãn Tìm kiếm / Sắp xếp; search theo tên/SĐT; sort `Tên A–Z / Nhiều ca chưa trả / Mới nhất`.
- Danh sách chuyển sang surface sổ dòng: avatar 48, tên/SĐT, bank `Tag` Đã có/Chưa có, ca chưa trả tháng hiện tại (`—` khi 0), sửa/xóa 44px; mobile xếp dọc có nhãn Ngân hàng/Ca chưa trả; 12 dòng/trang.
- Tháng và hôm nay dùng ngày local (`toDateKey`), bỏ lỗi UTC.
- Xóa: chặn theo ca unpaid bất kỳ hoặc ca từ hôm nay trở đi; dialog chặn nêu tên + lý do, dialog xác nhận nêu tên + cảnh báo ca cũ vẫn giữ tên; toast có dấu câu; không cascade.
- Chi tiết: title là tên, avatar 96, SĐT link 44px, ngày tham gia, bank tag + BankCard phẳng; footer `Sửa hồ sơ`.
- Form: Field/Input/Dropdown, lỗi inline, chặn trùng SĐT khi tạo/đổi, validate bank all-or-none qua VietQR; bank cũ fallback option; reset đổi thành `Xóa thông tin ngân hàng`; nút lưu có loading + khóa khi không đổi/thiếu tên; giữ upload/crop ảnh.
- Xóa `EmployeeCard.tsx`; thêm `EmployeeRow.tsx`; BankCard restyle; bỏ motion/raw input.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: không còn "công", "Thêm mới", "Làm mới", motion, EmployeeCard; chỉ còn input file ẩn; icon-only 44px; empty state dùng chung; bank/count có nhãn ở mobile; ngày local; count scope tháng.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa kiểm visual 375/768/1024/1440 và chưa test Firebase Storage/upload/crop/VietQR runtime.

## Comments

2026-10-31 — Review nhánh độc lập: chặn xóa nhân viên còn ca `advanced` chưa quyết toán (trước đó chỉ chặn `unpaid` và ca từ hôm nay), tránh mất lịch sử ứng lương.
- Không có test suite.
- Unique SĐT chỉ ở UI, không có ràng buộc server; dữ liệu cũ có thể đã trùng.
- Không có thao tác xóa ảnh đại diện (giữ nguyên hành vi cũ).
- Danh sách ngân hàng phụ thuộc VietQR và fallback; nếu fallback thiếu bank cũ, option cũ vẫn được giữ từ hồ sơ.
- Không thêm lịch sử ca vào chi tiết; màn vẫn chỉ là hồ sơ + ngân hàng.

## Trạng thái nhánh

- `HEAD` `803df8d`; ticket 10 đã sửa `src`, chưa commit.
