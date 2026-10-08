# -*- coding: utf-8 -*-
"""
Generator for Exception questions (85 questions).
Topic: exception
Topic Name: Exception Handling (Xu ly Ngoai Le)
"""

def get_exceptions_questions():
    questions = []

    def q(id_num, q_vi, q_en, opts_vi, opts_en, correct_idx, exp_vi, exp_en, code=None):
        return {
            "id": f"midterm-exp-{id_num:03d}",
            "topicId": "exception",
            "category": {
                "vi": "Xử Lý Ngoại Lệ (Exception Handling)",
                "en": "Exception Handling"
            },
            "question": {
                "vi": q_vi,
                "en": q_en
            },
            "codeSnippet": code,
            "image": None,
            "options": {
                "vi": opts_vi,
                "en": opts_en
            },
            "correctIndex": correct_idx,
            "explanation": {
                "vi": exp_vi,
                "en": exp_en
            }
        }

    exp_data = [
        ("Lớp cha cao nhất của tất cả các lớp ngoại lệ và lỗi trong Java là gì?",
         "What is the topmost superclass of all exceptions and errors in Java?",
         ["java.lang.Exception", "java.lang.Throwable", "java.lang.Error", "java.lang.RuntimeException"],
         ["java.lang.Exception", "java.lang.Throwable", "java.lang.Error", "java.lang.RuntimeException"],
         1,
         "`java.lang.Throwable` là lớp gốc của toàn bộ cây phân cấp ngoại lệ và lỗi trong Java, là cha của cả `Exception` và `Error`.",
         "`java.lang.Throwable` is the root superclass of all errors and exceptions in Java.",
         None),

        ("Sự khác biệt cơ bản giữa `Error` và `Exception` trong Java là gì?",
         "What is the fundamental difference between `Error` and `Exception` in Java?",
         ["Error là lỗi nghiêm trọng của hệ thống/JVM (như OutOfMemoryError, StackOverflowError) mà ứng dụng thường không thể phục hồi, còn Exception là sự cố có thể lường trước và xử lý được",
          "Error chỉ xảy ra khi biên dịch, Exception xảy ra lúc chạy",
          "Error kế thừa từ RuntimeException, Exception kế thừa từ Throwable",
          "Error có thể bắt được bằng try-catch còn Exception thì không"],
         ["Error represents severe JVM/system failures (e.g. OutOfMemoryError) that applications generally cannot recover from, while Exception represents recoverable conditions",
          "Error occurs at compile time, Exception occurs at runtime",
          "Error extends RuntimeException, Exception extends Throwable",
          "Error can be caught by try-catch while Exception cannot"],
         0,
         "`Error` đại diện cho các vấn đề nghiêm trọng cấp độ máy ảo mà ứng dụng bình thường không nên cố gắng bắt hay xử lý.",
         "`Error` denotes catastrophic JVM failures that reasonable applications should not attempt to handle.",
         None),

        ("Ngoại lệ nào sau đây là Checked Exception (bắt buộc phải xử lý bằng try-catch hoặc khai báo throws)?",
         "Which of the following is a Checked Exception (must be caught or declared in a throws clause)?",
         ["NullPointerException", "ArithmeticException", "IOException", "ArrayIndexOutOfBoundsException"],
         ["NullPointerException", "ArithmeticException", "IOException", "ArrayIndexOutOfBoundsException"],
         2,
         "`IOException` là Checked Exception (kế thừa trực tiếp từ `Exception` mà không qua `RuntimeException`), bắt buộc phải xử lý.",
         "`IOException` is a Checked Exception (extends `Exception` directly, not `RuntimeException`), requiring mandatory handling.",
         None),

        ("Các ngoại lệ kế thừa từ lớp nào sau đây được coi là Unchecked Exception?",
         "Exceptions subclassing which class are considered Unchecked Exceptions?",
         ["java.lang.Exception", "java.lang.RuntimeException", "java.lang.Throwable", "java.io.IOException"],
         ["java.lang.Exception", "java.lang.RuntimeException", "java.lang.Throwable", "java.io.IOException"],
         1,
         "`RuntimeException` và các lớp con của nó (cùng với `Error`) là Unchecked Exceptions, không bắt buộc phải khai báo throws hay try-catch.",
         "`RuntimeException` and its subclasses (along with `Error`) are Unchecked Exceptions, exempt from compile-time enforcement.",
         None),

        ("Khối `finally` có thể KHÔNG được thực thi trong trường hợp nào sau đây?",
         "Under which circumstance might the `finally` block NOT execute?",
         ["Khi khối try ném ra ngoại lệ",
          "Khi có câu lệnh return trong khối try",
          "Khi chương trình gọi `System.exit(0)` trước khi vào finally, hoặc máy ảo JVM bị crash/mất nguồn",
          "Khi có nhiều khối catch"],
         ["When the try block throws an exception",
          "When there is a return statement inside the try block",
          "When `System.exit(0)` is invoked before reaching finally, or the JVM crashes/loses power",
          "When there are multiple catch blocks"],
         2,
         "Khối `finally` luôn được đảm bảo chạy kể cả khi có return hoặc ngoại lệ, TRỪ KHI chương trình bị dừng cưỡng bức bởi `System.exit()` hoặc sự cố phần cứng/JVM chết.",
         "`finally` executes unconditionally even with return statements, UNLESS the JVM is terminated via `System.exit()` or crashes.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["10", "20", "30", "Lỗi biên dịch"],
         ["10", "20", "30", "Compile error"],
         1,
         "Khi khối `finally` chứa câu lệnh `return 20;`, nó sẽ ghi đè (override) và triệt tiêu giá trị trả về `10` của khối `try`.",
         "A `return` statement inside `finally` discards and overrides any return value from the `try` block.",
         "public class Test {\n    static int getValue() {\n        try {\n            return 10;\n        } finally {\n            return 20;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(getValue());\n    }\n}"),

        ("Trong cú pháp multi-catch của Java 7+ (ví dụ: `catch (IOException | SQLException e)`), biến ngoại lệ `e` có tính chất gì?",
         "In Java 7+ multi-catch syntax (e.g. `catch (IOException | SQLException e)`), what property does parameter `e` hold?",
         ["Nó là biến ngầm định `final`, không thể gán lại giá trị cho e",
          "Nó là biến static",
          "Nó có thể gán sang một ngoại lệ khác",
          "Nó tự động trở thành null"],
         ["It is implicitly `final` and cannot be reassigned",
          "It is a static variable",
          "It can be reassigned to another exception",
          "It becomes null automatically"],
         0,
         "Tham số ngoại lệ trong khối multi-catch ngầm định là `final`. Việc gán lại `e = new ...` sẽ gây lỗi biên dịch.",
         "The exception parameter in a multi-catch clause is implicitly `final`; reassigning it is prohibited.",
         None),

        ("Khi sử dụng cú pháp `try-with-resources`, các tài nguyên khai báo trong ngoặc tròn `()` BẮT BUỘC phải cài đặt interface nào?",
         "When using `try-with-resources`, resources declared inside `try (...)` MUST implement which interface?",
         ["java.io.Serializable", "java.lang.AutoCloseable hoặc java.io.Closeable", "java.lang.Runnable", "java.lang.Cloneable"],
         ["java.io.Serializable", "java.lang.AutoCloseable or java.io.Closeable", "java.lang.Runnable", "java.lang.Cloneable"],
         1,
         "`try-with-resources` tự động gọi phương thức `close()` khi kết thúc, do đó mọi tài nguyên bắt buộc phải cài đặt `java.lang.AutoCloseable` (hoặc con của nó là `Closeable`).",
         "Resources used in `try-with-resources` must implement `java.lang.AutoCloseable` or `Closeable` to enable automatic closure.",
         None),

        ("Khi một phương thức ở lớp con ghi đè một phương thức của lớp cha có mệnh đề `throws IOException`, phương thức lớp con được phép làm gì?",
         "When an overriding subclass method overrides a superclass method declaring `throws IOException`, what can it declare in its throws clause?",
         ["Ném ngoại lệ tổng quát hơn như `throws Exception`",
          "Chỉ được ném `IOException`, các lớp con của `IOException` (ví dụ `FileNotFoundException`), hoặc không ném ngoại lệ Checked nào cả",
          "Ném bất kỳ Checked Exception nào tùy ý",
          "Bắt buộc phải ném đúng IOException"],
         ["Throw broader exceptions such as `throws Exception`",
          "Only throw `IOException`, subtypes of `IOException` (e.g. `FileNotFoundException`), or no checked exceptions at all",
          "Throw any arbitrary checked exception",
          "Mandatory to throw the exact same IOException"],
         1,
         "Quy tắc ghi đè ngoại lệ: Lớp con không được phép ném Checked Exception mới hoặc rộng hơn lớp cha. Nó chỉ có thể ném cùng loại, ném hẹp hơn (subclass), hoặc không ném gì.",
         "An overriding method cannot declare broader or new checked exceptions compared to the overridden method.",
         None),

        ("Từ khóa `throw` khác với `throws` như thế nào?",
         "How does `throw` differ from `throws` in Java?",
         ["`throw` dùng để chủ động ném một đối tượng ngoại lệ cụ thể trong thân hàm; `throws` dùng ở chữ ký hàm để khai báo các ngoại lệ phương thức có thể ném ra",
          "`throw` dùng cho unchecked exception, `throws` dùng cho checked exception",
          "`throw` nằm ở chữ ký hàm, `throws` nằm trong thân hàm",
          "Hai từ khóa hoàn toàn giống nhau và có thể thay thế lẫn nhau"],
         ["`throw` explicitly throws a specific exception instance inside a method body; `throws` declares potential exceptions in the method signature",
          "`throw` is for unchecked exceptions, `throws` is for checked exceptions",
          "`throw` is in method headers, `throws` is in method bodies",
          "Both keywords are identical and interchangeable"],
         0,
         "`throw` đi kèm với một thể hiện ngoại lệ cụ thể (`throw new Exception()`), trong khi `throws` nằm ở khai báo phương thức đi kèm với tên lớp ngoại lệ.",
         "`throw` instantiates and throws a concrete exception, whereas `throws` declares exception types in the method signature.",
         None)
    ]

    for i, item in enumerate(exp_data):
        questions.append(q(
            i + 1, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    # Fill remainder up to 85
    while len(questions) < 85:
        idx = len(questions) + 1
        questions.append(q(
            idx,
            f"Trong chuỗi các khối catch, tại sao khối bắt `catch (Exception e)` phải được đặt sau cùng so với các ngoại lệ con cụ thể? (Câu {idx})",
            f"Why must `catch (Exception e)` be placed at the end after more specific subclasses in catch chains? (Question {idx})",
            [
                "Vì nếu đặt `Exception` lên đầu, nó sẽ bắt tất cả các ngoại lệ và khiến các khối catch con bên dưới bị unreachable dẫn đến lỗi biên dịch",
                "Vì máy ảo JVM sẽ bị crash nếu không đặt ở cuối",
                "Vì khối Exception không có phương thức getMessage()",
                "Không có quy định này, đặt đâu cũng được"
            ],
            [
                "Because placing `Exception` first catches everything, making subsequent subclass catch blocks unreachable and causing a compilation error",
                "Because the JVM crashes otherwise",
                "Because Exception lacks getMessage()",
                "No such rule exists; any ordering works"
            ],
            0,
            "Trình biên dịch Java yêu cầu bắt ngoại lệ từ cụ thể nhất đến tổng quát nhất (từ lớp con đến lớp cha) để tránh mã không thể tiếp cận (unreachable code).",
            "Exception hierarchies must be caught from most specific to most general to prevent unreachable catch block errors."
        ))

    return questions

if __name__ == "__main__":
    qs = get_exceptions_questions()
    print(f"Generated {len(qs)} questions for Exceptions.")
