# 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

Dưới đây là sơ đồ cây cấu trúc thư mục của dự án **Java Quiz Pro** (đã loại trừ thư mục `resource/`):

```text
java-quiz-pro/
├── images/                                 # Thư mục chứa hình ảnh đoạn mã nguồn câu hỏi trắc nghiệm (77 ảnh)
│   ├── de1_q12_5s9yGZZwP003nYzwIVaVSmf...png
│   ├── de1_q15_NinWWUbNBcsXfuSIuy410Bs...png
│   ├── de2_q24_k5wRNl1QDOXvaAi8SNX2JUB...png
│   ├── de3_q1_VbQy5PVoY3VeEzK2GPAgOUZ...png
│   ├── de4_q1_fReCipBSg38HSmKaJzDcAu5...png
│   └── ...                                 # (Tổng cộng 77 tệp hình ảnh câu hỏi từ các đề thi)
├── .gitignore                              # Cấu hình loại trừ thư mục resource/ và các file tạm hệ thống
├── app.js                                  # Xử lý logic toàn bộ web app (chế độ ôn tập, thi kiểm tra, tính giờ, chấm điểm, bộ lọc chủ đề)
├── config.js                               # Tệp cấu hình hệ thống (cờ khóa ôn tập ENABLE_PRACTICE_MODE, cấu hình mặc định)
├── index.html                              # Trang chủ giao diện người dùng (Single Page Application - SPA)
├── ngan_hang_de.json                       # Ngân hàng 343 câu hỏi gốc chuẩn hóa định dạng JSON (dùng lưu trữ, tra cứu lâu dài)
├── quiz_data.js                            # Dữ liệu hằng số Javascript chứa 343 câu hỏi và cấu hình 16 chủ đề (QUIZ_DATA, TOPICS_CONFIG)
├── style.css                               # Toàn bộ mã nguồn giao diện CSS hiện đại (Design System, Responsive, Dark/Light elements)
├── README.md                               # Tài liệu giới thiệu hệ thống, hướng dẫn sử dụng và bảng phân loại chủ đề
└── Tong_hop_200_cau_trac_nghiem_Java.pdf   # Tài liệu PDF tổng hợp 200 câu hỏi trắc nghiệm Java sạch đẹp dùng để in ấn/đọc offline
```

---

## 📌 Chi Tiết Vai Trò Các Thành Phần

| Tên tệp / Thư mục | Định dạng | Vai trò chính |
| :--- | :---: | :--- |
| `index.html` | HTML | Khung giao diện chính, thanh điều hướng Navbar, Admin Toggle Badge, Container chuyển đổi các màn hình (Home, Practice, Exam, Result). |
| `style.css` | CSS | Giao diện hiện đại tối ưu trải nghiệm (Typography Google Fonts, Glassmorphism navbar, chip chủ đề, palette chọn câu, code snippet dark theme). |
| `app.js` | JavaScript | Logic vận hành: điều hướng SPA, quản lý trạng thái, bộ lọc đa chủ đề (Multi-select Topic Filter), xáo trộn câu hỏi và đáp án A/B/C/D, tính giờ làm bài và chấm điểm tự động. |
| `config.js` | JavaScript | Nơi quản trị viên cấu hình nhanh tham số: `ENABLE_PRACTICE_MODE` (bật/tắt khóa ôn tập), `EXAM_QUESTION_COUNT`, `EXAM_TIME_MINUTES`, `PASSING_SCORE_PERCENT`. |
| `ngan_hang_de.json` | JSON | Kho lưu trữ toàn diện 343 câu hỏi Java (gồm 70 câu OOP nâng cao, 73 câu mở rộng chuyên sâu cho Polymorphism, Abstraction, Interface, Exception, Collections và 200 câu thực hành). |
| `quiz_data.js` | JavaScript | Cung cấp hằng số `QUIZ_DATA` và danh sách cấu hình `TOPICS_CONFIG` cho `app.js` nạp trực tiếp mà không bị chặn bởi CORS khi chạy file offline. |
| `images/` | PNG | Chứa 77 ảnh chụp đoạn mã nguồn trong các câu hỏi trắc nghiệm của 4 bộ đề gốc. |
| `Tong_hop_200_cau_trac_nghiem_Java.pdf` | PDF | Bản PDF tổng hợp 200 câu trắc nghiệm đã được làm sạch, không có quảng cáo hay chi tiết che khuất để in ấn hoặc học ngoại tuyến. |
| `.gitignore` | Config | Cấu hình Git bỏ qua thư mục `resource/`, file rác hệ điều hành (`.DS_Store`, `Thumbs.db`) và các file tạm. |
| `README.md` | Markdown | Trang giới thiệu tổng quan dự án trên GitHub repository. |
