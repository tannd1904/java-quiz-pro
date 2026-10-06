/**
 * =========================================================================================
 *                   CẤU HÌNH HỆ THỐNG TRẮC NGHIỆM JAVA ONLINE (CONFIG)
 * =========================================================================================
 * Bạn có thể trực tiếp thay đổi các thông số cấu hình dưới đây để điều khiển hoạt động web:
 */

const CONFIG = {
  // =======================================================================================
  // 1. ĐIỀU KHIỂN BẬT / TẮT CHẾ ĐỘ ÔN TẬP (YÊU CẦU CỦA BẠN):
  // ---------------------------------------------------------------------------------------
  // false = [KHÓA ÔN TẬP] Người dùng BẮT BUỘC phải làm bài kiểm tra trước để đánh giá năng lực!
  //         Giao diện Ôn tập sẽ bị khóa và hiển thị thông báo yêu cầu làm bài kiểm tra.
  // true  = [MỞ ÔN TẬP]   Người dùng được tự do lựa chọn cả chế độ Ôn tập và Kiểm tra.
  // =======================================================================================
  ENABLE_PRACTICE_MODE: false,

  // =======================================================================================
  // 2. THIẾT LẬP BÀI THI KIỂM TRA (EXAM MODE):
  // =======================================================================================
  EXAM_QUESTION_COUNT: 40,      // Số lượng câu hỏi ngẫu nhiên trong 1 đề thi kiểm tra (VD: 20, 40, 50)
  EXAM_TIME_MINUTES: 45,        // Thời gian làm bài thi kiểm tra (phút)
  PASSING_SCORE_PERCENT: 70,    // Điểm phần trăm để ĐẠT bài thi (VD: 70%)

  // =======================================================================================
  // 3. THIẾT LẬP XÁO TRỘN ĐÁP ÁN VÀ CÂU HỎI:
  // =======================================================================================
  SHUFFLE_OPTIONS: true,        // Xáo trộn vị trí các đáp án A, B, C, D mỗi lần làm (tránh nhớ vẹt)
  SHUFFLE_QUESTIONS: true,      // Xáo trộn danh sách câu hỏi khi sinh đề thi ngẫu nhiên

  // =======================================================================================
  // 4. TIÊU ĐỀ & THÔNG TIN HỆ THỐNG:
  // =======================================================================================
  APP_TITLE: "HỆ THỐNG LUYỆN THI TRẮC NGHIỆM JAVA ONLINE",
  SUBTITLE: "Ngân hàng 340+ câu hỏi Java & OOP chuyên sâu có giải thích chi tiết",
  INSTITUTION: "Lập trình Java & Hướng Đối Tượng (OOP)",
};

// Xuất cấu hình để sử dụng trong ứng dụng
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
