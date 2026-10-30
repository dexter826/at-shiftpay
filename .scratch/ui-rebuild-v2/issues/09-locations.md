# 09: Địa điểm — Sổ địa điểm

**What to build:** Rebuild màn Địa điểm theo hướng Bảng ca: sổ danh sách dạng dòng, lọc/sắp xếp rõ nghĩa, form thêm/sửa có kiểm tra, chi tiết có bản đồ đúng dữ liệu và lịch sử sự kiện. Giữ nguyên dữ liệu, service và khả năng hiện có.

**Blocked by:** 08 (commit `e900dc3`).

**Status:** static verified — visual chưa kiểm; 5 điểm chốt đã duyệt (sổ dòng, tên trang, lọc Thường, chặn trùng tên, không xóa sự kiện).

## Audit hiện tại

- `locations.tsx` 290 dòng: có nút Back dù Địa điểm là tab cấp 1; h2 "Quản lý địa điểm"; stats chips nằm cạnh nút thêm; CTA "Thêm mới".
- `workCounts` đếm **số sự kiện** nhưng card ghi "N ca làm" → sai số liệu. Sort "Làm nhiều nhất" cũng đang xếp theo số sự kiện.
- Mỗi card preload và render ảnh LocationIQ 200px; địa điểm không có tọa độ vẫn tải bản đồ mặc định Hà Nội. Không có fallback khi ảnh lỗi.
- Card grid 4 cột, map lớn, overlay button toàn card + 3 nút icon 40px; nút Google Maps bấm không làm gì khi thiếu cả địa chỉ lẫn tọa độ.
- Empty state dùng một câu "Không tìm thấy địa điểm nào" cho cả chưa có dữ liệu và lọc không ra; không dùng `EmptyState`; còn motion.
- Toolbar: Dropdown lọc/sort không có nhãn, cao 40px; search placeholder chỉ nói tên nhưng code tìm cả địa chỉ/ghi chú.
- Detail: title trùng tên địa điểm trong body; map mặc định khi thiếu tọa độ; lịch sử hiện `undefinedđ` nếu `event.amount` trống; empty tự viết.
- Form: input/textarea tự viết, control ~40px; tên không bắt buộc; tọa độ nhận `NaN`/ngoài khoảng; autocomplete gọi API mỗi lần gõ, không debounce/abort; label tọa độ chỉ là placeholder; motion.
- Xóa chỉ hỏi chung chung, không nêu tên/số sự kiện; không chặn double click.
- Service: xóa địa điểm **không** xóa sự kiện; sự kiện giữ `locationId` trỏ tới document đã mất. `updateLocation` xóa field khi giá trị `undefined`.

## Sự thật dữ liệu

- `Location`: `name`, `address?`, `latitude?`, `longitude?`, `review?: 'high' | 'low' | null`, `reviewNote?`, `createdAt`, `userId`.
- Không có số điện thoại, giờ mở cửa, sức chứa.
- `review` chỉ high/low; null nghĩa là **Thường/chưa đánh giá** (form set undefined → service xóa field). Ghi chú đánh giá vẫn lưu được khi review null.
- Sự kiện tham chiếu địa điểm bằng `locationId`; xóa địa điểm không cascade. Cần cảnh báo thay vì xóa dây chuyền.
- Lịch sử địa điểm = số sự kiện có `locationId`; `Event.amount` là lương/người và có thể trống.
- Bản đồ phụ thuộc `VITE_LOCATIONIQ_API_KEY`; khi thiếu key, autocomplete tắt và ảnh map có thể lỗi → phải có fallback, không giả bản đồ.
- Không truyền `shifts` cho màn này; nếu cần số ca thật phải đổi props. Trong phạm vi ticket, hiển thị đúng **số sự kiện**.

## Quyết định thiết kế

### Desktop ≥1024

- Container `max-w-[1400px] px-6 py-6`, cùng nhịp Dashboard/Lịch.
- Header: eyebrow mono `12 địa điểm · 5 tốt · 2 kém` (ẩn phần có count 0); h1 **Sổ địa điểm**; CTA primary `Thêm địa điểm`. Bỏ nút Back.
- Toolbar một hàng: search `Tìm địa điểm` (tên/địa chỉ/ghi chú như hiện tại); nhóm lọc có nhãn mono `Đánh giá` + segmented 44px `Tất cả / Tốt / Thường / Kém`; Dropdown `Sắp xếp` có nhãn mono, options `Mới nhất / Tên A–Z / Nhiều sự kiện nhất`.
- Danh sách là **một surface dạng sổ**, không phải card ảnh:
  - Header row mono: `Địa điểm` / `Địa chỉ` / `Đánh giá` / `Sự kiện` / cột thao tác.
  - Mỗi dòng: tên là nút mở chi tiết (44px), ghi chú line-clamp-1 nếu có; địa chỉ truncate; review `Tag` Tốt/Thường/Kém; số sự kiện mono; sửa/xóa 44px có nhãn.
  - Đường kẻ giữa dòng, hover `surface-2`; không map thumbnail, không shadow.
  - Phân trang 12 dòng + `LoadMore` như hiện tại.
- Loading skeleton 8 dòng đúng cột.
- Mobile: mỗi dòng xếp dọc (tên + tag, địa chỉ, `N sự kiện`, ghi chú, actions); cùng surface, không card riêng lẻ.

### Chi tiết

- Modal title là tên địa điểm; tag review ngay dưới.
- Bản đồ chỉ render khi có đủ `latitude`/`longitude`; nếu ảnh lỗi hiện khối "Không tải được bản đồ." thay vì icon vỡ. Không tải bản đồ mặc định.
- Nút `Mở Google Maps` chỉ bật khi có tọa độ hoặc địa chỉ; nếu không, hiện disabled + lý do "Cần địa chỉ hoặc tọa độ.".
- Địa chỉ; đánh giá + ghi chú; `Lịch sử sự kiện` dạng dòng: ngày, tên, `Lương/người` (hoặc "Chưa có lương").
- Empty history dùng `EmptyState`: "Chưa có sự kiện tại địa điểm này" + giải thích; không CTA.
- Footer một CTA `Sửa địa điểm`.

### Form thêm/sửa

- Modal `size` mặc định; conditional mount để reset state, bỏ effect khởi tạo.
- Dùng `Field`/`Input`/`Textarea`/`Button`/`Tag`/`EmptyState`; control ≥44px.
- Nhóm:
  1. `Thông tin`: Tên địa điểm (bắt buộc, tự trim, chặn trùng tên khi tạo; khi sửa cho phép giữ tên cũ), Địa chỉ.
  2. `Tọa độ (tùy chọn)`: Vĩ độ / Kinh độ có label hiển thị, inputMode decimal; validate cặp đôi và khoảng -90..90 / -180..180.
  3. `Đánh giá`: segmented Tốt / Thường / Kém; ghi chú đánh giá.
- Autocomplete địa chỉ: debounce ~300ms, AbortController hủy request cũ, đóng khi Escape/click ngoài; gợi ý là button 44px; khi không có API key thì tắt gợi ý, nhập tay bình thường.
- Lỗi inline tại chỗ; toast chỉ cho lỗi lưu/xóa. Nút lưu khóa khi không có thay đổi, kèm hint "Chưa có thay đổi để lưu."; form mới có hint "Nhập tên địa điểm để lưu." khi tên trống.
- Footer `Hủy` + `Lưu`/`Cập nhật`.

### Xóa

- Dialog nêu tên địa điểm + số sự kiện liên quan: "Các sự kiện này sẽ mất liên kết địa điểm, không bị xóa." CTA `Xóa địa điểm`, có loading chặn double click.
- Không cascade xóa sự kiện.

## States

- Loading: skeleton sổ dòng.
- Chưa có địa điểm: `EmptyState` "Chưa có địa điểm" + "Thêm địa điểm để gắn sự kiện và lưu đánh giá."; không CTA (header đã có).
- Lọc/tìm không ra: `EmptyState` "Không tìm thấy địa điểm" + "Thử từ khóa khác hoặc bỏ bộ lọc."; action `Xóa bộ lọc` khi có điều kiện lọc.
- Map lỗi/không tọa độ: khối thay thế rõ ràng; không ảnh vỡ.
- Lưu/xóa lỗi: toast, giữ dữ liệu form/dialog.

## Copy

- H1: **Sổ địa điểm**; CTA `Thêm địa điểm`.
- Filter: `Tất cả`, `Tốt`, `Thường`, `Kém`; sort `Mới nhất`, `Tên A–Z`, `Nhiều sự kiện nhất`.
- Card/dòng: `N sự kiện` (không còn "ca làm"); review null hiện `Thường`.
- Empty/no-match theo chuẩn UX writing; không dùng "Không tìm thấy" khi chưa có dữ liệu.
- Detail: `Lịch sử sự kiện`, `Lương/người`, `Chưa có lương`, `Chưa có tọa độ để hiển thị bản đồ.`
- Xóa: "Xóa địa điểm?" / "“X” và 3 sự kiện liên quan sẽ mất liên kết địa điểm. Các sự kiện không bị xóa." / "Xóa địa điểm".
- Toast: "Đã thêm địa điểm.", "Đã cập nhật địa điểm.", "Đã xóa địa điểm.", "Không thể lưu địa điểm. Thử lại.", "Không thể xóa địa điểm. Thử lại."
- Lỗi form: "Nhập tên địa điểm.", "Địa điểm này đã có trong sổ.", "Nhập cả vĩ độ và kinh độ hoặc để trống cả hai.", "Vĩ độ phải từ -90 đến 90.", "Kinh độ phải từ -180 đến 180."

## File dự kiến

- `src/app/routes/locations.tsx` — rewrite state/layout/dialog; bỏ Back, theme store, preload map.
- `components/LocationToolbar.tsx` — search + segmented filter + labelled sort.
- `components/LocationList.tsx` — sổ dòng, loading/empty/load more.
- `components/LocationCard.tsx` → `LocationRow.tsx` (đổi tên, xóa card cũ).
- `components/LocationStats.tsx` — xóa (summary lên header).
- `components/LocationFormModal.tsx` — rewrite form/validation/autocomplete.
- `components/LocationDetailModal.tsx` — rewrite chi tiết/map/history.
- `src/app/app.tsx` — bỏ prop `onBack` của LocationView.
- Không sửa service, schema, Firebase, màn khác.

## Verify (static theo yêu cầu)

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`.
- Code inspection: không còn ảnh map trong danh sách; không preload LocationIQ; không raw input/textarea; không div click; icon-only 44px + aria-label; empty state dùng chung; "N sự kiện" đúng dữ liệu; không còn "N ca làm"; tọa độ validate; delete warning có số sự kiện.
- Không browser test/screenshot; không test runtime Firebase/LocationIQ. Giới hạn: chưa có test suite, chưa kiểm visual.

## Điểm cần bạn chốt (kèm đề xuất)

1. Bỏ card ảnh map, chuyển thành sổ dòng; map chỉ ở chi tiết khi có tọa độ? **Đề xuất: có.**
2. Tiêu đề trang **Sổ địa điểm** (nav vẫn `Địa điểm`)? **Đề xuất: có.**
3. Thêm lọc `Thường` cho review null? **Đề xuất: có.**
4. Chặn trùng tên địa điểm khi tạo/sửa? **Đề xuất: có** (calendar dùng tên để tìm/tạo địa điểm).
5. Xóa địa điểm chỉ cảnh báo, không xóa sự kiện? **Đề xuất: giữ như hiện tại**, ghi rõ trong dialog.

## Trạng thái nhánh

- `HEAD` `803ec15`; ticket 09 đã sửa `src`, chưa commit.

## Kết quả triển khai

2026-10-31 — Sổ địa điểm implemented; static only theo yêu cầu.

- Header `Sổ địa điểm`, summary mono `N địa điểm · N tốt · N kém` (ẩn phần 0), CTA `Thêm địa điểm`; bỏ Back và stats chips.
- Toolbar có nhãn Tìm kiếm / Đánh giá / Sắp xếp; segmented `Tất cả / Tốt / Thường / Kém` 44px; sort `Mới nhất / Tên A–Z / Nhiều sự kiện nhất`.
- Danh sách chuyển sang surface sổ dòng: tên + ghi chú, địa chỉ, tag đánh giá, **N sự kiện** (đếm event, không còn "ca làm"), sửa/xóa 44px; mobile xếp dọc, desktop bảng 5 cột từ `lg`.
- Empty state tách "Chưa có địa điểm" và "Không tìm thấy địa điểm" + `Xóa bộ lọc`; loading skeleton đúng dạng dòng; LoadMore giữ nguyên.
- Chi tiết: modal title là tên địa điểm; tag đánh giá có nhãn; map chỉ render khi có tọa độ, có fallback khi ảnh lỗi/không tọa độ; `Mở Google Maps` disable kèm lý do nếu thiếu địa chỉ & tọa độ; lịch sử sự kiện có `Lương/người`/`Chưa có lương`; empty dùng `EmptyState`.
- Form: Field/Input/Textarea, bắt buộc tên, chặn trùng tên khi tạo/đổi tên, validate cặp tọa độ + khoảng; autocomplete debounce 300ms + AbortController, nhập tay khi thiếu API key; nút lưu khóa + hint khi không đổi/thiếu tên.
- Xóa: dialog nêu tên + số sự kiện mất liên kết, nói rõ không xóa sự kiện; loading chặn double click.
- Xóa `LocationCard.tsx`, `LocationStats.tsx`; thay `LocationRow.tsx`; bỏ `onBack`, theme store, preload LocationIQ và ảnh map khỏi danh sách.

## Static verify

- `npm run lint` pass.
- `npx tsc --noEmit` pass.
- `npm run build` pass.
- `npm run format:check` pass.
- Code inspection: không còn raw input/textarea, motion, LocationIQ preload, "ca làm", `onBack`, refs tới LocationCard/LocationStats; icon-only 44px; empty state dùng chung; map chỉ ở detail.

## Giới hạn

- Không browser test/screenshot theo yêu cầu; chưa kiểm visual 375/768/1024/1440 và chưa test Firebase/LocationIQ runtime.
- Không có test suite.
- Xóa địa điểm không cascade; sự kiện giữ `locationId` cũ và hiện "Chưa có địa điểm" ở các màn khác.
- Dữ liệu cũ có thể đã có tên trùng; form không chặn khi sửa các field khác với tên cũ, chỉ chặn tạo mới/đổi sang tên trùng.
- Review vẫn chỉ high/low/null; `Thường` nghĩa là chưa đánh giá/trung tính, lưu kèm ghi chú nếu có.
