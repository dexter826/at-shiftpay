# 06: Dashboard — Bảng ca tuần

**What to build:** Màn Tổng quan theo hướng Bảng ca: header tuần, KPI thật, board 7 ngày × 2 ca, việc cần xử lý, sổ lương tháng và địa điểm. Dùng shell/token/primitive đã có; không đổi API/dữ liệu.

**Blocked by:** 05 (commit `3ea134f`).

**Status:** in-progress — static verified; dashboard visual sau auth chưa kiểm.

## Sự thật dữ liệu (đã audit)

- `Shift.session` chỉ có `morning | afternoon`; **không có Tối**. Board phải 2 hàng, không 3 như mockup.
- Shift không có giờ công; chỉ có `amount`, `status`, `employeeId`, `eventId`, `date`. KPI "Giờ đã xếp" trong mockup không dựng được → dùng "Ca đã xếp".
- Sự kiện `Event` có `date`, `time?`, `title`, `amount?`, `locationId?`; chưa có bảng phân công riêng — phân công nằm ở các `Shift`.
- "Cần xếp" = sự kiện trong tuần **không có Shift nào**. Không thể hiện "ca chưa có người" riêng vì shift luôn gắn employeeId.
- `viewDate` trong `appDataStore` đã có; đổi ngày sẽ re-init subscription. Dashboard dùng `viewDate` làm mốc tuần; tuần Thứ 2 → CN.
- `usePayrollData` đã tính summary/stats theo tháng; dashboard nên tách helper dùng chung thay vì lặp math.
- `locations` đã có trong AppContent nhưng chưa truyền cho DashboardView.

## Bố cục desktop

1. Header: eyebrow `Tuần N · dd/mm – dd/mm/yyyy`; h1 `Bảng ca`; nút prev/next tuần, "Tuần này"; actions `Xuất báo cáo` (mở export hiện có) và `Xếp ca` (navigate `/calendar`).
2. KPI strip 4 ô, border trên 2px:
   - Sự kiện tuần — số event trong tuần.
   - Ca đã xếp — số shift trong tuần.
   - Lương dự kiến — tổng `shift.amount` trong tuần.
   - Cần xếp — số event chưa có shift; nền `highlight`, link tới calendar.
3. Grid chính `minmax(0,1fr) 292px`:
   - Board `Lịch phân ca`: 7 cột ngày + 2 hàng Sáng/Chiều; tile event gồm title, location, số nhân sự (unique `employeeId`), tag trạng thái; event chưa có shift → tile highlight `Cần xếp`; cột hôm nay có top border accent.
   - Panel `Cần xử lý`: số event chưa xếp + link calendar; số ca chưa thanh toán (`unpaid`) + link payroll; số người có ca đã ứng (`advanced`) + link payroll.
4. Hàng dưới `1.7fr / 1fr`:
   - `Sổ lương tháng X`: bảng nhân viên có ca trong tháng, columns Ca / Lương / Đã ứng / Còn lại / Trạng thái; link "Xem tất cả" → payroll. Dùng helper payroll dùng chung.
   - `Địa điểm tuần này`: tên địa điểm, số event, số shift; top 5; link calendar.

## Mobile (<768px)

- Header gọn; week strip 7 ngày; chọn ngày.
- KPI 2×2.
- Board chuyển thành danh sách ngày đã chọn: Sáng/Chiều, tile event; không nhồi 7 cột vào 390px.
- Tasks, sổ lương (3 dòng + xem tất cả), địa điểm xếp dọc.
- Bottom nav do shell; dashboard chỉ padding trên.

## Trạng thái

- Loading: skeleton header/KPI/board/table theo hình dạng thật.
- Tuần không có event: empty panel "Tuần này chưa có sự kiện" + CTA "Mở lịch".
- Không có shift: tile Cần xếp; KPI highlight.
- Lỗi dữ liệu: watcher toàn app; dashboard không tự fetch.
- Không có địa điểm/không có ca: ẩn hàng hoặc empty ngắn, không bịa số.

## Data rules

- Week start Thứ 2; end CN; filter `parseDateOnly(date)` trong khoảng.
- Event session: lấy session từ shift của event nếu có; nếu chưa có shift, suy từ `event.time` (trước 12:00 → morning, còn lại → afternoon). Không thêm session mới.
- Nhân sự tile = unique `shift.employeeId` của event.
- Payroll tháng = shifts/events của tháng chứa `viewDate`; helper summary/stats.
- Địa điểm tuần = events/shifts trong tuần, group `locationId`; location thiếu → "Chưa gán".
- Không đổi schema, service, Firebase.

## File dự kiến

- `src/app/routes/dashboard.tsx` — rewrite.
- `src/features/dashboard/components/`: `DashboardHeader` (mới), `KpiStrip`, `WeekBoard`, `TaskPanel`, `PayrollSummary`, `LocationSummary`, `DashboardSkeleton` (hoặc gộp).
- `src/features/dashboard/dashboardData.ts` — week range, board grouping, KPI, location summary (pure).
- `src/features/payroll/payrollSummary.ts` — tách summary/stats khỏi hook; `usePayrollData` gọi lại.
- `src/app/app.tsx` — truyền `locations`; bỏ props dashboard không dùng (`user`, `onLogout`, `onNavigateToSettings` nếu xác nhận).
- Xóa component dashboard cũ không còn dùng: `DashboardStats`, `ActivityChart`, `PaymentChart`, `ChartTooltip`, `MonthPickerModal`, `DashboardHeader` cũ.
- `recharts`: dashboard không còn dùng; giữ dependency theo spec, không đổi thư viện.

Không sửa: shell, login, payroll/calendar, token/primitive, API.

## Strings

- Giữ thuật ngữ hiện có: Tổng quan, Lịch tiệc, Thanh toán, Ca, Sự kiện, Cần xếp, Đã ứng, Chưa thanh toán.
- Nhãn mới: "Ca đã xếp", "Sự kiện tuần", "Lương dự kiến", "Sổ lương tháng X", "Địa điểm tuần này", "Tuần này".
- Không đổi copy nghiệp vụ khác.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: mapping dữ liệu, không hardcode số liệu, không fetch mới, không import chart cũ, không còn file chết.
- Không browser test/screenshot. Dashboard nằm sau auth; user tự đăng nhập kiểm rail + dashboard.
- Giới hạn: không có test suite/visual regression; tuần crossing month có thể thiếu ngày nếu store chỉ tải tháng hiện tại — sẽ hiển thị empty thay vì bịa; user kiểm thực tế.

## Trạng thái nhánh

- Shell committed `3ea134f`; `src/` sạch. Ticket 06 chưa sửa code. Chưa commit gì thêm.


## Kết quả triển khai

2026-10-30 — Dashboard Bảng ca implemented, static only theo yêu cầu.

- Header tuần T2–CN, prev/next/tuần này; KPI Sự kiện tuần / Ca đã xếp / Lương dự kiến / Cần xếp; actions Xuất báo cáo + Xếp ca.
- Board 7×2 Sáng/Chiều (đúng data model), tile event + location + số người; event chưa có shift = tile highlight Cần xếp; hôm nay highlight.
- Mobile: week strip + danh sách ngày đã chọn + Sáng/Chiều; KPI 2×2.
- Task panel: sự kiện chưa xếp, ca chưa thanh toán, ca đã ứng; link calendar/payroll; 0 việc → tag Đã xong.
- Sổ lương tháng (top 5 desktop / 3 mobile) + địa điểm tuần (top 5, bar).
- Loading skeleton; empty week; board empty không thêm CTA trùng header.
- Tách `payrollSummary.ts` dùng chung; `usePayrollData` gọi helper, behavior giữ nguyên.
- Xóa `DashboardStats`, `ActivityChart`, `PaymentChart`, `ChartTooltip`, `MonthPickerModal`, `config/colors.ts` (orphan do bỏ chart). Recharts vẫn trong package theo spec nhưng không còn import.
- `DashboardView` props gọn: employees/events/shifts/locations/loading/onOpenExport; AppContent truyền locations.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass; không còn charts-vendor trong output.
- `npm run format:check` pass.
- Code inspection: không import chart cũ/`config/colors`/`recharts` trong `src`; không hardcode số liệu; tuần/tuần số/tháng dùng helper; payroll math dùng chung.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; dashboard nằm sau auth, user tự đăng nhập kiểm.
- Không có test suite/visual regression.
- Tuần vắt qua tháng có thể thiếu ngày nếu store chỉ tải tháng hiện tại → hiển thị trống, không bịa.
- Sổ lương chỉ hiển thị người có ca unpaid/advanced (paid không nằm trong summary), giống logic payroll hiện tại.


2026-10-30 — Fix TaskPanel sau feedback: bỏ 3 dòng 0 việc + tag "Đã xong" lặp, bỏ số "00" và "0 việc"; panel chỉ hiện việc đang có count > 0, hoặc một empty state "Không có việc cần xử lý". Tách scope: "Sự kiện chưa xếp" theo tuần (khớp board/KPI), "Ca chưa thanh toán" và "Ca đã ứng" theo tháng (khớp Sổ lương). Count lấy từ payrollStats tháng thay vì shifts tuần.

2026-10-30 — Chuẩn hóa empty state + UX writing sau feedback:
- Thêm `EmptyState` dùng chung (icon + title + một dòng; action optional).
- Board, task panel, sổ lương, địa điểm dùng cùng pattern; bỏ 4 kiểu empty khác nhau.
- Task panel: bỏ liệt kê việc 0/"00"/"Đã xong", empty state "Không có việc cần xử lý"; payment task theo tháng, unassigned theo tuần.
- KPI: note không lặp đơn vị, highlight Cần xếp chỉ khi >0; bỏ "đã đủ người" khi tuần chưa có sự kiện.
- Rule ghi vào spec mục "UX writing"; áp dụng cho các màn sau.
