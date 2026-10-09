# HƯỚNG DẪN KẾT NỐI TỰ ĐỘNG GHI KẾT QUẢ VÀO GOOGLE SHEETS

Hệ thống đã được tích hợp tính năng **thu thập kết quả bài thi ngầm** (Silent Telemetry) gửi về Google Sheets mà người dùng hoàn toàn không hay biết.

Để kết nối với trang Google Sheets cá nhân của bạn, chỉ cần làm theo **3 bước đơn giản (mất 1-2 phút)** sau:

---

### Bước 1: Tạo Google Sheet mới
1. Truy cập [Google Sheets](https://sheets.new) và tạo 1 bảng tính mới.
2. Đặt tên bảng tính tùy ý, ví dụ: `Ket_Qua_Java_Quiz_Pro`.

---

### Bước 2: Dán mã Google Apps Script
1. Trên thanh menu của Google Sheet, bấm chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Xóa hết code mẫu hiện có và **dán toàn bộ đoạn code dưới đây** vào:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Tự động tạo dòng tiêu đề đẹp mắt nếu sheet còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian nộp",
        "Tên thí sinh",
        "Mã thiết bị",
        "Điểm (Hệ 10)",
        "Tỉ lệ đúng",
        "Số câu đúng/tổng",
        "Kết quả",
        "Thời gian làm",
        "Chủ đề thi",
        "Địa chỉ IP",
        "Vị trí",
        "Nhà mạng (ISP)",
        "Thiết bị & Trình duyệt",
        "Các câu làm sai",
        "Các câu bỏ qua"
      ]);
      // Định dạng dòng tiêu đề: In đậm, nền xanh nhạt, căn giữa
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#e8f0fe");
    }
    
    // Ghi hàng dữ liệu mới
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.candidateName || "Ẩn danh",
      data.deviceId || "",
      data.score10 != null ? Number(data.score10).toFixed(1) : "",
      data.percentage != null ? data.percentage + "%" : "",
      (data.correctCount || 0) + "/" + (data.totalQuestions || 0),
      data.isPassed || "",
      data.timeSpent || "",
      data.topicsSummary || "Tất cả",
      data.ip || "",
      data.location || "",
      data.isp || "",
      (data.device || "") + " - " + (data.os || "") + " (" + (data.browser || "") + ")",
      data.wrongQuestions || "Không có",
      data.skippedQuestions || "Không có"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Bước 3: Triển khai Web App (Deploy)
1. Ở góc trên bên phải màn hình Apps Script, bấm nút **Triển khai (Deploy)** > **Triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng ⚙️ bên trái, chọn loại **Ứng dụng web (Web app)**.
3. Điền thông tin:
   - **Mô tả:** `Java Quiz Webhook`
   - **Thực thi dưới dạng (Execute as):** `Tôi (email của bạn)`
   - **Ai có quyền truy cập (Who has access):** Chọn **`Bất kỳ ai (Anyone)`** *(rất quan trọng để client gửi dữ liệu được)*.
4. Bấm **Triển khai (Deploy)**. Nếu Google hỏi cấp quyền (Authorize Access), bấm Cho phép / Advanced > Go to Untitled (unsafe).
5. Copy đường dẫn **URL ứng dụng web** (có dạng `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Bước 4: Kích hoạt trong dự án
Dán URL bạn vừa copy vào hằng số `DEFAULT_SHEET_WEBHOOK_URL` trong file [src/services/examTelemetryService.ts](file:///c:/Users/ASUS/Downloads/PinkCloud/Documents/src/services/examTelemetryService.ts):

```typescript
export const DEFAULT_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

*(Hoặc mở Console trên trình duyệt và gõ: `localStorage.setItem('java_quiz_sheet_webhook_url', 'URL_CỦA_BẠN')`)*

Mỗi khi bất kỳ ai hoàn thành bài thi Java, kết quả đầy đủ sẽ âm thầm nhảy vào Google Sheet của bạn ngay lập tức!
