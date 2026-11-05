# ShiftPay

Quản lý lịch sự kiện, xếp ca làm việc và thanh toán thù lao cho nhân sự sự kiện.

## Language

**Sự kiện (Event)**:
Một buổi tổ chức hoặc tiệc diễn ra tại một địa điểm vào một ngày cụ thể, bao gồm tối đa hai ca làm việc.
_Avoid_: Buổi tiệc, công việc, show

**Ca làm (Shift)**:
Đơn vị làm việc được phân công cho một nhân viên trong một buổi của sự kiện, gồm ca sáng hoặc ca chiều.
_Avoid_: Giờ làm, suất làm, slot, buổi làm

**Nhân viên (Employee)**:
Người tham gia làm việc theo ca sự kiện và nhận thù lao từ người quản lý.
_Avoid_: Nhân sự, người làm, cộng tác viên, account

**Địa điểm (Location)**:
Nơi tổ chức sự kiện, chứa thông tin địa chỉ và ghi chú đánh giá độ thuận tiện phục vụ xếp lịch.
_Avoid_: Nhà hàng, sảnh, venue

**Phụ phí (Surcharge)**:
Khoản tiền bổ sung ngoài lương cơ bản của sự kiện, được chia đều hoặc chỉ định cho nhân viên cụ thể.
_Avoid_: Thưởng, tiền tip, hoa hồng, bonus

**Thanh toán (Payment)**:
Giao dịch chi trả thù lao cho các ca làm việc chưa thanh toán của nhân viên.
_Avoid_: Trả lương, gửi tiền, giải ngân

**Ứng lương (Advance)**:
Giao dịch chi trả trước tiền công cho ca làm việc trước kỳ thanh toán chính thức.
_Avoid_: Tạm ứng, vay, mượn

**Quyết toán (Settlement)**:
Giao dịch chốt sổ nhằm cấn trừ các khoản ứng lương và tất toán thù lao tồn đọng.
_Avoid_: Thanh lý, tất toán sổ, chốt lương

**Sổ lương (Payroll)**:
Bảng tổng hợp thù lao chưa trả, tiền đã ứng và số tiền thực nhận của toàn bộ nhân viên.
_Avoid_: Bảng lương, danh sách lương

**Thù lao chưa trả (Unpaid Earnings)**:
Số tiền người quản lý còn phải trả cho nhân viên từ các ca làm việc đã hoàn thành.
_Avoid_: Công nợ, nợ lương, nợ tồn

**Dư nợ ứng (Advance Debt)**:
Khoản tiền nhân viên đã ứng vượt quá tổng thù lao kiếm được, cần hoàn trả hoặc cấn trừ vào các ca sau.
_Avoid_: Nợ xấu, tiền phạt

