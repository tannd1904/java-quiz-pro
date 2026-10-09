# 🚀 Lộ Trình Xây Dựng Hệ Thống "Bài Tập Tự Code & Chấm Điểm Tự Động" (Online Judge)
> **Tài liệu đặc tả kiến trúc, thiết kế cơ sở dữ liệu và kế hoạch triển khai tính năng Lập trình thực tế trên Java Quiz Pro.**

---

## 📌 1. Mục Tiêu Tổng Thể (Vision & Goals)
Nâng cấp **Java Quiz Pro** từ nền tảng **Trắc nghiệm kiến thức** thành nền tảng **Luyện tập toàn diện (Full-stack Learning)**:
- Người học không chỉ chọn A/B/C/D mà còn **tự tay viết mã nguồn (Hands-on Coding)**.
- Hệ thống tự động biên dịch, chạy mã với bộ dữ liệu kiểm thử (**Test Cases** ẩn & hiện).
- Đánh giá năng lực dựa trên **Expected Output vs Actual Output**, thời gian thực thi (Runtime) và bộ nhớ (Memory).
- Tích hợp kết quả vào biểu đồ năng lực sinh viên và xuất báo cáo giảng viên.

---

## 🏗️ 2. Kiến Trúc Hệ Thống (Architecture Blueprint)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER (Vite / React)           │
│                                                             │
│   ┌───────────────────────┐       ┌─────────────────────┐   │
│   │   Đề bài & Ví dụ      │       │ Monaco / CodeMirror │   │
│   │   (Problem Markdown)  │       │ Java Code Editor    │   │
│   └───────────────────────┘       └──────────┬──────────┘   │
│                                              │              │
│                                       [Bấm "Nộp bài"]       │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                 POST /submissions (Code + Testcases)
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ONLINE JUDGE EXECUTION ENGINE               │
│                                                             │
│   1. Phân tích cú pháp & Đóng gói JVM Template              │
│   2. Thực thi qua Judge0 CE / Isolated Docker Container     │
│   3. Duyệt tuần tự qua mảng Test Cases (stdin -> stdout)    │
│   4. Bộ so khớp chuỗi (Output Normalizer & Diff Checker)    │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                         Kết quả chi tiết từng Test Case
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      KẾT QUẢ HIỂN THỊ                       │
│   ✅ Accepted (100% Passed) | ❌ Wrong Answer (Test 3/5)     │
│   ⏱️ Time Limit Exceeded    | ⚠️ Compilation / Runtime Error│
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 3. Cấu Trúc Dữ Liệu (Data Schemas)

### 3.1. Cấu trúc Đề bài (`CodingProblem`)
```typescript
export interface TestCase {
  id: number;
  input: string;              // Chuỗi truyền vào qua stdin (Scanner)
  expectedOutput: string;     // Kết quả in ra qua System.out.println
  explanation?: string;       // Giải thích cho test case mẫu
  isHidden: boolean;          // true = Test case ẩn chấm điểm chống gian lận
}

export interface CodingProblem {
  id: string;                 // e.g. "java-oop-bank-account"
  title: {
    vi: string;
    en: string;
  };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicId: string;            // 'oop', 'collections', 'algorithms', ...
  tags: string[];             // ['String', 'Array', 'Polymorphism']
  description: {
    vi: string;               // Markdown mô tả yêu cầu bài toán
    en: string;
  };
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;        // Code khung ban đầu cho học viên
  solutionCode?: string;      // Lời giải mẫu tối ưu
  timeLimitMs: number;        // Mặc định 2000ms
  memoryLimitKb: number;      // Mặc định 64000KB
  testCases: TestCase[];
}
```

### 3.2. Cấu trúc Kết quả chấm (`JudgeSubmissionResult`)
```typescript
export type Verdict =
  | 'ACCEPTED'                 // Tất cả test case đúng
  | 'WRONG_ANSWER'            // Sai output ở 1 test case
  | 'TIME_LIMIT_EXCEEDED'     // Vòng lặp vô tận / chạy quá thời gian
  | 'MEMORY_LIMIT_EXCEEDED'   // Tràn bộ nhớ Heap
  | 'COMPILATION_ERROR'       // Lỗi biên dịch javac
  | 'RUNTIME_ERROR';          // Ngoại lệ Java chưa xử lý (Exception)

export interface TestCaseResult {
  testCaseId: number;
  passed: boolean;
  input?: string;             // Ẩn nếu là hidden test case
  expectedOutput?: string;
  actualOutput?: string;
  timeMs: number;
  error?: string;
}

export interface JudgeSubmissionResult {
  verdict: Verdict;
  passedCount: number;
  totalCount: number;
  score: number;              // 0 - 100 điểm
  compilationError?: string;
  runtimeError?: string;
  testCaseResults: TestCaseResult[];
  timeSpentMs: number;
}
```

---

## 🎨 4. Thiết Kế Giao Diện Người Dùng (IDE Split-View)

### Bố cục màn hình Coding Workspace:
1. **Thanh công cụ trên (Top Bar):**
   - Nút quay lại danh sách bài tập.
   - Tiêu đề bài tập + Huy hiệu độ khó (Dễ: Xanh, Trung bình: Vàng, Khó: Đỏ).
   - Nút **Reset Code** về mẫu ban đầu.
   - Nút **Chạy thử Test Mẫu (Run Sample)**.
   - Nút **Nộp bài (Submit Code)**.
2. **Khung trái (Problem Pane - 42%):**
   - Đề bài chi tiết định dạng Markdown.
   - Định dạng Input / Output yêu cầu.
   - 2-3 ví dụ mẫu (Sample 1, Sample 2) có nút "Sao chép Input".
   - Ràng buộc bài toán (Constraints): ví dụ $1 \le N \le 10^5$.
3. **Khung phải (Editor & Terminal Pane - 58%):**
   - **Monaco Editor / React CodeMirror:** Đánh số dòng, gợi ý cú pháp Java, thụt lề thông minh, theme Dark Neon.
   - **Console / Tabs phía dưới:**
     - Tab **Test Cases:** Xem trước các test case mẫu và tự nhập Custom Test Case.
     - Tab **Kết quả chạy:** Hiển thị chi tiết từng testcase (Pass màu xanh, Fail màu đỏ kèm diff giữa Actual và Expected).

---

## ⚙️ 5. Quy Trình Chấm Điểm (Judging Engine Pipeline)

1. **Chuẩn hóa mã nguồn:**
   - Đóng gói code thí sinh vào cấu trúc thực thi thống nhất (`public class Main`).
2. **Gửi đến Sandbox Execution Service:**
   - Thực thi với thời gian chờ tối đa 3000ms.
   - Cô lập hoàn toàn quyền truy cập mạng và file hệ thống để đảm bảo an toàn.
3. **Xử lý chuỗi (Output Normalization):**
   - Chuẩn hóa ký tự xuống dòng `\r\n` thành `\n`.
   - Cắt bỏ khoảng trắng dư thừa ở cuối chuỗi (`.trim()`).
   - Hỗ trợ so khớp số thực với sai số epsilon ($\varepsilon = 10^{-6}$) nếu bài toán yêu cầu.
4. **Đánh giá tổng thể:**
   - Nếu $100\%$ test cases vượt qua: **Accepted**.
   - Cập nhật tiến độ người dùng (`userProgressService`) và gửi dữ liệu về Google Sheet giám sát.

---

## 📅 6. Kế Hoạch Triển Khai Theo Giai Đoạn (Milestones)

### Giai đoạn 1 (Đã hoàn thành ngay):
- [x] Tích hợp **Online Java Code Execution API** trực tiếp trên web vào `RunCodeModal.tsx`.
- [x] Chạy code Java hiển thị Output Console tại chỗ mà không cần mở tab ngoài.

### Giai đoạn 2 (Xây dựng Ngân Hàng Bài Tập & Code Editor):
- [ ] Cài đặt gói `@uiw/react-codemirror` hoặc `@monaco-editor/react`.
- [ ] Soạn thảo **30 bài tập Java kinh điển**:
  - 10 bài Cú pháp, Mảng & Chuỗi.
  - 10 bài Lập trình Hướng đối tượng (OOP: Encapsulation, Inheritance, Polymorphism).
  - 5 bài Xử lý Ngoại lệ (Exception Handling) & File I/O.
  - 5 bài Cấu trúc dữ liệu & Collections (ArrayList, HashMap, HashSet).
- [ ] Tạo giao diện Workspace 2 cột (Đề bài | Editor).

### Giai đoạn 3 (Hệ Thống Chấm Test Cases & Lưu Điểm):
- [ ] Viết bộ chạy tự động lặp qua toàn bộ `testCases` của bài tập.
- [ ] Giao diện hiển thị chi tiết: Passed X/Y test cases.
- [ ] Lưu lịch sử nộp bài vào `localStorage`.
- [ ] Tích hợp điểm bài tập vào Bảng điểm chứng chỉ (Shareable Scorecard).
