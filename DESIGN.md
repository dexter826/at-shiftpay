---
version: 1
name: ShiftPay — Ledger Paper
description: Ứng dụng quản lý ca làm, công nợ và chấm công. Ngôn ngữ thiết kế Bảng ca (Ledger Paper): nền giấy nhạt, mực đậm, đường kẻ rõ, điểm nhấn teal và ô highlight chartreuse đánh dấu việc cần xử lý. Bề mặt phẳng hoàn toàn, không bóng đổ, không gradient trang trí.
colors:
  canvas: '#f2f4f0'
  surface: '#fbfcf9'
  surface-2: '#e8ece7'
  line: '#d5dbd4'
  line-strong: '#b9c2ba'
  ink: '#101613'
  ink-soft: '#3f4b44'
  ink-muted: '#5b665f'
  accent: '#0d6b5f'
  accent-ink: '#0b5a50'
  accent-soft: '#dcede8'
  on-accent: '#f4fbf7'
  highlight: '#dde84a'
  highlight-ink: '#1a2008'
  success: '#15734f'
  warning: '#7e5a0f'
  danger: '#b23a2c'
  info: '#2f5d8a'
  rail: '#101613'
  rail-ink: '#eff4ef'
  rail-muted: '#9aa69e'
  rail-hover: '#1b2521'
  rail-line: '#27332c'
  scrim: '#101613'
themes:
  light:
    colors:
      canvas: '#f2f4f0'
      surface: '#fbfcf9'
      surface-2: '#e8ece7'
      line: '#d5dbd4'
      line-strong: '#b9c2ba'
      ink: '#101613'
      ink-soft: '#3f4b44'
      ink-muted: '#5b665f'
      accent: '#0d6b5f'
      accent-ink: '#0b5a50'
      accent-soft: '#dcede8'
      on-accent: '#f4fbf7'
      highlight: '#dde84a'
      highlight-ink: '#1a2008'
      success: '#15734f'
      warning: '#7e5a0f'
      danger: '#b23a2c'
      info: '#2f5d8a'
      rail: '#101613'
      rail-ink: '#eff4ef'
      rail-muted: '#9aa69e'
      rail-hover: '#1b2521'
      rail-line: '#27332c'
      scrim: '#101613'
  dark:
    colors:
      canvas: '#0c1210'
      surface: '#131a17'
      surface-2: '#1b2521'
      line: '#27332c'
      line-strong: '#3a4a40'
      ink: '#ecf2ec'
      ink-soft: '#c4cec7'
      ink-muted: '#a6b3aa'
      accent: '#63d2c0'
      accent-ink: '#9fe6da'
      accent-soft: '#123a33'
      on-accent: '#06201b'
      highlight: '#d7e36a'
      highlight-ink: '#121505'
      success: '#63c79b'
      warning: '#e0b768'
      danger: '#f08a7a'
      info: '#8fb8e0'
      rail: '#090f0d'
      rail-ink: '#eff4ef'
      rail-muted: '#8b978f'
      rail-hover: '#131a17'
      rail-line: '#1b2521'
      scrim: '#000000'
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  title:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  mono-label:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.02em
    textTransform: uppercase
  data:
    fontFamily: IBM Plex Mono
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
rounded:
  control: 2px
  card: 2px
  dialog: 2px
  tag: 2px
  full: 9999px
spacing:
  micro-1: 2px
  micro-2: 6px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  huge: 48px
  section: 64px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.on-accent}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.control}'
    minHeight: 44px
  button-secondary:
    backgroundColor: '{colors.surface-2}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.control}'
    minHeight: 44px
  button-outline:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    border: '{colors.line}'
    rounded: '{rounded.control}'
    minHeight: 44px
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '#ffffff'
    rounded: '{rounded.control}'
    minHeight: 44px
  text-field:
    minHeight: 44px
    typography: '{typography.body}'
    textColor: '{colors.ink}'
    placeholderColor: '{colors.ink-muted}'
    backgroundColor: '{colors.surface}'
    border: '{colors.line}'
    rounded: '{rounded.control}'
  search-field:
    minHeight: 44px
    padding: 0 44px 0 40px
    typography: '{typography.body}'
    backgroundColor: '{colors.surface}'
    border: '{colors.line}'
    rounded: '{rounded.control}'
  tag:
    padding: 2px 6px
    rounded: '{rounded.tag}'
    typography: '{typography.mono-label}'
    border: '{colors.line}'
    backgroundColor: '{colors.surface-2}'
  kpi-strip:
    borderTop: 2px solid '{colors.ink}'
    backgroundColor: '{colors.surface}'
    typographyData: '{typography.data}'
  ledger-row:
    minHeight: 44px
    backgroundColor: '{colors.surface}'
    borderBottom: '{colors.line}'
    hoverBackgroundColor: '{colors.surface-2}'
  dialog-overlay:
    backgroundColor: '{colors.scrim}'
    opacity: 0.7
  dialog-panel:
    backgroundColor: '{colors.surface}'
    border: '{colors.line}'
    rounded: '{rounded.dialog}'
    maxHeight: 85dvh
  toast:
    backgroundColor: '{colors.surface-2}'
    border: '{colors.line}'
    rounded: '{rounded.control}'
    minHeight: 44px
---

## 1. Overview

ShiftPay là ứng dụng web quản lý ca làm việc, chấm công và theo dõi công nợ cho các đơn vị vận hành ca. Ngôn ngữ thiết kế lấy cảm hứng từ cuốn sổ vận hành và bảng phân ca truyền thống (Ledger Paper): nền giấy nhạt, mực đậm, đường kẻ rõ ràng, kết hợp một màu teal làm điểm nhấn hành động và ô highlight chartreuse đánh dấu các mục cần xử lý.

### Đặc tính cốt lõi

- **Chế độ hiển thị:** Nền sáng (Light) mang sắc thái giấy nhạt là mặc định; nền tối (Dark) sử dụng gam mực đậm bảo đảm độ tương phản.
- **Kiểu chữ:** Hệ thống phông kép chuyên biệt: `IBM Plex Sans` phục vụ toàn bộ nội dung đọc và điều hướng; `IBM Plex Mono` cho số liệu, tiền tệ, ngày tháng, mã ca và chỉ số KPI.
- **Cấu trúc hình học:** Bề mặt phẳng tuyệt đối (100% Flat); triệt tiêu hoàn toàn bóng đổ mềm (soft blur shadows), không dùng dải màu trang trí (decorative gradients) và không dùng thẻ nổi (raised cards).
- **Bán kính bo góc:** Cố định 2px cho mọi thành phần điều khiển và khung chứa; ảnh đại diện tròn (9999px) là ngoại lệ duy nhất.
- **Điểm nhấn chức năng:** Teal dành cho hành động chính và trạng thái kích hoạt; Chartreuse dành riêng cho trạng thái cần xếp ca hoặc việc cần xử lý gấp.

---

## 2. Colors

Hệ thống màu sắc tuân thủ độ tương phản tiếp cận WCAG AA trên cả hai chủ đề sáng và tối. Mọi thành phần giao diện bắt buộc tham chiếu qua token ngữ nghĩa, không định nghĩa mã màu trực tiếp trong mã nguồn component.

| Token | Light | Dark | Vai trò ngữ nghĩa |
| :--- | :--- | :--- | :--- |
| `canvas` | `#f2f4f0` | `#0c1210` | Nền canvas sâu nhất của ứng dụng |
| `surface` | `#fbfcf9` | `#131a17` | Bề mặt hiển thị nội dung chính (bảng ca, sổ dữ liệu, form) |
| `surface-2` | `#e8ece7` | `#1b2521` | Bề mặt phân cấp cấp 2 (hàng hover, panel nổi, khối phụ) |
| `line` | `#d5dbd4` | `#27332c` | Đường kẻ phân cách cấu trúc, viền bảng và ô nhập liệu |
| `line-strong` | `#b9c2ba` | `#3a4a40` | Đường kẻ nhấn, đường bao ngoài hoặc phân vùng nổi bật |
| `ink` | `#101613` | `#ecf2ec` | Màu mực chính cho tiêu đề và nội dung văn bản |
| `ink-soft` | `#3f4b44` | `#c4cec7` | Màu mực phụ cho nhãn mô tả và văn bản thứ cấp |
| `ink-muted` | `#5b665f` | `#a6b3aa` | Màu văn bản gợi ý (placeholder, ghi chú phụ) |
| `accent` | `#0d6b5f` | `#63d2c0` | Màu nhấn chính: nút bấm chính, liên kết, tab kích hoạt |
| `accent-ink` | `#0b5a50` | `#9fe6da` | Màu mực hiển thị trên nền nhấn nhạt |
| `accent-soft` | `#dcede8` | `#123a33` | Nền trạng thái đang chọn hoặc hàng kích hoạt |
| `on-accent` | `#f4fbf7` | `#06201b` | Văn bản và biểu tượng trên nền accent đặc |
| `highlight` | `#dde84a` | `#d7e36a` | Màu đánh dấu ca cần xếp hoặc mục cần xử lý gấp |
| `highlight-ink` | `#1a2008` | `#121505` | Màu chữ hiển thị trên nền highlight |
| `success` | `#15734f` | `#63c79b` | Trạng thái ca hoàn thành hoặc thanh toán thành công |
| `warning` | `#7e5a0f` | `#e0b768` | Trạng thái ca chờ duyệt hoặc cảnh báo hạn thanh toán |
| `danger` | `#b23a2c` | `#f08a7a` | Trạng thái hủy ca, lỗi dữ liệu hoặc hành động phá hủy |
| `info` | `#2f5d8a` | `#8fb8e0` | Trạng thái thông tin chỉ dẫn hoặc ca đã ứng tiền |
| `rail` | `#101613` | `#090f0d` | Nền thanh điều hướng bên (rail navigation) máy tính |
| `rail-ink` | `#eff4ef` | `#eff4ef` | Biểu tượng và chữ trên thanh rail |
| `rail-muted` | `#9aa69e` | `#8b978f` | Biểu tượng và chữ trạng thái mặc định trên rail |
| `rail-hover` | `#1b2521` | `#131a17` | Trạng thái hover mục điều hướng trên rail |
| `rail-line` | `#27332c` | `#1b2521` | Đường kẻ phân chia các khối điều hướng trên rail |

### Nguyên tắc sử dụng màu

1. **Phân định vai trò điểm nhấn:** Token `accent` (Teal) dành cho điều hướng, lựa chọn và nút hành động chính. Token `highlight` (Chartreuse) chỉ dùng để cảnh báo trạng thái cần xếp ca, không dùng cho nút bấm chính.
2. **Không dùng màu làm tín hiệu duy nhất:** Mọi trạng thái nghiệp vụ (thành công, cảnh báo, hủy ca) luôn phải kết hợp chữ hoặc nhãn biểu tượng đi kèm.
3. **Độ tương phản chữ trên nền:** Chữ hiển thị trên nền `accent` đặc bắt buộc dùng `on-accent`. Chữ hiển thị trên nền `highlight` đặc bắt buộc dùng `highlight-ink`.
4. **Không hardcode mã màu:** Toàn bộ thành phần bắt buộc sử dụng CSS class ngữ nghĩa (`bg-surface`, `text-ink`, `border-line`, `bg-accent`, `text-highlight-ink`...). Không sử dụng mã màu trực tiếp ngoài token.

---

## 3. Typography

Hệ thống kiểu chữ gồm hai phông chữ chuyên biệt: **IBM Plex Sans** bảo đảm khả năng đọc văn bản giao diện rõ ràng và **IBM Plex Mono** mô phỏng kiểu in sổ sách cơ học cho các trường dữ liệu định lượng.

| Cấp bậc | Phông chữ | Cỡ chữ | Trọng số (Weight) | Độ cao dòng | Khoảng cách chữ | Vai trò áp dụng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | IBM Plex Sans | 28px (1.75rem) | 600 | 1.2 | -0.02em | Tiêu đề trang chính |
| `text-title` | IBM Plex Sans | 18px (1.125rem) | 600 | 1.4 | -0.01em | Tiêu đề phân đoạn, tiêu đề modal |
| `text-body` | IBM Plex Sans | 16px (1rem) | 400 | 1.5 | 0 | Nội dung văn bản chính, ô nhập liệu |
| `text-body-sm` | IBM Plex Sans | 14px (0.875rem) | 500 | 1.5 | 0 | Nội dung bảng, nút bấm, danh sách |
| `text-label` | IBM Plex Sans | 12px (0.75rem) | 400 | 1.4 | 0 | Chú thích, nhãn gợi ý (hint), nhãn phụ |
| `text-mono-label` | IBM Plex Mono | 11px (0.6875rem) | 500 | 1.4 | 0.02em | Tiêu đề cột bảng, thẻ tag, scope eyebrow |
| `text-data` | IBM Plex Mono | 22px (1.375rem) | 500 | 1.2 | -0.02em | Chỉ số KPI, giá trị tiền tệ lớn |

### Nguyên tắc định dạng chữ

1. **Phân định Sans và Mono:** Dùng `IBM Plex Sans` cho toàn bộ văn bản đọc, mô tả và nhãn trường. Dùng `IBM Plex Mono` cho số liệu, tiền tệ, ngày tháng, mã định danh ca và chỉ số KPI.
2. **Kích hoạt Tabular Nums:** Toàn bộ dữ liệu số và thời gian hiển thị trong bảng hoặc danh sách bắt buộc sử dụng thuộc tính `tabular-nums` để bảo đảm độ thẳng hàng theo cột.
3. **Quy chuẩn viết hoa:** Sử dụng Sentence case cho tiêu đề và nội dung; không viết hoa toàn bộ câu. Chỉ các nhãn phân loại ngắn dạng `text-mono-label` mới được sử dụng chữ in hoa (uppercase).
4. **Hạn chế họ phông:** Không bổ sung bất kỳ họ phông chữ nào ngoài cặp IBM Plex.

---

## 4. Layout

Hệ thống bố cục được xây dựng dựa trên nhịp lưới 4px kết hợp micro-spacing, mô phỏng cấu trúc lưới sổ sách vận hành với các đường kẻ hairline phân chia không gian.

### Thang khoảng cách (Spacing Scale)

- **Micro Spacing:** `micro-1` (2px), `micro-2` (6px) – dùng cho khoảng cách giữa biểu tượng và nhãn, padding trong thẻ tag.
- **Layout Spacing:** `xxs` (4px), `xs` (8px), `sm` (12px), `md` (16px), `lg` (20px), `xl` (24px), `xxl` (32px), `huge` (48px), `section` (64px).

### Lưới hiển thị và Điểm ngắt (Responsive Breakpoints)

| Breakpoint | Chiều rộng | Bố cục và Hành vi hiển thị |
| :--- | :--- | :--- |
| **Mobile** | < 768px | Lề trang 16px; thanh điều hướng đáy (Bottom Navigation) 5 tab; bảng sổ ca chuyển sang dạng hàng xếp dọc có nhãn; lưới KPI 1–2 cột; hộp thoại mở dưới dạng bảng trượt đáy (bottom sheet); chiều cao sử dụng đơn vị `dvh` và tôn trọng safe-area. |
| **Tablet** | 768px – 1023px | Lề trang 24px; lưới lịch mở rộng toàn màn hình với agenda đặt phía dưới; thanh điều hướng đáy chuyển sang thanh rail bên trái 76px; bảng dữ liệu bắt đầu mở rộng dạng bảng nhiều cột. |
| **Desktop** | 1024px – 1279px | Thanh điều hướng rail cố định 76px; bảng ca hiển thị đầy đủ các cột số liệu và thao tác; hộp thoại hiển thị ở trung tâm màn hình; khung chứa nội dung giới hạn tối đa tại 1400px (màn hình Cài đặt giới hạn tại `max-w-3xl`). |
| **Wide Desktop** | ≥ 1280px | Khung chứa giới hạn tối đa 1400px; lưới lịch và khung chi tiết agenda đặt song song cạnh nhau. |

---

## 5. Elevation & Depth

Thiết kế loại bỏ hoàn toàn các bóng đổ mềm (soft blur shadows) thường thấy trên giao diện số, thay thế bằng độ tương phản bề mặt và các đường chỉ hairline mảnh.

### Cấu trúc phân lớp

1. **Lớp nền (Base Plane):** Token `canvas` là bề mặt sâu nhất.
2. **Lớp thành phần (Component Plane):** Token `surface` dùng cho các khối sổ ca, bảng dữ liệu và biểu mẫu.
3. **Lớp nổi (Floating Plane):** Token `surface-2` dùng cho hàng hover, menu thả xuống, bảng trượt và hộp thoại modal.
4. **Đường phân cách (Hairline Separation):**
   - `line`: Đường hairline mảnh phân tách các hàng trong bảng, phân chia cột và tạo viền bao quanh các thành phần nhập liệu.
   - `line-strong`: Định hình đường bao ngoài dải KPI hoặc phân định các vùng cấu trúc quan trọng.
5. **Chỉ thị trạng thái nổi và Focus:**
   - Trạng thái được chọn (Selected): Sử dụng nền `accent-soft` kết hợp đường viền `accent`, không nâng khối phần tử.
   - Vòng tiêu điểm (Focus Ring): Đường viền 2px có khoảng đệm (offset); sử dụng màu `accent` trên nền canvas/surface, màu `highlight` trên thanh rail.
   - Lớp phủ mờ (Scrim Overlay): Token `scrim` với độ mờ 70% khi kích hoạt hộp thoại.

---

## 6. Shapes

Hệ thống hình học duy trì sự đồng nhất về các góc cạnh sắc nét nhằm giữ vững tính chất kỷ luật của sổ sách kế toán.

| Token | Giá trị | Phạm vi áp dụng |
| :--- | :--- | :--- |
| `rounded.control` | 2px | Nút bấm, ô nhập liệu, hộp tìm kiếm, menu dropdown, bộ chọn thời gian |
| `rounded.card` | 2px | Khung sổ ca, khối nội dung bảng, panel chi tiết |
| `rounded.dialog` | 2px | Khung hộp thoại modal trung tâm và bảng trượt đáy (bottom sheet) |
| `rounded.tag` | 2px | Thẻ nhãn trạng thái và phân loại ca |
| `rounded.full` | 9999px | Ảnh đại diện (avatar) của nhân sự |

### Quy tắc định hình

- Toàn bộ các góc cạnh thành phần điều khiển cố định bán kính 2px; không áp dụng bán kính bo tròn lớn (4px, 8px, 16px).
- Ảnh đại diện tròn (9999px) là ngoại lệ duy nhất trong toàn hệ thống.

---

## 7. Components

Mỗi thành phần là một hợp đồng giao diện chuẩn mực, bảo đảm tính tiếp cận và khả năng tương tác.

### Button & IconButton

- **Phân loại biến thể:**
  - `button-primary`: Nền `accent`, chữ `on-accent`, dành cho hành động chính trên màn hình.
  - `button-secondary`: Nền `surface-2`, chữ `ink`, dành cho hành động phụ.
  - `button-outline`: Nền trong suốt, viền `line`, chữ `ink`.
  - `button-danger`: Nền `danger`, chữ trắng, dành cho thao tác hủy hoặc xóa dữ liệu.
- **Quy chuẩn tương tác:**
  - Chiều cao tối thiểu 44px (`min-h-11`) bảo đảm vùng chạm cảm ứng.
  - Trạng thái đang xử lý (loading) thay thế biểu tượng bằng con quay (spinner 16px) tại chỗ, giữ nguyên kích thước nút và kích hoạt `aria-busy="true"`.
  - Mọi IconButton không chứa chữ hiển thị bắt buộc phải có thuộc tính `aria-label` mô tả hành động.

### TextField, SearchField & TimePicker

- **Kiểu hiển thị:** Chiều cao tối thiểu 44px; nền `surface`, viền `line`, bo góc 2px.
- **Bố cục nhãn:** Nhãn hiển thị đặt phía trên ô nhập liệu; dòng chú thích (hint) hoặc thông báo lỗi đặt ngay phía dưới.
- **Hộp tìm kiếm (`SearchField`):** Biểu tượng tìm kiếm bên trái, nút xóa nội dung (clear) 44px bên phải.
- **Báo lỗi:** Thông báo lỗi hiển thị với màu `danger`, liên kết với ô nhập liệu qua thuộc tính `aria-invalid="true"` và `aria-describedby`.

### Checkbox, Switch & Radio

- Xây dựng trên nền tảng Radix UI primitives.
- Vùng chạm tối thiểu đạt 44px thông qua nhãn (label) đi kèm hoặc diện tích toàn hàng.

### Tag & Status Chip

- Sử dụng kiểu chữ `text-mono-label` (11px, chữ in hoa), đường viền `line` và nền nhạt `surface-2`.
- Tag chỉ dùng để biểu thị trạng thái (ví dụ: đã duyệt, chờ xử lý, đã ứng tiền) hoặc phân loại ca; không sử dụng thay thế cho nút bấm có tương tác lớn.

### Dropdown, TimePicker & MultiSelect

- Nút kích hoạt (trigger) có chiều cao tối thiểu 44px.
- Bảng danh sách chọn hiển thị trên nền `surface-2`, viền `line`, hỗ trợ đầy đủ điều hướng bằng phím mũi tên, Enter và Escape.

### Ledger Row & Table

- Thiết kế phẳng hoàn toàn, ngăn cách giữa các hàng bằng đường kẻ `line`.
- Trạng thái hover đổi màu nền sang `surface-2`.
- Cột số liệu và hành động có độ rộng cố định; các nút thao tác nhanh trên hàng đạt kích thước tối thiểu 44px.

### KPI Strip

- Khối hiển thị các chỉ số vận hành chính (tổng ca, giờ làm, công nợ).
- Cấu trúc lưới phẳng, đường viền đỉnh 2px màu `ink`, số liệu hiển thị bằng kiểu chữ `text-data` (IBM Plex Mono).
- Ô có chỉ số cần chú ý hoặc cảnh báo được gắn nền `highlight` (Chartreuse).

### Modal, Sheet & Dialog

- Xây dựng trên nền tảng Radix Dialog.
- Trên thiết bị di động hiển thị dưới dạng bảng trượt đáy (bottom sheet); trên máy tính hiển thị hộp thoại trung tâm với chiều cao tối đa `85dvh`.
- Chân trang (footer) luôn cố định hiển thị nút hành động; nút đóng có kích thước 44px.
- Nghiêm cấm thiết kế mở hộp thoại chồng lên hộp thoại khác.

### Calendar Grid & Agenda

- Lưới tháng hiển thị cấu trúc 42 ô, quy ước Thứ Hai là ngày đầu tuần.
- Mỗi ô ngày là một `gridcell`, chứa số ngày dạng mono và các chip biểu thị ca làm việc.
- Khi chuyển sang màn hình nhỏ, lịch hiển thị điểm chấm màu chỉ thị (dot) và danh sách chi tiết (agenda) dạng cuộn phía dưới.

### Toast & Thông báo hệ thống

- Xây dựng trên Radix Toast, giới hạn nội dung trong 1 dòng kèm biểu tượng trạng thái.
- Thông báo nổi dùng cho các xác nhận hành động toàn cục; không sử dụng toast để báo lỗi của các trường nhập liệu đơn lẻ.

### Skeleton & Loading

- Khung xương (skeleton) sử dụng hiệu ứng chuyển động sáng nhẹ (shimmer 1.6s).
- Cấu trúc khung xương bắt buộc mô phỏng chính xác lưới, tỷ lệ và hình dáng của dòng sổ (ledger row), thẻ KPI hoặc ô lịch để chống hiện tượng giật bố cục (CLS).

---

## 8. Do’s and Don’ts

Bảng đối chiếu các nguyên tắc thiết kế bắt buộc và cấm kỵ trong toàn bộ hệ thống:

| Do | Don't |
| :--- | :--- |
| Sử dụng đường kẻ hairline và màu nền `surface-2` để phân tầng thị giác. | Không sử dụng bóng đổ mềm (soft blur shadow) để nâng nổi phần tử. |
| Duy trì `accent` (Teal) cho hành động và `highlight` (Chartreuse) cho việc cần xử lý. | Không dùng màu chartreuse làm màu nút bấm chính hoặc tràn lan trên giao diện. |
| Sử dụng `IBM Plex Mono` cho số liệu, tiền tệ, ngày tháng và chỉ số KPI. | Không dùng phông Mono cho đoạn văn bản dài hoặc nhãn trường nhập liệu. |
| Kích hoạt thuộc tính `tabular-nums` cho mọi cột số liệu trong bảng. | Không để số liệu căn chỉnh tự do gây lệch hàng khi hiển thị danh sách. |
| Duy trì vùng chạm tối thiểu 44×44px cho toàn bộ nút bấm và thành phần điều khiển. | Không tạo nút bấm hoặc biểu tượng có vùng nhấn nhỏ dưới 44px trên thiết bị di động. |
| Cố định bán kính bo góc 2px cho mọi thành phần điều khiển và khung chứa. | Không sử dụng bán kính bo góc lớn (4px, 8px) hoặc trộn lẫn nhiều loại bo góc. |
| Luôn kèm chữ hoặc nhãn biểu tượng khi thể hiện trạng thái ca làm việc. | Không sử dụng chấm màu đơn độc làm tín hiệu duy nhất để truyền tải trạng thái. |
| Tham chiếu mọi giá trị màu sắc và khoảng cách qua token trong `src/index.css`. | Không viết mã màu trực tiếp (hex/rgb) hoặc số đo tùy tiện trong mã nguồn component. |
| Thiết kế khung xương (skeleton) mô phỏng chính xác bố cục của bảng và danh sách. | Không sử dụng con quay tải trang (spinner) chiếm toàn màn hình thay cho khung xương. |
| Chuyển đổi bảng dữ liệu thành dạng danh sách xếp dọc có nhãn trên màn hình nhỏ. | Không ép buộc bảng nhiều cột cuộn ngang phức tạp trên màn hình di động hẹp. |
