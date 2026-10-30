# 08: Lịch sự kiện — Bảng ca tháng

**What to build:** Rebuild màn Lịch theo hướng Bảng ca: lưới tháng dạng sổ, agenda ngày đã chọn, form thêm/sửa sự kiện có cấu trúc, chi tiết sự kiện. Giữ nguyên dữ liệu, service và toàn bộ khả năng hiện có; không thêm tính năng.

**Blocked by:** 07 (commit `8108382`).

Status: resolved

## Audit hiện tại

- `calendar.tsx` 297 dòng; còn block comment cũ 182–191; prop `totalDebt` không dùng; `onNavigateToReviews` chỉ là shortcut icon.
- `selectedDate` khởi tạo luôn là **hôm nay**, bỏ qua `currentDate` (tuần đang xem ở Dashboard). Đổi tháng nhảy selection về ngày 01.
- Layout ép `lg:h-[calc(100vh-3rem)]`, lưới `overflow-hidden`, sidebar cố định 288px; tháng 6 hàng bị nén trên viewport thấp.
- Grid bắt đầu **Chủ nhật** trong khi Dashboard bắt đầu **Thứ 2**. Ngày chỉ có số, không có `aria-label`/`aria-pressed`.
- Ngày dùng icon like/dislike 10px của địa điểm làm dấu sự kiện; badge đếm 16px; không đọc được bằng screen reader.
- Sidebar: card là `div onClick` (không keyboard được), nút sửa/xóa 40px icon-only chỉ có `title`, nút thêm 40px không nhãn.
- Empty state tự viết "Chưa có sự kiện" + "Tạo mới", trùng CTA với nút thêm; không dùng `EmptyState`.
- Motion framer 200/300ms, slide ngang khi đổi tháng, không giảm chuyển động.
- `EventModal` 825 dòng: input/textarea/radio tự viết, control 40px, label không gắn control, lỗi chỉ toast; `titleError` chết; "Đánh giá sự kiện" thực chất là đánh giá **địa điểm**; "Tiệc Sáng/Chiều"; đếm "công"; số ca chưa trả là badge trần; input tiền cho phép số âm.
- `EventDetailModal` dùng chung ngôn ngữ "sự kiện" nhưng phần đánh giá ghi như của sự kiện.
- `planEventSave` xóa **mọi** shift không nằm trong lượt cập nhật; nếu event có shift cả sáng lẫn chiều (dữ liệu cũ) sẽ mất session còn lại.

## Sự thật dữ liệu

- `Shift.session` chỉ `morning | afternoon`; `Event` không có session. UI hiện tại tạo mỗi event một session; form chỉ sửa một session.
- `Event.amount` là lương/người; `surcharge` chia đều hoặc chọn người; tiền thực tế nằm trên `Shift.amount`.
- `Location.review` (`high | low | null`) + `reviewNote` lưu **theo địa điểm**, dùng lại cho mọi sự kiện cùng tên địa điểm.
- Không có giờ công; mọi tổng tiền tính từ `Shift.amount` qua `shiftBreakdown`.
- Danh sách tháng do `viewDate` quyết định; đổi `viewDate` làm app tải lại subscription. Chọn ngày trong cùng tháng **không** đổi `viewDate` để tránh refetch.
- `locations` có thể rỗng; form vẫn cho nhập tên địa điểm mới và tự tạo.
- Số ca chưa trả lấy từ `shiftService.getUnpaidShifts` mỗi lần mở form; chỉ là gợi ý cân bằng, không phải số liệu của sự kiện.

## Quyết định thiết kế

### Từ 1280px

- Container `max-w-[1400px] px-6 py-6`, cùng nhịp Dashboard.
- Header: eyebrow mono `Tháng 10 · 2026`; h1 `Lịch sự kiện`; bên phải nhóm tháng (prev 44px, `Hôm nay`, next 44px) + CTA primary `Thêm sự kiện`.
- Grid `minmax(0,1fr) 340px`: lịch bên trái, agenda ngày bên phải. Không lồng card trong card, không shadow; radius 2px.
- Lịch: một surface border; hàng thứ **T2 → CN**; 6 hàng × 7 cột cố định, đường kẻ giữa ô; ô ngày `min-h-24`. Ô có:
  - số ngày góc trái; hôm nay gạch chân/viền accent; ngày đã chọn nền `accent-soft` + viền accent; ngày ngoài tháng mờ.
  - tối đa 2 chip sự kiện: title 11px line-clamp-1; dòng mono `giờ · địa điểm`; viền trái accent nếu có ca, `highlight` + chữ `Cần xếp` nếu chưa có ca. Còn lại hiện `+N`.
  - ô không phải nút chứa chip con tương tác: cả ô là một nút chọn ngày; chip chỉ để đọc.
- Agenda `Ngày đã chọn`: header mono thứ/ngày + số sự kiện; các hàng ngăn bằng đường kẻ, viền trái trạng thái:
  - title là nút mở chi tiết; meta `giờ · địa điểm`; tag mono `Sáng · 3 ca` / `Chiều · 2 ca` hoặc `Cần xếp`; ghi chú line-clamp-2.
  - nút sửa/xóa 44px, luôn hiện, có `aria-label`; không dùng `div onClick`.
  - empty dùng `EmptyState`: "Ngày này chưa có sự kiện" + "Chọn ngày khác hoặc thêm sự kiện mới."; không lặp CTA vì header đã có.

### 768–1279px

- Một cột: lịch full width, agenda ngay dưới. Vẫn hiện chip (ô đủ rộng từ 768px).

### Dưới 768px

- Header: eyebrow + h1 + CTA `Thêm sự kiện`; nhóm tháng (`prev`, `Hôm nay`, `next`) xuống hàng dưới, không nhồi 4 nút một hàng.
- Lịch: ô tối thiểu 44px, chỉ số ngày + tối đa 3 dấu vuông 5px (đặc = có ca, rỗng = cần xếp); `aria-label` đầy đủ. Agenda ngay dưới, cuộn trang bình thường (chuẩn C), không nested scroll.
- Form và chi tiết mở bottom sheet như `Modal` hiện tại; footer dính đáy.

### Form thêm/sửa

- Modal rộng hơn trên desktop: thêm `size="lg"` (`max-w-2xl`) cho `Modal`; mobile vẫn full-width bottom sheet.
- Bố cục 4 nhóm có nhãn mono, ngăn bằng đường kẻ, field 1–2 cột:
  1. **Thông tin**: Tên sự kiện (hint "Để trống sẽ dùng tên 'Tiệc'."), Thời gian bắt đầu (`TimePicker`), Địa điểm (input + gợi ý địa điểm cũ + banner đánh giá đã lưu), Ghi chú.
  2. **Đánh giá địa điểm**: segmented Tốt / Thường / Kém (44px, `aria-pressed`); Ghi chú đánh giá + hint "Lưu theo địa điểm, dùng lại cho các sự kiện sau."
  3. **Ca và lương**: Ca sáng / Ca chiều (44px, `aria-pressed`, hint giờ mặc định từ cài đặt); Lương mỗi người (VND), Phụ phí (VND) — số nguyên ≥ 0; phân phối phụ phí dùng `RadioGroup` `Chia đều` / `Chọn người nhận`; dòng mono quy đổi `/người` cho cả hai kiểu; danh sách người nhận khi chọn thủ công.
  4. **Phân công**: search + danh sách nhân viên dùng `Checkbox`; đếm `Đang chọn N người`; mỗi dòng có tag `N ca chưa trả` khi > 0 (không hiện số 0); giữ thứ tự đã chọn trước, rồi số ca, rồi tên.
- Đổi ca **giữ nguyên nhân viên đã chọn** (hiện tại xóa sạch); bỏ chọn ca thì vẫn xóa phân công.
- Lỗi tại chỗ, không toast: "Chọn ca làm việc.", "Chọn ít nhất 1 nhân viên.", "Chọn ít nhất 1 người nhận phụ phí.".
- Footer: `Hủy` + `Lưu`/`Cập nhật`; giữ khóa nút khi không có thay đổi và thêm dòng "Chưa có thay đổi để lưu." thay vì nút câm.
- Xóa `titleError`/`validateTitle`; không đổi việc tên trống lưu thành "Tiệc".

### Chi tiết sự kiện

- Modal `md`: khối thời gian/địa điểm, khối tiền `Tổng chi` + `Lương` + `Phụ phí` (nếu có) + cách chia, đánh giá địa điểm, ghi chú, danh sách nhân viên theo ca.
- Footer: `Xóa` (outline, chữ danger) bên trái; `Sửa` (primary) bên phải. Xóa mở dialog xác nhận có tên sự kiện + số ca bị xóa.

## Hành vi và dữ liệu

- `selectedDate` khởi tạo từ `currentDate` (ngày đang xem ở Dashboard) thay vì luôn hôm nay.
- Đổi tháng giữ ngày-trong-tháng, kẹp theo số ngày của tháng mới; chọn ô thuộc tháng khác thì chuyển tháng và chọn ngày đó; `Hôm nay` đưa về hôm nay.
- `onDateChange` chỉ gọi khi đổi tháng (như hiện tại), không gọi khi chọn ngày trong tháng.
- Grid bắt đầu Thứ 2; vẫn lấp đủ 42 ô.
- `planEventSave`: chỉ xóa shift **cùng session** với bản nháp, giữ shift session khác của event cũ. Trường hợp một session bình thường không đổi hành vi.
- Bỏ prop không dùng `totalDebt`; bỏ shortcut `onNavigateToReviews` (Địa điểm vẫn có trong rail/bottom nav).
- Không đổi schema, service, Firebase, route path.

## Accessibility

- Lưới dùng `role="grid"`, mỗi hàng `role="row"`, ô `role="gridcell"`; roving tabindex: mũi tên di chuyển, `Home`/`End` đầu/cuối tuần, `Enter`/`Space` chọn. Chỉ ô đang chọn nằm trong tab order.
- Mỗi ô có `aria-label` đầy đủ ("Thứ Sáu 30/10, 2 sự kiện, 1 cần xếp"), `aria-selected`, hôm nay `aria-current="date"`.
- Mọi nút icon-only 44px + `aria-label`; không còn click trên `div`.
- Form dùng `Field`/`Input`/`Textarea`/`Checkbox`/`RadioGroup`/`TimePicker`; label gắn control; lỗi `role="alert"` tại chỗ.
- Không animation khi đổi tháng; nếu còn hiệu ứng thì tôn trọng `prefers-reduced-motion`.
- Contrast kiểm bằng token hiện có; không hardcode màu.

## States

- Loading: skeleton đúng hình lịch (header, 42 ô, agenda 3 hàng), không nhảy layout.
- Ngày trống: `EmptyState`; tháng trống vẫn hiện lưới, agenda ngày trống.
- Chưa có nhân viên: "Chưa có nhân viên" trong picker; tìm không thấy: "Không tìm thấy nhân viên".
- Chưa có địa điểm: input vẫn nhập tay; chi tiết hiện "Chưa có địa điểm".
- Lưu/xóa lỗi: toast lỗi, giữ dữ liệu form; thành công: toast + đóng.
- Offline/PWA: shell xử lý; lịch không tự fetch.

## Copy

- Nav + tiêu đề: thống nhất **Lịch sự kiện** (đổi label `Lịch tiệc` ở `Navbar` và map tab trong `app.tsx`).
- Nút: `Hôm nay`, `Thêm sự kiện`, `Lưu`, `Cập nhật`, `Hủy`, `Xóa`, `Sửa`.
- Ca: `Ca sáng` / `Ca chiều`; đếm `ca`, không dùng `công`; tag `Sáng · 3 ca`.
- Empty: "Ngày này chưa có sự kiện" / "Chọn ngày khác hoặc thêm sự kiện mới."
- Xóa: "Xóa sự kiện?" / "Sự kiện 'X' và 3 ca liên quan sẽ bị xóa. Không thể hoàn tác." / "Xóa sự kiện".
- Toast: "Đã thêm sự kiện.", "Đã cập nhật sự kiện.", "Đã xóa sự kiện.", "Không thể lưu sự kiện. Thử lại.", "Không thể xóa sự kiện. Thử lại."
- Đánh giá luôn gọi là **đánh giá địa điểm**, không phải đánh giá sự kiện.

## File dự kiến

- `src/app/routes/calendar.tsx` — rewrite state/layout/dialog; bỏ comment chết, prop thừa.
- `components/CalendarHeader.tsx` — page header mới.
- `components/CalendarGrid.tsx`, `CalendarDay.tsx` — lưới Thứ 2-first, ô ngày, roving tabindex.
- `components/CalendarSidebar.tsx` → `DayAgenda.tsx` (đổi tên, xóa file cũ).
- `components/EventModal.tsx` — rewrite form.
- `components/EventDetailModal.tsx` — rewrite chi tiết.
- `components/EmployeeAssignmentList.tsx` — checkbox primitive, tag số ca chưa trả, empty states.
- `features/calendar/eventPlan.ts` — giới hạn xóa shift theo session.
- `src/components/ui/Modal.tsx` — thêm `size?: 'md' | 'lg'` (mặc định md, không đổi màn khác).
- `src/app/app.tsx` — bỏ `totalDebt`/`onNavigateToReviews` khỏi route Lịch; đổi label tab.
- `src/components/layouts/Navbar.tsx` — đổi label tab Lịch.
- Không sửa: token, primitive khác, Dashboard, Payroll, Locations, Employees, Settings, service/Firebase.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: không còn `framer-motion` trong `features/calendar`; không còn `<input>`/`<textarea>` raw trong form; không còn `div onClick`; mọi nút icon-only 44px + aria-label; không còn chuỗi "công"/"Tiệc Sáng"; không hardcode hex; ngày bắt đầu Thứ 2; 42 ô; `planEventSave` chỉ xóa cùng session.
- Không browser test/screenshot; không test Firebase runtime. Giới hạn: chưa kiểm visual thật, chưa có test suite.

## Điểm cần bạn chốt (kèm đề xuất)

1. Đổi nav `Lịch tiệc` → `Lịch sự kiện` để khớp toàn bộ nội dung? **Đề xuất: đổi.**
2. Đổi ca giữ nhân viên đã chọn thay vì xóa sạch? **Đề xuất: giữ.**
3. Bỏ shortcut icon Địa điểm khỏi header Lịch (vẫn có trong nav)? **Đề xuất: bỏ.**
4. Sửa `planEventSave` để không xóa shift của session khác? **Đề xuất: sửa.**

## Trạng thái nhánh

- `HEAD` `eb42987`; ticket 08 đã sửa `src`, chưa commit.

## Kết quả triển khai

2026-10-31 — Lịch sự kiện implemented; static only theo yêu cầu.

- Header: eyebrow tháng, h1 `Lịch sự kiện`, Bảng ca mobile đặt CTA cạnh tiêu đề, nhóm tháng xuống hàng; desktop gom nhóm tháng + CTA bên phải.
- Lưới Thứ 2 → CN, 42 ô, ô desktop 112px có tối đa 2 chip (title + `giờ · địa điểm`, `Cần xếp` nếu chưa có ca), mobile chỉ số ngày + dấu trạng thái. Selection lấy từ `viewDate`; đổi tháng giữ ngày-trong-tháng; `Hôm nay` không refetch nếu cùng tháng.
- Lưới dùng `role=grid` + row/columnheader/gridcell, roving tabindex, mũi tên/Home/End; ô có `aria-label`, `aria-selected`, `aria-current`.
- Agenda ngày: title mở chi tiết, meta giờ/địa điểm, tag ca/Cần xếp, sửa/xóa 44px có nhãn; empty dùng `EmptyState`; loading skeleton.
- Form 4 nhóm, Modal `size="lg"`: Field/Input/Textarea/Checkbox/RadioGroup/SearchInput/TimePicker; đánh giá gọi đúng "địa điểm", disabled đến khi có địa điểm; lỗi tại chỗ; số ca chưa trả có nhãn; đổi ca giữ phân công; nút lưu khóa + hint khi không đổi.
- Chi tiết: tổng chi/lương/phụ phí, đánh giá địa điểm, ghi chú, nhân viên theo ca; footer Xóa outline trái, Sửa primary phải.
- Xóa: dialog nêu tên + số ca liên quan; toast có dấu câu.
- `planEventSave`: chỉ xóa shift của ca đang sửa; đổi ca xóa ca cũ và phần thừa của ca mới, giữ ca khác của event cũ.
- Bỏ prop `totalDebt`, shortcut `onNavigateToReviews`; đổi label nav/tab/title thành `Lịch sự kiện`.
- Primitive: `Modal` thêm `size`, `Checkbox` nhận children, `TimePicker` nhận `ariaLabel`; mặc định các màn khác không đổi.
- Xóa `CalendarSidebar.tsx`; thêm `DayAgenda.tsx`.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: không còn raw input/textarea/click div trong calendar; không framer-motion trong feature; không còn "công"/"Tiệc Sáng"/"Lịch tiệc"; icon-only 44px; không hardcode màu; lưới 42 ô Thứ 2-first.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa kiểm visual thật ở 375/768/1024/1440 và chưa test Firebase runtime.

## Comments

2026-10-31 — Review nhánh độc lập sửa an toàn dữ liệu sự kiện:

- Chỉ shift `unpaid` được cập nhật/xóa khi sửa sự kiện; shift `paid`/`advanced` giữ nguyên.
- Nhân viên đã có ca chốt lương trong sự kiện hiện thành tag `Đã chốt lương`, không thể chọn lại; không tạo shift trùng.
- Sửa metadata sự kiện vẫn lưu được khi mọi ca đã chốt (bỏ yêu cầu chọn nhân viên trong trường hợp này).
- `originalSession` lấy từ shift đang sửa được (không phải phần tử đầu tiên) để đổi ca xóa đúng ca `unpaid` cũ.
- Khóa đổi ca khi sự kiện đã có ca chốt lương, kèm chú thích; tránh tạo sự kiện trộn ca mà lịch sử lương không phản ánh.
- Xóa sự kiện có ca `paid`/`advanced` bị chặn bằng modal giải thích, giữ lịch sử lương.
- Không có test suite.
- Sự kiện ở ngày thuộc tháng kề chỉ hiện khi dữ liệu tháng đó đã được tải; chọn ngày sẽ chuyển tháng và tải.
- Đánh giá địa điểm vẫn chỉ `high/low`; chọn "Thường" tương đương chưa đánh giá và không xóa được review cũ (giới hạn service hiện có, ngoài phạm vi UI).
- Event có shift cả sáng lẫn chiều (dữ liệu cũ) được giữ ca khác khi sửa cùng ca; khi đổi ca, ca cũ bị thay và ca mới được chuẩn hóa theo danh sách phân công.
