<div align="center">
  <img src="public/brand/lockup.svg" alt="ShiftPay" width="360" />
  <h1>ShiftPay</h1>
  <p><strong>Ca làm rõ ràng. Lương minh bạch.</strong></p>
  <p>Lịch sự kiện, phân công ca và thanh toán trong một cuốn sổ vận hành duy nhất.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Firebase-12.6-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Zustand-5.0-black?style=flat-square&logo=react&logoColor=white" alt="Zustand" />
    <img src="https://img.shields.io/badge/License-Internal_Use-green?style=flat-square" alt="Internal use" />
  </p>
</div>

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Cách hoạt động](#cách-hoạt-động)
- [Dành cho ai](#dành-cho-ai)
- [Kiến trúc](#kiến-trúc)
- [Công nghệ](#công-nghệ)
- [Cài đặt](#cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Chạy dự án](#chạy-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Giới thiệu

Công việc làm ca thường nằm rải rác giữa bảng tính, tin nhắn và sổ tay. Người quản lý phải mở nhiều nơi mới biết hôm nay ai làm, sự kiện nào còn thiếu người và ai chưa nhận lương.

ShiftPay gom những việc đó vào một chỗ:

- Lịch sự kiện theo tháng, kèm danh sách ca của từng ngày.
- Phân công ca sáng/chiều và nhìn ngay sự kiện nào còn trống.
- Theo dõi công nợ, tiền đã ứng và thanh toán theo từng nhân viên.
- Dữ liệu cập nhật realtime; cài được lên thiết bị và dùng theme theo hệ thống.

<img src="docs/images/mockup.jpg" alt="Lịch sự kiện và Sổ lương của ShiftPay trên mobile" width="100%" />

## Tính năng

### Lịch sự kiện

Xem cả tháng trong một lưới gọn. Chọn một ngày để xem sự kiện, giờ, địa điểm và số ca. Sự kiện chưa có người được đánh dấu để không bị bỏ sót.

### Phân công ca

Mỗi sự kiện có ca sáng và ca chiều. Chọn nhân viên, xem số ca chưa trả của họ và lưu phân công trong một lần.

### Sổ lương

Theo dõi từng người còn bao nhiêu ca chưa trả, đã ứng bao nhiêu và cần thanh toán bao nhiêu. Thanh toán, ứng lương và quyết toán được thực hiện ngay trong sổ.

### Thanh toán QR

Tạo mã VietQR đúng số tiền từ tài khoản ngân hàng của nhân viên. Mỗi giao dịch được lưu lại để đối soát sau.

### Địa điểm và nhân sự

Lưu địa chỉ, tọa độ và đánh giá địa điểm để lần xếp sau nhanh hơn. Hồ sơ nhân viên có ảnh, số điện thoại và tài khoản nhận lương.

### Dùng như một ứng dụng

Cài ShiftPay lên màn hình chính, dùng theme theo hệ thống hoặc chọn sáng/tối. Khi mất mạng, ứng dụng vẫn mở được shell đã lưu và báo trạng thái ngoại tuyến.

## Cách hoạt động

1. **Tạo sự kiện:** chọn ngày, giờ, địa điểm và mức lương mỗi ca.
2. **Xếp người:** chọn ca sáng/chiều, gán nhân viên và kiểm tra lại danh sách.
3. **Chốt sổ:** xem công nợ, xử lý ứng lương hoặc thanh toán, rồi xuất CSV khi cần.

## Dành cho ai

- Nhà hàng và đơn vị tiệc lưu động cần xếp ca theo từng sự kiện.
- Đội vận hành phải theo dõi nhân sự, địa điểm và lương trong cùng một luồng.
- Người quản lý muốn biết chính xác ai còn ca chưa trả và đã ứng bao nhiêu.

## Kiến trúc

ShiftPay dùng kiến trúc modular frontend kết hợp service-based repository. Logic truy cập dữ liệu nằm trong các service, UI chỉ đọc state và gọi hành động.

Các lớp chính:

1. **Giao diện:** React 19, Tailwind CSS 4, Radix UI, Framer Motion; dữ liệu đầu vào kiểm bằng Zod.
2. **Trạng thái:** Zustand quản lý dữ liệu ứng dụng, phiên đăng nhập và theme.
3. **Dịch vụ:** các service bọc Firestore và API ngoài, xử lý batch/transaction khi ghi dữ liệu.
4. **Dịch vụ ngoài:** Firebase cho dữ liệu và xác thực; VietQR cho mã chuyển khoản; ImgBB cho ảnh đại diện; LocationIQ cho bản đồ.

## Công nghệ

React 19 · TypeScript · Vite · Firebase · Tailwind CSS 4 · Radix UI · Zustand · Framer Motion.

## Cài đặt

Yêu cầu:

- Node.js `>= 20`
- npm `>= 10`
- Git

```bash
git clone https://github.com/dexter826/at_shiftpay.git
cd at_shiftpay
npm install
```

## Cấu hình môi trường

Sao chép tệp mẫu rồi điền giá trị:

```bash
cp .env.example .env
```

```env
# Firebase (bắt buộc)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# ImgBB (bắt buộc khi upload ảnh đại diện)
VITE_IMGBB_API_KEY=

# LocationIQ (tùy chọn)
VITE_LOCATIONIQ_API_KEY=
```

| Biến | Trạng thái | Mô tả |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Bắt buộc | Khóa API Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Bắt buộc | Domain xác thực Firebase. |
| `VITE_FIREBASE_PROJECT_ID` | Bắt buộc | ID dự án Firebase. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bắt buộc | Bucket lưu trữ Firebase. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Bắt buộc | Sender ID của Firebase. |
| `VITE_FIREBASE_APP_ID` | Bắt buộc | App ID của ứng dụng web. |
| `VITE_IMGBB_API_KEY` | Bắt buộc khi upload ảnh | Khóa API ImgBB để upload ảnh đại diện. |
| `VITE_LOCATIONIQ_API_KEY` | Tùy chọn | Khóa LocationIQ cho autocomplete địa chỉ và bản đồ tĩnh. Thiếu key thì dùng fallback. |

Không commit tệp `.env`.

## Chạy dự án

```bash
# Phát triển tại http://localhost:3000
npm run dev

# Đóng gói production
npm run build

# Xem bản production cục bộ
npm run preview

# Kiểm tra chất lượng
npm run lint
npx tsc --noEmit
npm run format:check
```

Dev server dùng cổng `3000` theo `vite.config.ts`.

## Cấu trúc thư mục

```text
at_shiftpay/
├── src/
│   ├── app/             # App shell, router, ErrorBoundary và các route
│   ├── components/      # Layout, UI primitives và component dùng chung
│   ├── features/        # auth, dashboard, calendar, employee, location, payroll, settings
│   ├── dev/             # Gallery dành cho môi trường phát triển
│   ├── lib/             # Firebase, API services, motion và tiện ích
│   ├── stores/          # Zustand: appData, auth, theme
│   ├── types/           # Interface và type dùng chung
│   ├── utils/           # format, payrollMath, validation, cropImage, compare
│   ├── index.css        # Token, theme và style nền
│   └── index.tsx        # Entry point
├── public/              # Brand, favicon, icon, manifest và service worker
├── docs/                # Tài liệu và hình ảnh
├── DESIGN.md            # Design system
├── GLOSSARY.md          # Thuật ngữ nghiệp vụ
├── firebase.json        # Cấu hình Firebase
├── firestore.indexes.json
├── firestore.rules
├── .env.example
└── vite.config.ts
```

`dist/` và `node_modules/` là thư mục sinh ra khi build/cài đặt, không commit.

## Đóng góp

Mở issue hoặc pull request cho thay đổi. Trước khi gửi, chạy lint, type-check, build và format để giữ nhánh sạch.

## Giấy phép

Dự án dùng nội bộ, không nhằm mục đích thương mại.

---

<div align="center">
  Phát triển bởi <a href="https://github.com/dexter826">MOB</a>
</div>
