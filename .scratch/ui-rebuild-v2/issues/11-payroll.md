# 11: Thanh toán — Sổ lương

**What to build:** Rebuild màn Thanh toán theo hướng Bảng ca: KPI công nợ, tab Công nợ / Lịch sử, sổ lương dạng dòng, chi tiết nhân viên, modal chi trả/ứng và quyết toán, lịch sử giao dịch. Giữ nguyên dữ liệu, service (trừ fix quyết toán bên dưới) và export hiện có.

**Blocked by:** 10 (commit `fce863e`).

Status: resolved

## Audit hiện tại

- Route 365 dòng, không có h1/CTA export; stats card đứng đầu; tabs tự viết 40px; còn div rỗng, comment chết, `setShowPaymentModal(false)` lặp 2 lần, preload avatar thủ công.
- `PayrollStats` dùng motion/AnimatePresence từng ô; nhãn **"Tổng đã làm"** thực chất = unpaid + advanced (chưa gồm ca đã trả) → sai nghĩa; dòng `(+ X phụ phí)` gợi ý cộng thêm nhưng phụ phí đã nằm trong `shift.amount`.
- Payroll tab không lọc tháng: là **công nợ hiện tại toàn bộ**, nhưng không nêu phạm vi.
- Bấm dòng nhân viên: nếu có ca chưa trả và **không** có ca đã ứng thì mở thẳng PaymentModal; nếu có ứng thì mở chi tiết → hành vi không nhất quán.
- `PayrollList`/`HistoryList` card + motion; chữ "công"; empty tự viết, không phân biệt không có dữ liệu với tìm không ra; history loading trả về div rỗng.
- `usePayrollData`: search tên/SĐT nhưng placeholder "Nhập tên nhân viên"; sort "Số tiền cao"/"Nhiều công" không nêu cơ sở, control 40px.
- PaymentModal 451 dòng: raw row/checkbox, nút chọn tất cả 40px; tiêu đề "Thanh toán lương" cả khi ứng; mô tả "Nguồn tiền tiệc/cá nhân"; QR content "CONG"; effect tạo QR không chống kết quả cũ; action nằm cuối body thay vì footer.
- SettlementModal: **lỗi chặn quyết toán** — `settleableShifts` gồm `advanced | unpaid`, nhưng `paymentService.settleAdvancePayment` yêu cầu **mọi** shift phải `advanced`; nhân viên có ca chưa trả sẽ luôn báo "Ca làm không còn ở trạng thái ứng lương".
- Settlement hiển thị "Số tiền cần trả thêm" nhưng balance có thể âm (ứng vượt lương); copy "gạch nợ tất cả khoản ứng và xác nhận thanh toán các ca hiện tại" khớp ý định gộp, nhưng service chưa cho phép shift unpaid.
- History: subscription chỉ từ 12 tháng trước nhưng nút lọc ghi **"Tất cả thời gian"**; "Đang hiển thị N" luôn kèm nút tải thêm; date/time card list.
- TransactionDetail: title chung, không nêu nhân viên; "Tiệc Sáng/Chiều".
- Month picker/export modal còn nút 40px; export chưa có CTA ở màn Thanh toán dù modal đã có trong shell.
- Nhiều chỗ dùng "công"; "Tiệc sáng/chiều" lẫn "Ca sáng/chiều".

## Sự thật dữ liệu (đã audit)

- `Shift.status`: `unpaid` (chưa trả), `advanced` (đã ứng), `paid` (đã trả). Payroll summary chỉ gồm **unpaid + advanced**; không gồm paid.
- `PaymentTransaction.type`: `regular | advance | settlement`; dữ liệu cũ có thể thiếu type → hiểu là regular.
- Regular: ca chọn → `paid`; advance: ca chọn → `advanced`; settlement: đánh dấu advance đã chốt + shift → `paid`.
- `shift.amount` đã gồm lương + phụ phí; `totalFees` chỉ để giải thích thành phần, không cộng thêm.
- Payroll tab là công nợ hiện tại toàn bộ thời gian; history mới có lọc tháng.
- History subscription bắt đầu từ đầu tháng cách đây 11 tháng (cửa sổ 12 tháng); chọn tháng cũ hơn sẽ mở rộng; "Tải thêm" lùi 12 tháng.
- Settlement balance = (unpaid + advanced) − tổng advance chưa chốt; có thể 0 hoặc âm.
- QR cần `bankAccount`; không có ngân hàng vẫn có thể chi tiền mặt nhưng không tạo QR.
- Không có sửa/xóa giao dịch; lịch sử chỉ đọc.
- Export dùng modal/service sẵn có ở shell, chưa nối vào màn Thanh toán.
- Không có trường lương/giờ; mọi tính toán từ `shift.amount` qua `payrollMath`.

## Quyết định thiết kế

### Header + KPI

- Container `max-w-[1400px] px-6 py-6`.
- Header: eyebrow mono `Công nợ hiện tại · N nhân viên`; h1 **Sổ lương**; CTA `Xuất báo cáo` mở ExportModal hiện có.
- KPI strip 3 ô (border trên 2px, không card):
  1. `Chưa thanh toán` — tổng unpaid; note `N ca`, highlight `warning` khi >0.
  2. `Đã ứng` — tổng advanced; note `N ca`.
  3. `Tổng lương chưa chốt` — unpaid + advanced; note `N ca` + `gồm X phụ phí` (không dấu +).
- Loading skeleton đúng 3 ô; mobile xếp dọc, desktop 3 cột; bỏ motion.

### Tabs + toolbar

- Dùng `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` (44px): `Công nợ` và `Lịch sử`.
- Công nợ: search nhãn `Tìm kiếm`, placeholder `Tên hoặc số điện thoại`; sort nhãn `Sắp xếp`: `Số tiền còn trả / Nhiều ca chưa trả / Tên A–Z`.
- Lịch sử: search nhãn `Tìm kiếm`, placeholder `Tên nhân viên`; nút lọc tháng 44px hiển thị phạm vi thực (`Từ tháng 11/2025` hoặc `Tháng 10/2026`), mở month picker.

### Sổ lương (tab Công nợ)

- Surface dạng sổ; header row mono: `Nhân viên` / `Chưa trả` / `Đã ứng` / thao tác.
- Mỗi dòng:
  - avatar 40, tên là nút mở chi tiết 44px; nếu thiếu ngân hàng hiện tag `Chưa có TK` để biết QR không khả dụng.
  - `Chưa trả`: số tiền (warning nếu >0) + `N ca`; 0 → `—` với aria-label.
  - `Đã ứng`: số tiền + `N ca`; 0 → `—`.
  - chevron/chi tiết; **bỏ auto-mở PaymentModal** — mọi dòng mở chi tiết, chi tiết có CTA chi trả/quyết toán.
- 12 dòng/trang + LoadMore; loading skeleton; empty dùng `EmptyState`:
  - không có công nợ: "Không có công nợ" + "Các ca đã trả sẽ nằm trong lịch sử.";
  - tìm không ra: "Không tìm thấy nhân viên" + action `Xóa tìm kiếm`.
- Mobile: dòng xếp dọc có nhãn Chưa trả/Đã ứng; actions 44px.

### Chi tiết nhân viên

- Modal title là tên nhân viên.
- Tóm tắt 3 dòng: `Còn phải trả` (unpaid), `Đã ứng` (advanced), `Tổng lương chưa chốt`; kèm số ca.
- Hai nhóm ca: `Ca chưa trả` và `Ca đã ứng` (hiện cả hai nếu có); mỗi dòng event, `Ca sáng/chiều`, ngày, địa điểm, số tiền.
- Footer: `Thanh toán / Ứng` khi còn unpaid; `Quyết toán` khi có advanced. Mở modal tương ứng và **đóng chi tiết** (không xếp 2 modal).
- Empty nhóm phù hợp; dùng `EmptyState` gọn.

### Modal chi trả (`Chi trả lương`)

- Conditional mount; Modal `size="lg"`; desktop 2 cột, mobile 1 cột; footer dính đáy.
- Trái: nhân viên + ngân hàng (hoặc cảnh báo "Chưa có tài khoản ngân hàng. Có thể thanh toán tiền mặt; QR không khả dụng."), chọn loại, danh sách ca.
- Phải: QR (nếu có bank), tổng đang chọn, tổng chưa trả/đã ứng.
- Loại:
  - `Thanh toán` — "Đánh dấu các ca đã chọn là đã trả."
  - `Ứng lương` — "Trả trước các ca đã chọn; quyết toán sau."
- Danh sách ca: `Checkbox` primitive, chọn tất cả 44px, mỗi dòng 44px; event, `Ca sáng/chiều`, ngày local, số tiền; selection mặc định tất cả ca unpaid; state nằm trong modal (bỏ selection khỏi route).
- QR: nội dung `THANH TOAN LUONG N CA` / `UNG LUONG N CA`; effect có cleanup chống kết quả cũ; lỗi có nút `Thử lại`.
- Footer: Hủy + CTA (`Thanh toán` / `Ứng lương`) loading; disabled khi 0 ca.
- Toast: "Đã thanh toán.", "Đã ứng lương.", lỗi "Không thể xử lý chi trả. Thử lại.".

### Quyết toán

- **Fix service (cần duyệt):** `settleAdvancePayment` chấp nhận shift `advanced` **hoặc** `unpaid` (thay vì chỉ advanced), vẫn đánh dấu tất cả `paid`; message lỗi đổi thành "Ca làm không còn ở trạng thái chờ quyết toán".
- Modal conditional mount; tiêu đề `Quyết toán ứng lương`.
- Tải khoản ứng chưa chốt: loading/error có `Thử lại`; summary `Khoản ứng chưa chốt` (số tiền + N lần), `Ca đã ứng` N, `Ca chưa trả` N, `Chênh lệch` (unpaid + advanced − advances).
- Nếu chênh lệch < 0: khối cảnh báo "Đã ứng vượt lương hiện có X. Cần thu hồi trước khi quyết toán." và **disable CTA**; không ghi giao dịch âm.
- Nếu ≥ 0: copy "Đánh dấu các khoản ứng đã chốt và toàn bộ ca đang mở là đã trả. Số tiền còn lại sẽ ghi vào lịch sử."; CTA `Quyết toán` loading.
- Không cascade, không đổi schema.

### Lịch sử

- Surface sổ dòng; header mono `Nhân viên` / `Loại` / `Thời gian` / `Số tiền`.
- Dòng: tên + loại `Tag` (`Thanh toán` / `Ứng lương` / `Quyết toán`), ngày giờ local, số tiền; click mở chi tiết giao dịch 44px.
- Scope thật: `Từ tháng 11/2025` (từ `paymentSince`) hoặc tháng đang lọc; nút `Tải thêm 12 tháng` khi mở rộng cửa sổ; không còn "Tất cả thời gian" sai.
- Loading skeleton; empty phân biệt: chưa có giao dịch trong khoảng / tháng lọc / tìm không ra; dùng `EmptyState`.
- Month picker: nút năm/tháng 44px, `aria-pressed`, footer `Bỏ lọc tháng`.
- Transaction detail: title `Giao dịch`, nêu nhân viên, loại, số tiền, thời gian, ghi chú, danh sách ca (`Ca sáng/chiều`); empty rõ "Không tìm thấy ca của giao dịch (có thể đã bị xóa).".

### Export

- Payroll header dùng `onOpenExport` hiện có từ app; không đổi logic export.
- Light a11y pass cho `ExportModal`: nút năm/tháng 44px, `onlyDebt` dùng `Checkbox`, footer loading; không đổi filter/service.

## Data rules

- Công nợ = shift `unpaid` + `advanced`, toàn bộ thời gian; không gồm `paid`.
- `totalFees` chỉ là thành phần đã nằm trong `shift.amount`; copy "gồm", không cộng.
- History window: 12 tháng gần nhất; lọc tháng cũ mở rộng `paymentSince`; tải thêm lùi 12 tháng.
- Ngày hiển thị dùng `parseDateOnly`/`formatDate` local, không `new Date('YYYY-MM-DD')` trực tiếp.
- Payment giữ transaction `runTransaction`; không đổi amount/status logic ngoài settlement validation.
- QR content không dấu, đơn vị `CA`; loại ứng dùng `UNG LUONG`.
- Không thêm/xóa giao dịch; không sửa lịch sử.

## Copy

- H1 `Sổ lương`; tabs `Công nợ` / `Lịch sử`; CTA `Xuất báo cáo`.
- KPI `Chưa thanh toán` / `Đã ứng` / `Tổng lương chưa chốt`; note `N ca`; `gồm X phụ phí`.
- Sort `Số tiền còn trả` / `Nhiều ca chưa trả` / `Tên A–Z`.
- "công" → "ca"; "Tiệc Sáng/Chiều" → "Ca sáng/chiều".
- Payment `Thanh toán` / `Ứng lương`; CTA tương ứng; QR `THANH TOAN LUONG N CA`.
- Settlement `Quyết toán ứng lương`, `Khoản ứng chưa chốt`, `Chênh lệch`; cảnh báo ứng vượt.
- History types `Thanh toán` / `Ứng lương` / `Quyết toán`; scope `Từ tháng M/YYYY`.
- Empty theo chuẩn; toast có dấu câu.

## File dự kiến

- `src/app/routes/payroll.tsx` — rewrite header/KPI/tabs/list flow, bỏ selection route, bỏ preload/comment chết.
- `components/PayrollStats.tsx` — KPI strip 3 ô.
- `components/PayrollFilters.tsx` — toolbar có nhãn, scope history.
- `components/PayrollList.tsx` — sổ dòng; bỏ auto-open payment/motion.
- `components/PayrollEmployeeDetailModal.tsx` — rewrite.
- `components/PaymentModal.tsx` — rewrite 2 cột, selection nội bộ, QR race, footer.
- `components/SettlementModal.tsx` — rewrite summary/retry/negative guard.
- `components/HistoryList.tsx` — sổ dòng, empty/loading.
- `components/TransactionDetailModal.tsx` — rewrite.
- `components/PayrollMonthPickerModal.tsx` — 44px + aria.
- `components/ExportModal.tsx` — light a11y pass.
- `lib/api/paymentService.ts` — settlement cho phép `advanced | unpaid` (nếu duyệt).
- `src/app/app.tsx` — truyền `onOpenExport` cho PayrollView.
- Không sửa schema, dashboard, màn khác, export service.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: không raw input/textarea/div click; không motion trong payroll; mọi nút 44px; tabs dùng primitive; "công"/"Tiệc Sáng" hết; KPI không gọi "Tổng đã làm"; history scope đúng; settlement truyền đúng loại shift; QR đơn vị CA; date local; empty state dùng chung.
- Không browser test/screenshot; không test runtime Firebase/VietQR/export. Giới hạn: chưa có test suite, chưa kiểm visual.

## Điểm cần bạn chốt (kèm đề xuất)

1. Đổi cấu trúc thành **Sổ lương**, tabs `Công nợ` / `Lịch sử`, KPI `Chưa thanh toán / Đã ứng / Tổng lương chưa chốt`? **Đề xuất: có.**
2. Bỏ auto-mở thanh toán khi bấm dòng; mọi dòng mở chi tiết, chi trả từ chi tiết? **Đề xuất: có.**
3. Fix `settleAdvancePayment` cho phép shift `advanced | unpaid`, chặn quyết toán khi chênh lệch âm? **Đề xuất: có** (đây là fix lỗi chặn quyết toán).
4. Thêm CTA `Xuất báo cáo` trên header dùng modal export hiện có? **Đề xuất: có.**
5. History hiển thị đúng phạm vi `Từ tháng M/YYYY` / `Tải thêm 12 tháng`, bỏ "Tất cả thời gian"? **Đề xuất: có.**
6. Công nợ vẫn là toàn bộ thời gian (không thêm lọc tháng cho tab Công nợ)? **Đề xuất: giữ** như hiện tại.

## Trạng thái nhánh

- `HEAD` `fce863e`; ticket 11 đã sửa `src`, chưa commit.

## Kết quả triển khai

2026-10-31 — Sổ lương implemented; static only theo yêu cầu.

- Header `Sổ lương` + `Công nợ hiện tại · N nhân viên`; CTA `Xuất báo cáo` nối `onOpenExport`; KPI 3 ô `Chưa thanh toán / Đã ứng / Tổng lương chưa chốt`, note `N ca`, `gồm phụ phí`.
- Tabs primitive `Công nợ / Lịch sử`; toolbar có nhãn search/sort; sort `Số tiền còn trả / Nhiều ca chưa trả / Tên A–Z`.
- Sổ công nợ dạng dòng: avatar, tên, SĐT, tag `Chưa có TK`, số tiền + số ca cho Chưa trả/Đã ứng (`—`/Không có khi 0); **bỏ auto-mở payment**, mọi dòng mở chi tiết; 12 dòng/trang; empty phân biệt không nợ/tìm không ra.
- Chi tiết nhân viên: tóm tắt 3 chỉ số, hai nhóm `Ca chưa trả`/`Ca đã ứng`, footer thanh toán/quyết toán.
- Payment modal: 2 cột, footer dính; chọn ca bằng Checkbox, mặc định tất cả; `Thanh toán`/`Ứng lương` có mô tả; QR `THANH TOAN LUONG N CA`/`UNG LUONG N CA`, chống kết quả cũ, retry; copy thiếu ngân hàng nói rõ tiền mặt/QR.
- Settlement: fetch/retry, summary khoản ứng/ca/chênh lệch; **fix `paymentService` cho phép shift `advanced | unpaid`**, chặn chênh lệch âm; ghi số còn lại vào lịch sử.
- History: sổ dòng, type tag `Thanh toán/Ứng lương/Quyết toán`; phạm vi thật `Từ tháng M/YYYY`; loading khi mở rộng cửa sổ; empty theo bộ lọc; transaction detail nêu nhân viên + ca.
- Month picker 44px/aria; ExportModal light a11y pass (44px, Checkbox, copy `lịch sự kiện`).
- Bỏ motion, "công", "Tiệc Sáng", "Tổng đã làm", preload avatar, comment chết.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: không motion trong payroll; tabs dùng primitive; 44px; history scope đúng; settlement truyền advanced+unpaid; QR dùng `CA`; ngày local; empty dùng chung; KPI không còn "Tổng đã làm".

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa kiểm visual 375/768/1024/1440 và chưa test Firebase transaction/VietQR/export runtime.
- Không có test suite.
- Quyết toán vẫn dựa trên tổng advance chưa chốt và tổng ca đang mở; dữ liệu lệch (advance không còn ca) sẽ hiện chênh lệch và có thể bị chặn.
- Chặn chênh lệch âm là quyết định UI; chưa có luồng thu hồi tiền ứng vượt.
- History mặc định 12 tháng gần nhất; nút tải thêm/lọc tháng mới mở rộng cửa sổ.
- Thanh toán không bank vẫn cho ghi nhận tiền mặt nhưng không có QR.
