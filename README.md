<div align="center">
  <img src="public/brand/lockup.svg" alt="ShiftPay Logo" width="360"/>
  <h3>Quản lý ca làm, lịch sự kiện và thanh toán</h3>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Firebase-12.6-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Zustand-5.0-black?style=flat-square&logo=react&logoColor=white" alt="Zustand" />
    <img src="https://img.shields.io/badge/License-Internal_Use-green.svg?style=flat-square" alt="License" />
  </p>
</div>

---

## 📖 Mục lục

1. [Giới thiệu](#-giới-thiệu)
2. [Tính năng chính](#-tính-năng-chính)
3. [Kiến trúc tổng quan](#-kiến-trúc-tổng-quan)
4. [Cài đặt](#-cài-đặt)
5. [Chạy project](#-chạy-project)
6. [Env configuration](#-env-configuration)
7. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
8. [Hướng dẫn đóng góp](#-hướng-dẫn-đóng-góp)

---

## 1. 🌟 Giới thiệu

**ShiftPay** là cuốn sổ vận hành cho đội ngũ làm ca: xếp lịch sự kiện, phân công ca sáng/chiều, quản lý địa điểm và chốt lương minh bạch. Ứng dụng phù hợp nhà hàng, sự kiện và tiệc lưu động.

### Điểm nổi bật

- **⚡ Hiệu suất cao:** Xây dựng trên nền tảng React 19 và Vite mới nhất.
- **🌐 PWA & offline shell:** Cài lên thiết bị, có màn hình chờ, chỉ báo ngoại tuyến và cache shell để mở lại nhanh.
- **💳 Chạm thanh toán:** Tự động tạo mã QR chuyển khoản chính xác đến từng đồng qua hệ thống VietQR.

---

## 2. 🚀 Tính năng chính

```mermaid
mindmap
  root((ShiftPay))
    Quản lý Nhân sự
      Hồ sơ & Tài khoản
      Lọc & Tìm kiếm
    Quản lý Địa điểm
      Lưu trữ địa chỉ
      Đánh giá & Ghi chú
    Lịch & Sự kiện
      Lịch làm việc
      Trạng thái & Dự toán
    Phân công ca
      Ca sáng & ca chiều
      Gán nhân viên
    Tài chính & Lương
      Công nợ & ứng lương
      Thanh toán VietQR
      Lịch sử giao dịch
    Sổ lương & xuất dữ liệu
      KPI công nợ
      Xuất CSV
```

- **👥 Nhân sự & Hồ sơ:** Quản lý thông tin cá nhân, tài khoản ngân hàng và tìm kiếm nhân viên.
- **📍 Địa điểm làm việc:** Quản lý danh sách điểm tổ chức, đánh giá chất lượng và ghi chú đặc thù.
- **📅 Lịch & Sự kiện:** Giao diện trực quan theo dõi tiến độ sự kiện, liên kết địa điểm và dự toán chi phí.
- **⏰ Phân công ca:** Gán nhân viên vào ca sáng/chiều của từng sự kiện, theo dõi ca chưa xếp và số người.
- **💳 Tài chính & Quyết toán:** Tổng hợp công nợ, quản lý ứng lương, tạo mã QR thanh toán qua VietQR và lưu lịch sử giao dịch.
- **📊 Sổ lương & xuất dữ liệu:** KPI công nợ theo nhân viên, chi tiết ca và xuất báo cáo CSV.
- **🎨 Trải nghiệm UI/UX:** Rail desktop + bottom nav mobile, theme Theo hệ thống/Sáng/Tối, PWA và trạng thái loading/empty/offline.

<br>

<img src="docs/images/mockup.jpg" alt="Mockup ứng dụng" width="100%">

---

## 3. 🏗️ Kiến trúc tổng quan

ShiftPay ứng dụng kiến trúc **Modular Frontend** kết hợp **Service-based Repository**, tách biệt hoàn toàn logic tương tác dữ liệu khỏi giao diện hiển thị.

```mermaid
flowchart TB
    subgraph UI["Giao diện (React 19)"]
        Pages["Trang (Dashboard, Sự kiện, Nhân sự...)"]
        Modals["Modals & Dialogs"]
        Components["UI Components (Button, Form...)"]
    end

    subgraph State["Trạng thái (Zustand)"]
        AppData["appDataStore (Dữ liệu Offline)"]
        AuthStore["authStore (Phiên Đăng nhập)"]
        ThemeStore["themeStore (Theo hệ thống/Sáng/Tối)"]
    end

    subgraph Services["Tầng Dịch vụ (Singleton Logic)"]
        EmpServ["employeeService"]
        EvtServ["eventService"]
        LocServ["locationService"]
        PmtServ["paymentService"]
        ShfServ["shiftService"]
        SetServ["settingsService"]
    end

    subgraph External["Dịch vụ Bên ngoài"]
        Firebase["Firebase (Firestore & Auth)"]
        VietQR["VietQR API (Mã QR)"]
        ImgBB["ImgBB API (Lưu ảnh Cloud)"]
        LocIQ["LocationIQ API (Bản đồ)"]
    end

    UI <-->|Subscribe & Dispatch| State
    UI -->|Gọi Service| Services
    Services <-->|Đồng bộ & Cache| State
    Services <-->|REST / SDK API| External

    classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#f9fafb;
    classDef highlight fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#ffffff;
    classDef storage fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff;
    class External storage;
    class State highlight;
```

1. **Presentation Layer:** Kết xuất giao diện (React 19, Tailwind CSS, Framer Motion) và kiểm tra dữ liệu đầu vào (`Zod`).
2. **State Management:** Lưu trữ trạng thái toàn cục với Zustand, phân tách rõ ràng giúp tối ưu hóa hiệu suất.
3. **Service Layer:** Cầu nối xử lý nghiệp vụ, giao tiếp với cơ sở dữ liệu và tự động thử lại (retry logic) khi mạng chập chờn.
4. **Backend & Cloud:** Cơ sở dữ liệu thời gian thực và quản lý định danh qua Firebase, tích hợp các API hình ảnh và cổng thanh toán.

---

## 4. ⚙️ Cài đặt

- **Node.js:** `>= 20.0.0`
- **npm:** `>= 10.0.0`
- **Git:** Đã cài đặt trên hệ thống.

```bash
# 1. Clone repository
git clone https://github.com/dexter826/at_shiftpay.git
cd at_shiftpay

# 2. Cài đặt thư viện phụ thuộc
npm install
```

---

## 5. 🏃 Chạy project

```bash
# Khởi động máy chủ phát triển (http://localhost:5173)
npm run dev

# Kiểm tra lỗi kiểu TypeScript và đóng gói Production
npm run build

# Xem trước phiên bản Production cục bộ
npm run preview
```

> [!NOTE]
> Môi trường phát triển hỗ trợ tính năng HMR (Hot Module Replacement) giúp cập nhật giao diện ngay lập tức khi chỉnh sửa mã nguồn.

---

## 6. 🔐 Env configuration

Tạo tệp `.env` tại thư mục gốc của dự án (ngang hàng `package.json`) với cấu trúc mẫu sau:

```env
# 1. CẤU HÌNH HỆ THỐNG FIREBASE (BẮT BUỘC)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# 2. CẤU HÌNH LƯU TRỮ HÌNH ẢNH (https://api.imgbb.com/)
VITE_IMGBB_API_KEY=your_imgbb_api_key_here

# 3. CẤU HÌNH BẢN ĐỒ (https://locationiq.com/)
VITE_LOCATIONIQ_API_KEY=your_locationiq_api_key_here
```

### Bảng Mô tả Biến Môi trường

| Biến môi trường              | Trạng thái | Mô tả chi tiết                                               |
| :--------------------------- | :--------: | :----------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`      |  Bắt buộc  | Mã khóa API giao tiếp với các dịch vụ Firebase.              |
| `VITE_FIREBASE_AUTH_DOMAIN`  |  Bắt buộc  | Tên miền xác thực (Authentication Domain) của Firebase.      |
| `VITE_FIREBASE_PROJECT_ID`   |  Bắt buộc  | Định danh duy nhất của dự án Firebase.                       |
| `VITE_FIREBASE_STORAGE_...`  |  Bắt buộc  | Địa chỉ đám mây (Storage Bucket) lưu trữ tệp tin.            |
| `VITE_FIREBASE_MESSAGING...` |  Bắt buộc  | Mã định danh người gửi tin nhắn hệ thống.                    |
| `VITE_FIREBASE_APP_ID`       |  Bắt buộc  | Mã định danh ứng dụng web tạo trong Firebase Console.        |
| `VITE_IMGBB_API_KEY`         |  Tùy chọn  | Khóa truy cập API lưu trữ ảnh đại diện trực tiếp lên ImgBB.  |
| `VITE_LOCATIONIQ_API_KEY`    |  Tùy chọn  | Khóa truy cập API hỗ trợ tính năng định vị tọa độ và bản đồ. |

---

## 7. 📁 Cấu trúc thư mục

```text
at_shiftpay/
├── dist/                # Mã nguồn Production đã được tối ưu hóa
├── docs/                # Tài liệu thiết kế và hình ảnh minh họa
├── public/              # Tài nguyên tĩnh công khai (Logo, favicon...)
├── src/                 # KHO MÃ NGUỒN CHÍNH
│   ├── animations/      # Cấu hình hoạt ảnh Framer Motion
│   ├── assets/          # Dữ liệu tĩnh, hoạt ảnh Lottie
│   ├── components/      # KHO COMPONENT REACT (auth, common, layout, modals, pages, ui)
│   ├── constants/       # Hằng số toàn cục, mã màu sắc
│   ├── hooks/           # Custom React Hooks
│   ├── lib/             # Các thư viện bổ trợ
│   ├── services/        # TẦNG DỊCH VỤ (employee, event, location, shift, payment, export...)
│   ├── stores/          # TẦNG TRẠNG THÁI ZUSTAND (appData, auth, theme)
│   ├── utils/           # Các hàm tiện ích format, tính toán
│   ├── App.tsx          # Điểm neo chính kết nối Router và Providers
│   ├── index.css        # Khai báo CSS và Tailwind
│   └── types.ts         # Khai báo toàn bộ Interface & Type TypeScript
├── .env                 # Khai báo biến môi trường cục bộ
├── firebase.json        # Cấu hình quy tắc Firebase Hosting
├── firestore.rules      # Quy tắc phân quyền bảo mật Firestore
└── vite.config.ts       # Cấu hình đóng gói Vite
```

---

## 8. 🤝 Hướng dẫn đóng góp

### Quy trình Đóng góp (Git Workflow)

```mermaid
gitGraph
  commit id: "Khởi tạo"
  commit id: "Phiên bản ổn định"
  branch feature/them-lich
  checkout feature/them-lich
  commit id: "feat: Thêm lịch sự kiện"
  checkout main
  merge feature/them-lich id: "Gộp tính năng"
```

1. **Fork** kho lưu trữ về tài khoản GitHub cá nhân.
2. **Tạo nhánh mới:** `git checkout -b feature/ten-tinh-nang`
3. **Thực thi thay đổi:** Đảm bảo mã nguồn sạch, không lỗi kiểm tra cú pháp (lint).
4. **Commit:** `git commit -m "feat: Bổ sung tính năng mới"`
5. **Push:** `git push origin feature/ten-tinh-nang`
6. **Tạo Pull Request (PR):** Hướng đến nhánh `main` của kho lưu trữ gốc.

---

<div align="center">
  <i>Ứng dụng được làm ra với mục đích phục vụ nội bộ và không nhằm mục đích thương mại.</i>
</div>
<div align="center">Made with ❤️ by <a href="https://github.com/dexter826">MOB</a></div>
