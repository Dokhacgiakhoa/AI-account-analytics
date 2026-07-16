# Kế hoạch Triển khai: AI Account Analytics (Web App)

Dự án mới tại `D:\Github\AI-Acount-Analytics`. Hệ thống sẽ được xây dựng theo mô hình Web App (Client-Server) để bạn có thể xem thống kê trên cả máy tính lẫn điện thoại (như iPhone).

## Cấu trúc dự án
Sử dụng kiến trúc Monorepo hoặc 2 thư mục Frontend/Backend riêng biệt:
- **Frontend:** Vite + React + TailwindCSS (hoặc CSS thuần) + Recharts. (Chứa 4 Menu chức năng)
- **Backend:** Node.js + Express.
- **Database:** SQLite (chứa bảng `accounts` và `quota_logs`).

## 4 Chức năng chính trên Giao diện (Frontend)
1. **Dashboard:** Dựng biểu đồ Recharts phân tích tốc độ tiêu hao (burn rate) và tần suất sử dụng.
2. **Tổng quan tài khoản:** Dựng lưới giao diện các Card tài khoản (Có thanh phần trăm, trạng thái PRO/FREE).
3. **Thêm nền tảng:** Form để người dùng sao chép (copy-paste) Session Token/API Key vào (chỉ áp dụng GPT, Gemini, Claude).
4. **Cài đặt:** Các tuỳ chỉnh chu kỳ đồng bộ.

## Cơ chế đồng bộ
Backend sẽ chứa một `Cronjob` chạy ngầm. Định kỳ nó sẽ lấy các Session Token trong Database, gọi lên API của OpenAI/Google/Anthropic để quét và lưu mức % Quota hiện tại vào Database. Khi Frontend (từ iPhone hay Desktop) kết nối vào, nó chỉ việc đọc Data này và vẽ biểu đồ.

## Hướng dẫn cho AI ở phiên làm việc (Session) mới:
- AI khi đọc file này hãy tự động tiến hành `npx create-vite frontend --template react` và khởi tạo `backend` bằng `npm init` theo cấu trúc trên.
- Sử dụng UI/UX tối giản tương tự Cockpit-tools (Màu tối, các Card UI gọn gàng).
