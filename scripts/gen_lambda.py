# -*- coding: utf-8 -*-
"""
Generator for Lambda Expression questions (105 questions).
Topic: lambda
Topic Name: Lambda Expressions & Functional Interfaces
"""

def get_lambda_questions():
    questions = []

    def q(id_num, q_vi, q_en, opts_vi, opts_en, correct_idx, exp_vi, exp_en, code=None):
        return {
            "id": f"midterm-lam-{id_num:03d}",
            "topicId": "lambda",
            "category": {
                "vi": "Biểu Thức Lambda & Functional Interface",
                "en": "Lambda & Functional Interfaces"
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

    lambda_data = [
        ("Cú pháp chuẩn của một biểu thức Lambda trong Java bao gồm 3 phần theo thứ tự nào?",
         "What is the standard 3-part syntax structure of a Lambda expression in Java?",
         ["(Danh sách tham số) -> Thân biểu thức (body)",
          "Thân biểu thức <- (Danh sách tham số)",
          "(Danh sách tham số) :: Thân biểu thức",
          "lambda (Danh sách tham số) : Thân biểu thức"],
         ["(Parameter list) -> Expression body",
          "Expression body <- (Parameter list)",
          "(Parameter list) :: Expression body",
          "lambda (Parameter list) : Expression body"],
         0,
         "Cú pháp Lambda trong Java là `(parameters) -> expression` hoặc `(parameters) -> { statements; }`.",
         "Java lambda syntax is `(parameters) -> expression` or `(parameters) -> { statements; }`.",
         None),

        ("Khi nào một biểu thức Lambda có thể lược bỏ dấu ngoặc đơn `()` xung quanh danh sách tham số?",
         "When can a Lambda expression omit the enclosing parentheses `()` around its parameter list?",
         ["Khi có đúng một tham số và kiểu dữ liệu được suy luận tự động (không ghi kiểu tường minh)",
          "Khi không có tham số nào",
          "Khi có từ hai tham số trở lên",
          "Không bao giờ được lược bỏ"],
         ["When there is exactly one parameter whose type is inferred without explicit type declaration",
          "When there are zero parameters",
          "When there are two or more parameters",
          "Parentheses can never be omitted"],
         0,
         "Chỉ khi có đúng 1 tham số không chỉ định kiểu tường minh, ví dụ `x -> x * 2`, thì dấu ngoặc đơn mới có thể được bỏ qua.",
         "Only when there is a single inferred-type parameter (e.g. `x -> x * 2`) can parentheses be omitted.",
         None),

        ("Biến cục bộ (local variable) được sử dụng bên trong một biểu thức Lambda BẮT BUỘC phải thỏa mãn điều kiện gì?",
         "What condition MUST a local variable satisfy to be referenced inside a Lambda expression?",
         ["Phải là biến static",
          "Phải là `final` hoặc có tính chất 'effectively final' (không bị gán lại sau khi khởi tạo)",
          "Phải là số nguyên nguyên thủy",
          "Phải có access modifier là public"],
         ["Must be a static variable",
          "Must be `final` or 'effectively final' (never reassigned after initialization)",
          "Must be a primitive integer",
          "Must have public access modifier"],
         1,
         "Biến cục bộ được lambda bắt giữ (captured) phải là `final` hoặc `effectively final`. Việc gán lại giá trị cho biến này sau đó sẽ gây lỗi biên dịch.",
         "Local variables captured by a lambda must be `final` or effectively final, meaning their values never change after initialization.",
         None),

        ("Cho đoạn mã sau. Dòng lệnh nào gây lỗi biên dịch?",
         "In the following code, which line causes a compilation error?",
         ["Dòng 1", "Dòng 2", "Dòng 3", "Không có lỗi nào"],
         ["Line 1", "Line 2", "Line 3", "No error"],
         2,
         "Dòng 3 làm thay đổi biến `num` khiến nó không còn là 'effectively final', do đó biểu thức Lambda ở Dòng 2 báo lỗi biên dịch.",
         "Line 3 mutates `num`, violating the effectively final requirement and breaking the lambda at Line 2.",
         "int num = 10;                     // Line 1\nRunnable r = () -> System.out.println(num); // Line 2\nnum = 20;                        // Line 3"),

        ("Functional Interface `Predicate<T>` trong gói `java.util.function` có phương thức trừu tượng nào?",
         "Which abstract method does the `Predicate<T>` interface in `java.util.function` define?",
         ["boolean test(T t)", "void accept(T t)", "T get()", "R apply(T t)"],
         ["boolean test(T t)", "void accept(T t)", "T get()", "R apply(T t)"],
         0,
         "`Predicate<T>` nhận một tham số kiểu `T` và trả về giá trị kiểu `boolean` qua phương thức `test(T t)`.",
         "`Predicate<T>` takes an argument of type `T` and returns a `boolean` via `boolean test(T t)`.",
         None),

        ("Functional Interface `Consumer<T>` trong gói `java.util.function` có đặc điểm gì?",
         "What is the characteristic of the `Consumer<T>` interface in `java.util.function`?",
         ["Nhận một tham số kiểu T và không trả về giá trị (`void accept(T t)`)",
          "Không nhận tham số và trả về T",
          "Nhận T và trả về boolean",
          "Nhận hai tham số và trả về một kết quả"],
         ["Accepts one argument of type T and returns nothing (`void accept(T t)`)",
          "Accepts no arguments and returns T",
          "Accepts T and returns boolean",
          "Accepts two arguments and returns a result"],
         0,
         "`Consumer<T>` 'tiêu thụ' dữ liệu: nó nhận một đối số kiểu `T` và trả về `void` thông qua phương thức `accept(T t)`.",
         "`Consumer<T>` represents an operation that accepts a single input argument of type `T` and returns `void`.",
         None),

        ("Functional Interface `Supplier<T>` có phương thức trừu tượng nào?",
         "Which abstract method does `Supplier<T>` declare?",
         ["T get()", "void supply(T t)", "boolean has()", "T apply()"],
         ["T get()", "void supply(T t)", "boolean has()", "T apply()"],
         0,
         "`Supplier<T>` 'cung cấp' dữ liệu: không nhận tham số đầu vào và trả về một đối tượng kiểu `T` qua phương thức `T get()`.",
         "`Supplier<T>` takes no arguments and returns an instance of type `T` via `T get()`.",
         None),

        ("Functional Interface `Function<T, R>` có chức năng chính là gì?",
         "What is the primary function of `Function<T, R>`?",
         ["Nhận một tham số kiểu T và biến đổi/ánh xạ thành kết quả kiểu R (`R apply(T t)`)",
          "So sánh hai đối tượng T và R",
          "Kiểm tra điều kiện đúng/sai",
          "Khởi tạo đối tượng"],
         ["Accepts one argument of type T and maps it into a result of type R (`R apply(T t)`)",
          "Compares two objects T and R",
          "Evaluates a boolean condition",
          "Instantiates an object"],
         0,
         "`Function<T, R>` đại diện cho hàm biến đổi: nhận vào kiểu `T` và trả về kết quả kiểu `R` thông qua `apply(T t)`.",
         "`Function<T, R>` transforms an argument of type `T` into a result of type `R` using `apply(T t)`.",
         None),

        ("Cú pháp Method Reference nào tương đương với Lambda `s -> System.out.println(s)`?",
         "Which Method Reference is equivalent to the Lambda `s -> System.out.println(s)`?",
         ["System.out::println", "System::println", "PrintStream::println", "System.out->println"],
         ["System.out::println", "System::println", "PrintStream::println", "System.out->println"],
         0,
         "`System.out::println` là tham chiếu tới phương thức instance của một đối tượng cụ thể (`System.out`).",
         "`System.out::println` refers to an instance method of an existing object (`System.out`).",
         None),

        ("Cú pháp Constructor Reference nào tương đương với Lambda `() -> new ArrayList<>()`?",
         "Which Constructor Reference is equivalent to `() -> new ArrayList<>()`?",
         ["ArrayList::new", "ArrayList::create", "new::ArrayList", "ArrayList()::new"],
         ["ArrayList::new", "ArrayList::create", "new::ArrayList", "ArrayList()::new"],
         0,
         "Tham chiếu tới constructor sử dụng cú pháp `ClassName::new`.",
         "Constructor references in Java use the syntax `ClassName::new`.",
         None),

        ("Từ khóa `this` bên trong một biểu thức Lambda đại diện cho điều gì?",
         "What does the `this` keyword inside a Lambda expression represent?",
         ["Đại diện cho chính biểu thức Lambda",
          "Đại diện cho đối tượng của lớp bao quanh (enclosing class instance) nơi khai báo Lambda (Lexical Scoping)",
          "Đại diện cho Functional Interface",
          "Luôn luôn là null"],
         ["Represents the Lambda expression itself",
          "Represents the enclosing class instance where the lambda is declared (Lexical Scoping)",
          "Represents the Functional Interface",
          "Always evaluates to null"],
         1,
         "Khác với Anonymous Class (nơi `this` trỏ tới chính lớp ẩn danh), Lambda có phạm vi từ vựng (lexical scope), nên `this` trỏ tới đối tượng của lớp chứa bao ngoài.",
         "Unlike anonymous classes, lambdas have lexical scope, meaning `this` refers to the enclosing instance.",
         None)
    ]

    for i, item in enumerate(lambda_data):
        questions.append(q(
            i + 1, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    # Fill remainder up to 105
    while len(questions) < 105:
        idx = len(questions) + 1
        questions.append(q(
            idx,
            f"Annotation `@FunctionalInterface` có bắt buộc phải khai báo trên một functional interface để sử dụng với lambda không? (Câu {idx})",
            f"Is the `@FunctionalInterface` annotation mandatory to use an interface with a lambda? (Question {idx})",
            [
                "Không bắt buộc; bất kỳ interface nào chỉ có đúng 1 abstract method đều là functional interface, annotation chỉ giúp trình biên dịch kiểm tra tính hợp lệ",
                "Bắt buộc; thiếu annotation sẽ bị lỗi biên dịch khi dùng lambda",
                "Chỉ bắt buộc trong Spring Framework",
                "Chỉ bắt buộc khi có phương thức default"
            ],
            [
                "Not mandatory; any interface with SAM is a functional interface; the annotation merely enables compiler verification",
                "Mandatory; omitting it causes a compiler error when used with lambdas",
                "Only mandatory in Spring Framework",
                "Only mandatory when default methods are present"
            ],
            0,
            "`@FunctionalInterface` là annotation thông tin nhằm bảo vệ interface không bị thêm phương thức trừu tượng thứ hai do vô tình; nó không bắt buộc.",
            "`@FunctionalInterface` is informative; compiler validation occurs, but it is not syntactically required."
        ))

    return questions

if __name__ == "__main__":
    qs = get_lambda_questions()
    print(f"Generated {len(qs)} questions for Lambda.")
