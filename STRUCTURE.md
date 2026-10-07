# 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

Dưới đây là sơ đồ cây cấu trúc thư mục của dự án **Java Quiz Pro (Modernized Architecture)**:

```text
java-quiz-pro/
├── public/
│   ├── data/
│   │   └── questions.json                # Single Source of Truth: 343 câu hỏi song ngữ (VI/EN) & 16 chủ đề
│   └── images/                           # 77 tệp hình ảnh câu hỏi gốc phục vụ static assets
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx                # Nút bấm tái sử dụng với các biến thể (primary, secondary, outline, ghost)
│   │   │   ├── CodeBlock.tsx             # Khối hiển thị mã nguồn Java kèm nút Copy
│   │   │   ├── LanguageSwitcher.tsx      # Bộ chuyển đổi song ngữ Tiếng Việt 🇻🇳 / English 🇺🇸
│   │   │   ├── Modal.tsx                 # Hộp thoại Modal hỗ trợ phím ESC và backdrop blur
│   │   │   └── ThemeToggle.tsx           # Bộ chuyển đổi giao diện Dark (#09090b) / Light Mode
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx                # Thanh điều hướng với Admin Lock toggle, PDF link, Theme & Lang switcher
│   │   │   └── Footer.tsx                # Chân trang bản quyền và tiêu chuẩn Java SE
│   │   ├── quiz/
│   │   │   ├── AnswerOption.tsx          # Tùy chọn đáp án (A, B, C, D) với trạng thái tương tác & phản hồi màu
│   │   │   ├── ExamSetupModal.tsx        # Modal cấu hình đề thi theo chủ đề, số câu, thời gian và xáo trộn
│   │   │   ├── ExplanationDrawer.tsx     # Ngăn hiển thị giải thích chi tiết đáp án và nguyên lý OOP
│   │   │   ├── QuestionPalette.tsx       # Bảng điều hướng câu hỏi trực quan dạng lưới
│   │   │   └── QuizTimer.tsx             # Đồng hồ đếm ngược với trạng thái cảnh báo thời gian
│   │   ├── result/
│   │   │   ├── MetricsGrid.tsx           # Lưới thống kê số câu đúng, sai, chưa làm và thời gian làm bài
│   │   │   ├── ReviewQuestionList.tsx    # Danh sách đối chiếu chi tiết bài làm với đáp án chuẩn
│   │   │   └── ScoreCard.tsx             # Thẻ hiển thị điểm số thang 10, tỉ lệ % và trạng thái Đạt / Chưa đạt
│   │   └── topic/
│   │       ├── TopicChip.tsx             # Huy hiệu chủ đề kèm icon và số lượng câu hỏi khả dụng
│   │       └── TopicSelector.tsx         # Bộ chọn đa chủ đề tích hợp các nút preset nhanh
│   ├── config/
│   │   ├── app.config.ts                 # Cấu hình tham số ứng dụng (điểm đạt, thời gian mặc định, practice lock)
│   │   └── topics.config.ts              # Cấu hình 16 chủ đề chuẩn hóa và các bộ preset lọc
│   ├── hooks/
│   │   ├── useI18n.tsx                   # Hook & Context quản lý đa ngôn ngữ với localStorage persistence
│   │   ├── useQuizTimer.ts               # Hook quản lý đồng hồ đếm ngược chính xác theo thời gian thực
│   │   └── useTheme.tsx                  # Hook & Context quản lý Dark/Light mode với data-theme attribute
│   ├── i18n/
│   │   ├── en/
│   │   │   └── common.json               # Tài nguyên văn bản Tiếng Anh
│   │   └── vi/
│   │       └── common.json               # Tài nguyên văn bản Tiếng Việt
│   ├── pages/
│   │   ├── ExamPage.tsx                  # Màn hình làm bài thi có tính giờ, xáo trộn câu/đáp án và palette
│   │   ├── HomePage.tsx                  # Màn hình chính giới thiệu nền tảng và 2 chế độ thi / ôn tập
│   │   ├── PracticePage.tsx              # Màn hình ôn tập theo chủ đề với phản hồi tức thì và tìm kiếm nhanh
│   │   └── ResultPage.tsx                # Màn hình tổng kết kết quả, xếp loại và xem lại lời giải chi tiết
│   ├── services/
│   │   ├── questionRepository.ts         # Service nạp và cache dữ liệu câu hỏi từ public/data/questions.json
│   │   └── quizEngine.ts                 # Engine nghiệp vụ: lọc chủ đề, xáo trộn mảng, tính điểm và review
│   ├── styles/
│   │   ├── global.css                    # CSS toàn cục, reset và typography
│   │   └── tokens.css                    # Design tokens (màu sắc HSL, font Inter & JetBrains Mono, border, shadow)
│   ├── types/
│   │   ├── question.ts                   # Định nghĩa kiểu dữ liệu Question, TopicConfig, LocalizedString
│   │   ├── quiz.ts                       # Định nghĩa kiểu dữ liệu ExamSetupConfig, ExamQuestionItem, ExamResult
│   │   └── theme.ts                      # Định nghĩa kiểu Theme ('dark' | 'light')
│   ├── App.tsx                           # Root React Component điều phối state machine các views
│   └── main.tsx                          # Điểm khởi chạy React 18 DOM root
├── tests/
│   ├── dataIntegrity.test.ts             # Kiểm thử toàn vẹn 343 câu hỏi, 16 topics và đường dẫn 77 ảnh
│   └── quizEngine.test.ts                # Kiểm thử thuật toán xáo trộn, lọc chủ đề và tính điểm
├── bang_tong_hop_cau_hoi.html            # Bản tổng hợp 343 câu hỏi định dạng HTML tối ưu in ấn PDF
├── index.html                            # File HTML gốc của Vite SPA
├── package.json                          # Cấu hình dependencies (React 18, Vite 4.5, Lucide-react, Vitest)
├── tsconfig.json                         # Cấu hình TypeScript compiler
├── vite.config.ts                        # Cấu hình Vite bundler và Vitest
└── README.md                             # Tài liệu giới thiệu và hướng dẫn sử dụng
```
