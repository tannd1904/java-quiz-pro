# ☕ Java Quiz Pro - Modern Java Certification & Competency Platform

Nền tảng thi trắc nghiệm và ôn luyện lập trình Java & Lập trình Hướng đối tượng (OOP) chuyên sâu với hơn **340+ câu hỏi chuẩn hóa**, giải thích chi tiết, hỗ trợ **Song Ngữ (Tiếng Việt 🇻🇳 / English 🇺🇸)**, giao diện **Dark/Light Mode** hiện đại, xây dựng trên nền tảng **React 18 + TypeScript + Vite**.

---

## 🌟 Tính Năng Nổi Bật

- **🎯 Chế độ Kiểm tra (Exam Mode):**
  - Tự do chọn một hoặc nhiều chủ đề muốn thi (Encapsulation, Inheritance, Polymorphism, Abstraction, Interface, Constructor, Memory, Exception, Collections...).
  - Tùy chỉnh số lượng câu hỏi và thời gian làm bài với thanh trượt và presets linh hoạt.
  - Tự động xáo trộn ngẫu nhiên thứ tự câu hỏi và thứ tự đáp án A, B, C, D (giữ tính toàn vẹn câu hỏi và đáp án).
  - Đồng hồ đếm ngược chính xác, cảnh báo thời gian, thanh điều hướng câu hỏi (palette) trực quan.
  - Chấm điểm tự động thang điểm 10 & phần trăm, phân tích số câu đúng/sai/bỏ qua, và xem lại toàn bộ bài làm kèm giải thích chi tiết.

- **💡 Chế độ Ôn tập (Practice Mode):**
  - Bộ lọc chủ đề linh hoạt kèm các preset thông minh: *Tất cả*, *Bộ 6 Chủ Đề OOP*, *4 Tính Chất OOP*, *Nâng Cao & JVM*.
  - Phản hồi tức thì: Chọn đáp án để biết ngay kết quả Đúng (xanh) / Sai (đỏ) kèm lời giải chi tiết và mã nguồn minh họa.
  - Hỗ trợ khối mã nguồn (Syntax-highlighted code block với nút copy) rõ nét và 77 hình ảnh đề thi nguyên bản.
  - Tìm kiếm nhanh thời gian thực theo từ khóa trong câu hỏi, đáp án, mã nguồn và lời giải.

- **🌐 Hỗ trợ Song Ngữ (Bilingual i18n):**
  - Chuyển đổi mượt mà giữa **Tiếng Việt 🇻🇳** và **English 🇺🇸**.
  - Lưu trạng thái ngôn ngữ đã chọn vào `localStorage`.

- **🎨 Developer-Focused Design System (Dark & Light Mode):**
  - Mặc định giao diện Tối (Dark mode `#09090b`) tối ưu cho lập trình viên.
  - Tùy chọn chuyển đổi sang giao diện Sáng (Light mode) với bảng màu tinh tế, hiện đại.

- **🔒 Quản Trị Khóa / Mở Chế Độ Ôn Tập:**
  - Nút chuyển đổi nhanh quyền truy cập chế độ Ôn tập ngay trên thanh Navbar (`🔒 ĐANG KHÓA` / `🟢 ĐÃ MỞ`).

---

## 📚 Phân Bổ Ngân Hàng Câu Hỏi (343 Câu Chuẩn Hóa)

Toàn bộ câu hỏi được quản lý tập trung trong file `public/data/questions.json`:

| Icon | Chủ đề | Số lượng câu |
| :---: | :--- | :---: |
| 🔒 | **Encapsulation** (Tính Đóng Gói & Access Modifiers) | 22 |
| 🧬 | **Inheritance** (Tính Kế Thừa) | 21 |
| 🎭 | **Polymorphism** (Tính Đa Hình & Overriding) | 21 |
| 🌫️ | **Abstraction** (Tính Trừu Tượng & Abstract Class) | 20 |
| 🔌 | **Interface** (Giao Diện & Default Methods) | 21 |
| 🏗️ | **Constructor** (Hàm Tạo & Khởi Tạo Đối Tượng) | 11 |
| ⚡ | **Static & Final** (Từ Khóa Tĩnh & Bất Biến) | 12 |
| 🛡️ | **Exception Handling** (Xử Lý Ngoại Lệ) | 20 |
| 💾 | **Memory Model & GC** (JVM, Stack vs Heap, GC) | 15 |
| 📦 | **Collections Framework & Generics** | 22 |
| 📐 | **Design Patterns & SOLID Principles** | 11 |
| 🔤 | **String & Immutability** (Chuỗi Ký Tự) | 20 |
| 📊 | **Arrays** (Mảng Dữ Liệu) | 16 |
| ⌨️ | **I/O & Scanner** (Nhập Xuất Dữ Liệu) | 32 |
| 🔁 | **Control Flow** (Vòng Lặp & Rẽ Nhánh) | 20 |
| ☕ | **Core Java** (Căn Bản & Tổng Hợp) | 59 |
| **Tổng** | **16 Chủ Đề Toàn Diện** | **343 Câu** |

---

## 🛠️ Cấu Trúc Mã Nguồn

```text
src/
├── components/
│   ├── common/        # Button, Modal, CodeBlock, ThemeToggle, LanguageSwitcher
│   ├── navigation/    # Navbar, Footer
│   ├── quiz/          # AnswerOption, ExplanationDrawer, QuestionPalette, QuizTimer, ExamSetupModal
│   ├── result/        # ScoreCard, MetricsGrid, ReviewQuestionList
│   └── topic/         # TopicChip, TopicSelector
├── config/            # app.config.ts, topics.config.ts
├── hooks/             # useI18n, useTheme, useQuizTimer
├── i18n/              # vi/common.json, en/common.json
├── pages/             # HomePage, PracticePage, ExamPage, ResultPage
├── services/          # questionRepository.ts, quizEngine.ts
├── styles/            # tokens.css, global.css
└── types/             # question.ts, quiz.ts, theme.ts
```

---

## 🚀 Hướng Dẫn Chạy & Phát Triển

### 1. Cài đặt môi trường
Yêu cầu Node.js (hỗ trợ cả Node 16+ và Node 18+).

```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 3. Kiểm thử đơn vị (Unit Tests)
```bash
npm test
```

### 4. Build phiên bản phát hành (Production Build)
```bash
npm run build
```
Thư mục xuất xưởng được đóng gói tối ưu tại `dist/`.

---

## 📄 Tài Liệu Bảng Tổng Hợp
File [bang_tong_hop_cau_hoi.html](bang_tong_hop_cau_hoi.html) cung cấp bản in tổng hợp đầy đủ nội dung câu hỏi, hình ảnh và đáp án, sẵn sàng để xuất file PDF chất lượng cao.
