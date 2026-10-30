# Xây dựng lại giao diện ShiftPay (v2)

Status: in-progress

## Vấn đề

Giao diện ShiftPay đã được dựng lại một lần theo hướng "Thẻ ca" nhưng vẫn chưa đạt: nhận diện chưa đủ cá tính, trải nghiệm và bố cục còn theo nếp cũ, nền token/primitive chưa đủ chuẩn để mở rộng. Người dùng yêu cầu đập đi làm lại toàn bộ theo chuẩn UI/UX, không dựa vào tài liệu thiết kế cũ.

## Kết quả

Một giao diện mới hoàn chỉnh cho 7 màn hình và toàn bộ trạng thái, đi cùng bộ nhận diện mới lấy nội dung logo hiện tại làm gốc. Nền kỹ thuật là token Tailwind v4 + primitive dựa trên Radix cho widget phức tạp. Mọi quyết định được ghi lại trong spec, ticket và `DESIGN.md` cuối cùng.

## Quyết định đã chốt

| Chủ đề | Quyết định |
| --- | --- |
| Động lực | Rebuild toàn diện: thẩm mỹ, trải nghiệm, kỹ thuật |
| Phạm vi sản phẩm | Được đổi IA, luồng và pattern từng màn; giữ đủ tính năng hiện có |
| Nhận diện | Hướng mới hoàn toàn, frontend-design dẫn dắt; ui-ux-pro-max làm luật chất lượng |
| Logo | Giữ nguyên nội dung favicon: waiter bưng khay, vòng tròn, "AT"; cân lại tỷ lệ; không thêm/bớt thành phần |
| Monogram | "AT" là chi tiết cố định trong logo (công ty Anh Thư) |
| Wordmark | "ShiftPay" vẽ custom, serif hiện đại |
| Tên hiển thị | Chỉ ShiftPay; AT sống trong logo |
| Màu logo | Đồng bộ với accent của hướng UI được chọn; chưa chốt màu |
| Thứ tự | Logo treatments → chọn mark → 3 hướng UI → chọn hướng/accent → logo kit |
| Thiết bị | Mobile và desktop ngang nhau, không bên nào là bản phụ |
| Theme | Theo system, có toggle thủ công và lưu lựa chọn; thiết kế đủ light/dark |
| Component | Radix cho widget tương tác phức tạp (dialog, dropdown/combobox, switch, checkbox, tabs, tooltip, popover, toast); tự viết button/input/card/layout |
| Ngôn ngữ | Giao diện tiếng Việt; font phải phủ đủ dấu ở mọi weight dùng |
| Typography | Mỗi hướng UI thử một cặp font khác nhau, đều kiểm tra tiếng Việt |
| Motion | Micro-interaction + đúng một khoảnh khắc có chủ đích mỗi màn |
| Trạng thái | Đầy đủ: empty, loading/skeleton, error, offline/PWA, splash, toast, modal |
| Cổng chất lượng | WCAG 2.2 AA cứng; 4 breakpoint 375/768/1024/1440; iOS Safari, Android Chrome, desktop Chrome/Edge |
| Quy trình | Spec + ticket trong `.scratch/ui-rebuild-v2/`; nhánh riêng từ `main`; commit theo ticket; một PR cuối |
| Tài liệu cũ | Không dùng làm tham chiếu thiết kế; chỉ dùng sự thật kỹ thuật của repo |

## Phạm vi

### 1. Nhận diện

- 3 treatment logo cùng nội dung (waiter, khay, vòng tròn, AT), khác mức tinh chỉnh và tỷ lệ; trình bày đen trắng trước.
- Sau khi chọn mark: dựng wordmark custom, logo kit (một màu, đảo, lockup ngang/dọc, bản nhỏ, favicon + app icon), hướng dẫn dùng tối thiểu.
- Màu logo lấy từ accent của hướng UI được chọn.

### 2. Hướng giao diện

- 3 hướng độc lập, mỗi hướng gồm: Dashboard desktop light + Lịch sự kiện mobile dark, một cặp font tiếng Việt, một accent, logo đã chọn.
- Mỗi hướng kèm rationale ngắn; người dùng chọn đúng một hướng.

### 3. Nền tảng

- Token Tailwind v4 CSS-first: primitive → semantic; đủ color, type, spacing, radius, motion, focus.
- Primitive: Radix cho widget phức tạp; phần trình bày tự viết. Gallery để duyệt trước khi lên màn.
- Shell: sidebar desktop, bottom nav mobile, offline indicator, splash, pull-to-refresh, toast, scroll-to-top.
- Theme theo system, toggle ghi đè và lưu; áp theme trước first paint.

### 4. Màn hình

Dashboard, Lịch sự kiện, Địa điểm, Nhân sự, Thanh toán, Cài đặt, Đăng nhập. Được sắp xếp lại bố cục và luồng nếu tốt hơn; không thêm/bớt tính năng.

## Ngoài phạm vi

- Tính năng mới, thay đổi Firebase/Firestore rules, API, dữ liệu.
- Đa ngôn ngữ, cổng nhân viên, thay thư viện chart (giữ Recharts, chỉ restyle).
- Tài liệu thiết kế cũ và các hướng đã bị loại.

## Chuẩn thiết kế

- ui-ux-pro-max: accessibility, touch target 44px, trạng thái form, navigation, motion, checklist trước giao.
- Web Interface Guidelines: focus, keyboard, form semantics, copy, performance.
- Tailwind v4: token CSS-first, không hardcode màu ngoài token.
- frontend-design: cá tính riêng, tránh mặc định template; một điểm nhấn mạnh, phần còn lại kỷ luật.

### UX writing

- Empty state dùng chung `EmptyState`: icon + title + một dòng giải thích; action optional, tối đa một và không lặp CTA đã có ở header.
- "Chưa có..." cho chưa có dữ liệu; "Không có..." cho hàng đợi đã sạch. Không dùng "đã đủ..." khi chưa có dữ liệu để đủ.
- Nêu phạm vi tuần/tháng khi màn trộn hai phạm vi.
- KPI: note nêu trạng thái/ngữ cảnh, không lặp đơn vị; highlight chỉ khi thực sự có việc.
- Số đếm không leading zero. CTA dùng đúng nhãn hành động đích. Câu ngắn, sentence case, không exclamation.

## Trình tự và gate

1. **Logo treatments** — chọn mark.
2. **3 hướng UI** — chọn hướng + accent.
3. **Logo kit** — hoàn thiện màu/variant theo accent đã chọn.
4. **Token + primitive + gallery** — duyệt visual của control trước khi lên màn.
5. **Shell** — duyệt khung desktop/mobile.
6. **Từng màn** — duyệt theo ticket.
7. **Final sweep** — accessibility, responsive, trạng thái, hiệu năng, `DESIGN.md`.

Mỗi gate dừng lại chờ người dùng xác nhận. Không commit khi gate chưa duyệt, trừ khi người dùng yêu cầu.

## Cổng chất lượng

- WCAG 2.2 AA: contrast 4.5:1 cho text thường, 3:1 cho text lớn; focus-visible; keyboard không bẫy; target ≥ 44×44; reduced-motion.
- Không lỗi TypeScript, ESLint, build; lint/format sạch.
- Không màu hardcode ngoài token; primitive không tự định nghĩa màu.
- Kiểm tra thật trên trình duyệt ở 375/768/1024/1440; ghi rõ phần chưa kiểm được.

## Ghi chú

- Logo hiện tại là raster 234×234 (favicon) và PNG wordmark; mark mới là SVG vẽ lại, giữ đúng nội dung.
- Không có bộ test UI; xác minh bằng build/lint + kiểm tra trình duyệt.
