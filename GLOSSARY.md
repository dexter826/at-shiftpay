# ShiftPay — Glossary

Thuật ngữ dùng trong UI, code và tài liệu. Khi một khái niệm đã có ở đây, dùng đúng từ này; không tạo từ đồng nghĩa mới trong màn hình.

## Thương hiệu

- **ShiftPay** — tên hiển thị duy nhất của sản phẩm. Không hiển thị tên công ty trong UI; “AT” chỉ là chi tiết trong mark.
- **Bảng ca** — tên hướng thiết kế và màn Tổng quan; cũng là cách gọi bảng tuần 2 ca.
- **Sổ** — cách gọi danh sách dạng dòng phẳng: Sổ địa điểm, Sổ nhân sự, Sổ lương.

## Nghiệp vụ

- **Ca** — một lượt làm việc của một nhân viên trong một sự kiện. Chỉ có **Ca sáng** và **Ca chiều**. Đơn vị đếm là **ca**, không dùng “công”.
- **Sự kiện** — một buổi tiệc/việc có ngày, giờ, địa điểm, mức lương và danh sách ca. Tên mặc định khi để trống là **“Tiệc”**.
- **Lịch sự kiện** — màn tháng + agenda ngày.
- **Cần xếp** — sự kiện chưa có ca nào được phân công.
- **Phân công** — gán nhân viên vào ca của sự kiện.
- **Chưa trả** — ca có `status = unpaid`, chưa được chi trả.
- **Đã ứng** — ca có `status = advanced`, nhân viên đã nhận tiền trước.
- **Đã trả** — ca có `status = paid`, đã chốt.
- **Công nợ** — tổng tiền của các ca chưa trả và đã ứng của nhân viên. Đây là nghĩa duy nhất được dùng “công”.
- **Quyết toán ứng lương** — chốt các khoản ứng và đưa toàn bộ ca đang mở của nhân viên về đã trả; phần còn lại ghi vào lịch sử.
- **Thanh toán** — chi trả các ca chưa trả và chuyển chúng sang `paid`.
- **Ứng lương** — chi trước các ca đã chọn; ca chuyển sang `advanced`, chờ quyết toán.
- **Địa điểm** — nơi diễn ra sự kiện; có đánh giá Tốt/Thường/Kém và ghi chú dùng lại.
- **Nhân sự** — người làm ca; có thể có SĐT, ảnh, tài khoản ngân hàng.
- **Tài khoản ngân hàng** — bank BIN/tên, số tài khoản, chủ tài khoản; dùng để tạo QR chuyển khoản.

## Trạng thái & phạm vi

- **Chưa có** — chưa có dữ liệu (ví dụ “Chưa có địa điểm”).
- **Không tìm thấy** — có dữ liệu nhưng bộ lọc/tìm kiếm không khớp.
- **Không có** — hàng đợi/hạng mục đã sạch (ví dụ “Không có công nợ”).
- **Tháng này / tuần này / hiện tại** — phải nêu rõ khi một màn trộn nhiều phạm vi.
- **0 ca** — số thật; trong bảng có thể hiển thị `—` kèm aria “Không có ca chưa trả”, không dùng leading zero.

## Ngày, tiền, đơn vị

- Ngày hiển thị `dd/mm` hoặc `dd/mm/yyyy`; ngày lưu `YYYY-MM-DD`; giờ `HH:mm`.
- Tiền dùng VND, định dạng `vi-VN` (`250.000 ₫`); tính toán từ `shift.amount`, làm tròn khi chốt.
- Lương mỗi ca là mức mặc định cho ca mới; có thể sửa từng sự kiện.
- Phụ phí là thành phần đã nằm trong `shift.amount`, không cộng thêm lần nữa.

## Copy conventions

- Tiếng Việt, sentence case, câu ngắn, không exclamation.
- Xưng “bạn” với người dùng; không dùng thuật ngữ kỹ thuật (field, token, API, Firebase).
- Nút dùng động từ đích: “Thêm sự kiện”, “Lưu thay đổi”, “Xóa tài khoản”, “Ứng lương”, “Quyết toán”.
- Lỗi nêu việc cần làm: “Nhập họ tên.”, “Thử lại.”; không đổ lỗi mơ hồ.
- Không dùng “công” cho số ca; không quảng cáo tính năng không có (chấm công/giờ công).
- Một CTA chính mỗi trạng thái; empty state không lặp CTA đã có ở header.
