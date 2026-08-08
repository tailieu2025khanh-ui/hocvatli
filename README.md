<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# HỌC VẬT LÍ THẬT THÚ VỊ - LMS & Kho Video, Tài Liệu Trực Tuyến GDPT 2018

Hệ thống LMS quản lý học tập Vật lý THPT thông minh kết hợp Chẩn đoán AI Gemini, Chấm điểm OCR tự động, Liên kết Database trực tuyến danh sách lớp và Trình nhúng Video/Tài liệu web trực tiếp.

---

## 🌟 Tính Năng Nổi Bật Mới Nhất

1. **Thương hiệu Ứng Dụng Mới: HỌC VẬT LÍ THẬT THÚ VỊ**
   - Giao diện Dark/Light mode hiện đại, chuẩn UI/UX giáo dục GDPT 2018.

2. **Liên Kết Database Trực Tuyến Danh Sách Lớp (`OnlineDatabaseModal.tsx` & `server.ts`)**
   - Đèn báo kết nối trực tiếp `🟢 DB Trực Tuyến: Online` trên Thanh tiêu đề & Trang Quản lý học sinh.
   - Hỗ trợ liên kết Cloud REST API, Supabase, Google Sheets API, Firebase Realtime Database.
   - Tính năng **Test Connection (Ping)**, **Pull (Tải dữ liệu)** và **Push (Đẩy dữ liệu)** hai chiều thời gian thực.

3. **Kho Trang Tài Liệu Web Tìm Được Trên Mạng (`WebResourceAndVideoHub.tsx`)**
   - Lưu trữ, phân loại và tìm kiếm các liên kết tài liệu web (PDF, Wikipedia, Google Docs, Thư viện học liệu).
   - Tích hợp **Trình Đọc Trực Tiếp (Web Reader Modal)** xem nội dung ngay trong ứng dụng mà không cần chuyển tab.

4. **Trình Nhúng Video Trực Tuyến Xem Trực Tiếp**
   - Tự động phân giải link YouTube (`watch?v=`, `youtu.be`, `shorts`), Vimeo, hoặc file `.mp4`.
   - Mở **Trình Phát Video HD (Embedded Video Player Modal)** với trình điều khiển sắc nét.
   - Cho phép giáo viên giao video làm bài tập về nhà trực tiếp cho các lớp học.

---

## 🚀 Hướng Dẫn Khởi Chạy (Run Locally)

### Yêu cầu tiên quyết:
- **Node.js** (Phiên bản v18+)

### Các bước khởi chạy:
1. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
2. Cấu hình khóa API Gemini trong file `.env` hoặc `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Chạy máy chủ LMS Server:
   ```bash
   npm run dev
   ```
4. Truy cập ứng dụng trên trình duyệt:
   ```
   http://localhost:3000
   ```

