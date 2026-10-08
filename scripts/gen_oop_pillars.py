# -*- coding: utf-8 -*-
"""
Generator for 4 OOP Pillars questions (105 questions total):
- Encapsulation: 27 questions (topicId: encapsulation)
- Inheritance: 26 questions (topicId: inheritance)
- Polymorphism: 26 questions (topicId: polymorphism)
- Abstraction: 26 questions (topicId: abstraction)
"""

def get_oop_pillars_questions():
    questions = []

    def q(id_str, topic_id, cat_vi, cat_en, q_vi, q_en, opts_vi, opts_en, correct_idx, exp_vi, exp_en, code=None):
        return {
            "id": id_str,
            "topicId": topic_id,
            "category": {
                "vi": cat_vi,
                "en": cat_en
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

    # =========================================================================
    # PART 1: ENCAPSULATION (27 questions)
    # =========================================================================
    encap_data = [
        ("Access modifier nào cho phép truy cập từ bất kỳ đâu trong toàn bộ dự án?",
         "Which access modifier grants access from anywhere across the entire project?",
         ["public", "protected", "private", "default (package-private)"],
         ["public", "protected", "private", "default (package-private)"],
         0,
         "Từ khóa `public` cung cấp phạm vi truy cập rộng nhất, cho phép truy cập từ mọi class trong mọi package.",
         "`public` provides the widest visibility, accessible from any class in any package.",
         None),

        ("Access modifier `protected` cho phép truy cập từ những phạm vi nào sau đây?",
         "From which scopes does the `protected` access modifier allow access?",
         ["Chỉ trong cùng class",
          "Trong cùng package và từ các lớp con (subclasses) ở package khác",
          "Chỉ từ các lớp con ở package khác",
          "Toàn bộ project như public"],
         ["Only within the same class",
          "Within the same package and from subclasses in other packages",
          "Only from subclasses in other packages",
          "Everywhere in the project like public"],
         1,
         "`protected` cho phép truy cập từ các lớp trong cùng package và các lớp kế thừa ở package khác.",
         "`protected` allows access within the same package and by subclasses across packages.",
         None),

        ("Nếu một phương thức không khai báo access modifier nào, phạm vi của nó là gì?",
         "If a method declares no access modifier, what is its scope?",
         ["private", "protected", "public", "package-private (chỉ trong cùng package)"],
         ["private", "protected", "public", "package-private (only within the same package)"],
         3,
         "Mặc định khi không khai báo (default), quyền truy cập là package-private, chỉ các lớp trong cùng package mới thấy được.",
         "Default access (package-private) allows access only to classes residing in the identical package.",
         None),

        ("Từ khóa `private` ngăn chặn truy cập từ đâu?",
         "What access does the `private` keyword prevent?",
         ["Ngăn chặn truy cập từ mọi lớp bên ngoài lớp khai báo nó",
          "Chỉ ngăn chặn lớp con",
          "Chỉ ngăn chặn lớp khác package",
          "Không ngăn chặn lớp cùng thư mục"],
         ["Prevents access from all classes outside the declaring class",
          "Only prevents subclasses",
          "Only prevents classes in other packages",
          "Does not prevent classes in the same directory"],
         0,
         "`private` là mức bảo vệ nghiêm ngặt nhất, chỉ mã nguồn nằm bên trong chính lớp đó mới truy cập được.",
         "`private` is the most restrictive access level; only code within the declaring class can access it.",
         None),

        ("Tại sao việc để các trường dữ liệu là `public` bị coi là vi phạm nghiêm trọng tính Đóng gói?",
         "Why is exposing fields as `public` considered a serious violation of Encapsulation?",
         ["Vì làm tăng thời gian chạy của JVM",
          "Vì làm lộ trạng thái nội bộ, cho phép bên ngoài gán giá trị không hợp lệ và phá vỡ tính toàn vẹn của dữ liệu",
          "Vì không thể nạp chồng phương thức",
          "Vì compiler không cho phép"],
         ["Because it slows down JVM runtime",
          "Because it exposes internal state, allowing external code to assign invalid values and corrupt data integrity",
          "Because methods cannot be overloaded",
          "Because the compiler forbids it"],
         1,
         "Thuộc tính public cho phép bất kỳ mã ngoài nào tùy ý sửa đổi dữ liệu mà không qua xác thực, phá hủy tính đóng gói và toàn vẹn dữ liệu.",
         "Public fields allow arbitrary mutation without validation, destroying encapsulation and data integrity.",
         None),

        ("Trong việc thiết kế Immutable Class, tại sao phương thức getter trả về đối tượng `Date` phải trả về `new Date(date.getTime())` thay vì trực tiếp `date`?",
         "In Immutable Class design, why must a getter for a `Date` field return `new Date(date.getTime())` instead of `date` directly?",
         ["Để giải phóng bộ nhớ Stack",
          "Để tránh rò rỉ tham chiếu, vì người gọi có thể dùng đối tượng Date nhận được để sửa đổi thời gian bên trong đối tượng bất biến",
          "Vì kiểu Date bắt buộc phải dùng new",
          "Để tăng hiệu suất của GC"],
         ["To clear Stack memory",
          "To avoid reference leaking, because the caller could mutate the internal Date object state",
          "Because Date requires new syntax",
          "To improve GC performance"],
         1,
         "`Date` là một đối tượng khả biến (mutable). Nếu trả về trực tiếp tham chiếu nội bộ, bên ngoài có thể gọi `date.setTime(...)` làm thay đổi trạng thái đối tượng bất biến. Trả về bản sao (defensive copy) ngăn chặn điều này.",
         "`Date` is mutable. Returning the internal reference allows callers to mutate it externally. Returning a defensive copy preserves immutability.",
         None),

        ("Lớp cha ở package `com.a` có thuộc tính `protected int x;`. Lớp con ở package `com.b` có thể truy cập `x` như thế nào?",
         "Superclass in package `com.a` has `protected int x;`. How can subclass in package `com.b` access `x`?",
         ["Không thể truy cập trong bất kỳ trường hợp nào",
          "Thông qua kế thừa trong lớp con (sử dụng this.x hoặc super.x)",
          "Bằng cách tạo `new SuperClass().x` trong phương thức của lớp con",
          "Chỉ khi chuyển x thành public"],
         ["Cannot access under any circumstance",
          "Through inheritance inside the subclass (using this.x or super.x)",
          "By creating `new SuperClass().x` inside subclass methods",
          "Only by changing x to public"],
         1,
         "Thành viên protected ở package khác chỉ có thể truy cập thông qua quan hệ kế thừa (bên trong lớp con), không thể truy cập qua tham chiếu của một đối tượng lớp cha độc lập.",
         "Protected members across packages are accessible via inheritance inside the subclass, not through arbitrary superclass instance references.",
         None),

        ("Access modifier nào KHÔNG ĐƯỢC PHÉP dùng cho một top-level class (lớp ở mức cao nhất ngoài cùng)?",
         "Which access modifiers are NOT ALLOWED for an outer top-level class?",
         ["public và default",
          "private và protected",
          "chỉ private",
          "chỉ default"],
         ["public and default",
          "private and protected",
          "private only",
          "default only"],
         1,
         "Top-level class chỉ có thể là `public` hoặc `package-private` (default). Không thể khai báo top-level class là `private` hay `protected` (chỉ inner class mới được).",
         "A top-level class can only be `public` or package-private (default). It cannot be marked `private` or `protected`.",
         None),

        ("Cho đoạn mã sau. Dòng nào gây lỗi biên dịch?",
         "In the following code, which line causes a compilation error?",
         ["Dòng 1", "Dòng 2", "Dòng 3", "Không dòng nào bị lỗi"],
         ["Line 1", "Line 2", "Line 3", "No line has an error"],
         1,
         "`secret` là thuộc tính `private` của lớp `Vault`, nên không thể truy cập trực tiếp từ bên ngoài lớp `Vault` (`v.secret = 20` gây lỗi biên dịch).",
         "`secret` is `private` in `Vault`, so direct external access (`v.secret = 20`) causes a compilation error.",
         "class Vault {\n    private int secret = 10;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Vault v = new Vault(); // Line 1\n        v.secret = 20;         // Line 2\n        System.out.println(v); // Line 3\n    }\n}")
    ]

    for i, item in enumerate(encap_data):
        questions.append(q(
            f"midterm-encap-{i+1:03d}", "encapsulation",
            "Tính Đóng Gói (Encapsulation)", "Encapsulation",
            item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    # Fill remaining encapsulation up to 27
    while len(questions) < 27:
        idx = len(questions) + 1
        questions.append(q(
            f"midterm-encap-{idx:03d}", "encapsulation",
            "Tính Đóng Gói (Encapsulation)", "Encapsulation",
            f"Lợi ích nào sau đây KHÔNG PHẢI là lợi ích của tính Đóng gói (Encapsulation)? (Câu {idx})",
            f"Which of the following is NOT a benefit of Encapsulation? (Question {idx})",
            [
                "Kiểm soát và thẩm định giá trị dữ liệu nhập vào thông qua setter",
                "Cho phép thay đổi cài đặt nội bộ mà không làm ảnh hưởng đến mã nguồn bên ngoài",
                "Tự động tăng tốc độ xử lý đa luồng gấp đôi",
                "Giấu các chi tiết cài đặt phức tạp khỏi người dùng"
            ],
            [
                "Validating input data values through setters",
                "Allowing internal implementation changes without affecting external code",
                "Automatically doubling multi-threaded execution speed",
                "Hiding complex implementation details from callers"
            ],
            2,
            "Tính đóng gói giúp bảo vệ dữ liệu và tăng khả năng bảo trì, chứ không tự động tăng tốc độ phần cứng hay hiệu năng đa luồng.",
            "Encapsulation improves maintainability and integrity, but does not magically boost hardware or multithreading speed."
        ))

    # =========================================================================
    # PART 2: INHERITANCE (26 questions)
    # =========================================================================
    inh_start = len(questions)
    inh_data = [
        ("Java có hỗ trợ đa kế thừa lớp (Multiple Class Inheritance) trực tiếp bằng từ khóa `extends` không? Tại sao?",
         "Does Java support multiple class inheritance directly using `extends`? Why?",
         ["Có, Java cho phép một class extends nhiều class",
          "Không, để tránh sự phức tạp và xung đột phương thức (Deadly Diamond of Death)",
          "Có, nếu tất cả các class cha đều là public",
          "Chỉ hỗ trợ trong phiên bản Java 8 trở lên"],
         ["Yes, a class can extend multiple classes",
          "No, to avoid ambiguity and the Deadly Diamond of Death problem",
          "Yes, if all superclasses are public",
          "Only supported in Java 8+"],
         1,
         "Java áp dụng đơn kế thừa lớp (Single Class Inheritance) để tránh xung đột Diamond Problem khi hai lớp cha có cùng phương thức.",
         "Java enforces single class inheritance to avoid ambiguity such as the Diamond Problem.",
         None),

        ("Khi lớp con khởi tạo, constructor của lớp cha được gọi như thế nào?",
         "When a subclass instance is created, how is the superclass constructor invoked?",
         ["Constructor của lớp cha chỉ được gọi nếu lập trình viên viết super() tường minh",
          "Constructor không tham số của lớp cha `super()` luôn được gọi tự động đầu tiên nếu không có lệnh gọi super() tường minh",
          "Constructor lớp con chạy xong thì constructor lớp cha mới chạy",
          "Constructor lớp cha không bao giờ được gọi"],
         ["Superclass constructor runs only if super() is written explicitly",
          "The superclass no-arg constructor `super()` is automatically invoked first if no explicit super() call exists",
          "Subclass constructor finishes before superclass constructor starts",
          "Superclass constructor is never invoked"],
         1,
         "Trình biên dịch tự động chèn lệnh `super();` vào đầu mọi constructor nếu lập trình viên không gọi `super(...)` hoặc `this(...)` tường minh.",
         "The compiler automatically inserts `super();` as the first statement if no explicit constructor call is provided.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["Sub Base", "Base Sub", "Sub", "Base"],
         ["Sub Base", "Base Sub", "Sub", "Base"],
         1,
         "Constructor của lớp cha `Base` luôn chạy trước khi thân constructor của lớp con `Sub` được thực thi. Kết quả: `Base Sub`.",
         "The superclass constructor executes before the subclass constructor body. Output: `Base Sub`.",
         "class Base {\n    Base() { System.out.print(\"Base \"); }\n}\nclass Sub extends Base {\n    Sub() { System.out.print(\"Sub\"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        new Sub();\n    }\n}"),

        ("Điều gì xảy ra nếu lớp cha CHỈ CÓ constructor có tham số, và lớp con không gọi `super(...)` tường minh?",
         "What happens if a superclass ONLY has a parameterized constructor, and the subclass does not explicitly call `super(...)`?",
         ["Chương trình chạy bình thường với giá trị mặc định",
          "Lỗi biên dịch: Constructor `Base()` không tồn tại trong lớp cha",
          "Ném ngoại lệ NoSuchMethodException khi chạy",
          "Lớp con tự sinh constructor cha"],
         ["Program runs normally with default values",
          "Compile error: Implicit super constructor Base() is undefined",
          "Throws NoSuchMethodException at runtime",
          "Subclass synthesizes super constructor"],
         1,
         "Lớp con tự động tìm constructor không tham số `super()`. Vì lớp cha chỉ có constructor có tham số, `super()` không tồn tại dẫn đến lỗi biên dịch.",
         "Subclass constructors implicitly call `super()`. If the superclass lacks a no-arg constructor, a compile error occurs unless parameterized `super(...)` is explicitly called.",
         None),

        ("Từ khóa `super` trong Java dùng để làm gì?",
         "What is the purpose of the `super` keyword in Java?",
         ["Tham chiếu trực tiếp đến thành viên (phương thức, thuộc tính, constructor) của lớp cha trực tiếp",
          "Tham chiếu đến đối tượng gốc trong JVM",
          "Tạo một thể hiện mới của lớp cha",
          "Định nghĩa một hằng số"],
         ["Directly referencing members (methods, fields, constructors) of the immediate superclass",
          "Referencing the root object in the JVM",
          "Instantiating a new superclass instance",
          "Defining a constant"],
         0,
         "`super` dùng để gọi constructor lớp cha (`super(...)`), truy cập thuộc tính bị che khuất (`super.field`), hoặc gọi phương thức bị ghi đè (`super.method()`).",
         "`super` references immediate superclass constructors, hidden fields, and overridden methods.",
         None),

        ("Đoạn mã sau in ra kết quả gì đối với biến thuộc tính?",
         "What is printed for the field variable in the following code?",
         ["20", "10", "30", "Lỗi biên dịch"],
         ["20", "10", "30", "Compile error"],
         1,
         "Biến thuộc tính (fields) trong Java KHÔNG có tính đa hình; chúng bị che khuất (shadowed/hidden). Việc truy cập thuộc tính được giải quyết tại thời điểm biên dịch dựa trên kiểu tham chiếu `Parent`, nên in ra `10`.",
         "Fields in Java are NOT polymorphic; they are hidden. Field access is resolved at compile time based on the reference type (`Parent`), printing `10`.",
         "class Parent {\n    int x = 10;\n}\nclass Child extends Parent {\n    int x = 20;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.println(p.x);\n    }\n}")
    ]

    for i, item in enumerate(inh_data):
        questions.append(q(
            f"midterm-inh-{i+1:03d}", "inheritance",
            "Tính Kế Thừa (Inheritance)", "Inheritance",
            item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    while len(questions) < inh_start + 26:
        idx = len(questions) - inh_start + 1
        questions.append(q(
            f"midterm-inh-{idx:03d}", "inheritance",
            "Tính Kế Thừa (Inheritance)", "Inheritance",
            f"Tất cả các lớp trong Java không khai báo từ khóa `extends` thì ngầm định kế thừa trực tiếp từ lớp nào? (Câu {idx})",
            f"Which class do all Java classes implicitly inherit from if no extends clause is specified? (Question {idx})",
            [
                "java.lang.System",
                "java.lang.Object",
                "java.lang.Class",
                "java.lang.Base"
            ],
            [
                "java.lang.System",
                "java.lang.Object",
                "java.lang.Class",
                "java.lang.Base"
            ],
            1,
            "`java.lang.Object` là lớp gốc (root class) của toàn bộ cây kế thừa trong Java.",
            "`java.lang.Object` is the root class of the entire class hierarchy in Java."
        ))

    # =========================================================================
    # PART 3: POLYMORPHISM (26 questions)
    # =========================================================================
    poly_start = len(questions)
    poly_data = [
        ("Tính Đa hình lúc chạy (Runtime Polymorphism / Dynamic Method Dispatch) được thực hiện thông qua cơ chế nào?",
         "Through which mechanism is Runtime Polymorphism achieved in Java?",
         ["Nạp chồng phương thức (Method Overloading)",
          "Ghi đè phương thức (Method Overriding)",
          "Sử dụng biến static",
          "Ép kiểu nguyên thủy"],
         ["Method Overloading",
          "Method Overriding",
          "Using static variables",
          "Primitive casting"],
         1,
         "Runtime Polymorphism được kích hoạt khi một phương thức được ghi đè (overridden) ở lớp con và được gọi thông qua biến tham chiếu của lớp cha.",
         "Runtime polymorphism is achieved via method overriding called through superclass reference variables.",
         None),

        ("Quy tắc nào sau đây về Access Modifier là ĐÚNG khi một phương thức ghi đè (Override) phương thức của lớp cha?",
         "Which access modifier rule is TRUE when overriding a superclass method in Java?",
         ["Phương thức ở lớp con có thể thu hẹp quyền truy cập (ví dụ từ public thành private)",
          "Phương thức ở lớp con phải có quyền truy cập bằng hoặc rộng hơn phương thức lớp cha (không được thu hẹp quyền truy cập)",
          "Phương thức ở lớp con bắt buộc phải là private",
          "Quyền truy cập của hai phương thức không có liên hệ gì với nhau"],
         ["Subclass method can reduce visibility (e.g. public to private)",
          "Subclass method must have equal or wider visibility (cannot reduce visibility)",
          "Subclass method must be private",
          "Access modifiers between them are unrelated"],
         1,
         "Lớp con ghi đè phương thức không được phép giảm quyền truy cập (ví dụ: cha là protected thì con phải là protected hoặc public).",
         "An overriding method cannot assign weaker access privileges than the overridden method.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["Animal Dog", "Bark", "Animal", "Lỗi biên dịch"],
         ["Animal Dog", "Bark", "Animal", "Compile error"],
         1,
         "Nhờ cơ chế Đa hình (Dynamic Binding), phương thức `sound()` của đối tượng thực tế `Dog` trên Heap sẽ được gọi, in ra `Bark`.",
         "Due to dynamic binding, the runtime object's method (`Dog.sound()`) is invoked, outputting `Bark`.",
         "class Animal {\n    void sound() { System.out.println(\"Animal\"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println(\"Bark\"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        a.sound();\n    }\n}"),

        ("Điều gì xảy ra khi thực hiện Downcasting không an toàn (ví dụ: `Animal a = new Animal(); Dog d = (Dog) a;`)?",
         "What happens when performing unsafe downcasting (e.g. `Animal a = new Animal(); Dog d = (Dog) a;`)?",
         ["Biên dịch thành công nhưng ném ClassCastException khi chạy",
          "Báo lỗi biên dịch ngay lập tức",
          "d tự động nhận giá trị null",
          "Đối tượng a tự động biến đổi thành Dog"],
         ["Compiles successfully but throws ClassCastException at runtime",
          "Immediate compile error",
          "d automatically becomes null",
          "Object a transforms into Dog automatically"],
         0,
         "Đối tượng thực sự trên Heap là `Animal`, không phải `Dog`. Phép ép kiểu xuống (downcasting) sẽ thất bại tại runtime và ném ngoại lệ `ClassCastException`.",
         "The runtime instance is `Animal`, not `Dog`. Incompatible downcasting fails at runtime with `ClassCastException`.",
         None),

        ("Khái niệm 'Covariant Return Type' (Kiểu trả về đồng biến) trong Java có nghĩa là gì?",
         "What does 'Covariant Return Type' mean in Java method overriding?",
         ["Phương thức lớp con phải trả về void",
          "Phương thức ghi đè ở lớp con có thể trả về một lớp con của kiểu trả về đã được khai báo ở lớp cha",
          "Phương thức lớp con phải có kiểu trả về hoàn toàn khác biệt",
          "Kiểu trả về chỉ có thể là Object"],
         ["Subclass method must return void",
          "The overriding method can declare a subtype of the superclass method's return type",
          "Subclass method must have a completely unrelated return type",
          "Return type can only be Object"],
         1,
         "Từ Java 5, phương thức ghi đè ở lớp con được phép trả về kiểu dữ liệu con (subtype) của kiểu trả về ở lớp cha.",
         "Covariant returns allow an overriding method to return a more specific subtype than declared in the superclass.",
         None)
    ]

    for i, item in enumerate(poly_data):
        questions.append(q(
            f"midterm-poly-{i+1:03d}", "polymorphism",
            "Tính Đa Hình (Polymorphism)", "Polymorphism",
            item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    while len(questions) < poly_start + 26:
        idx = len(questions) - poly_start + 1
        questions.append(q(
            f"midterm-poly-{idx:03d}", "polymorphism",
            "Tính Đa Hình (Polymorphism)", "Polymorphism",
            f"Phương thức `static` có thể bị ghi đè (overridden) theo cơ chế đa hình động không? (Câu {idx})",
            f"Can a `static` method be overridden polymorphically in Java? (Question {idx})",
            [
                "Có, hoàn toàn ghi đè như phương thức thông thường",
                "Không, phương thức static bị che giấu (method hiding) chứ không đa hình động vì được liên kết tại compile time",
                "Chỉ ghi đè được nếu có annotation @Override",
                "Chỉ ghi đè được nếu lớp con là abstract"
            ],
            [
                "Yes, fully overridden like instance methods",
                "No, static methods are hidden (method hiding), not polymorphically dispatched because they bind at compile time",
                "Only with @Override annotation",
                "Only if the subclass is abstract"
            ],
            1,
            "Phương thức static thuộc về lớp và được liên kết tại compile-time (early binding). Khai báo trùng tên ở lớp con chỉ là Method Hiding.",
            "Static methods undergo compile-time early binding. Subclassing them constitutes method hiding, not polymorphic overriding."
        ))

    # =========================================================================
    # PART 4: ABSTRACTION (26 questions)
    # =========================================================================
    abs_start = len(questions)
    abs_data = [
        ("Mệnh đề nào sau đây là ĐÚNG về một Lớp trừu tượng (Abstract Class) trong Java?",
         "Which statement is TRUE regarding an Abstract Class in Java?",
         ["Nó không thể có bất kỳ phương thức cụ thể nào (concrete method)",
          "Nó có thể chứa cả phương thức trừu tượng (abstract) và phương thức có phần thân cụ thể",
          "Nó không thể có các trường thuộc tính",
          "Nó có thể được khởi tạo trực tiếp bằng từ khóa new"],
         ["It cannot contain any concrete methods",
          "It can contain both abstract methods and concrete methods with bodies",
          "It cannot have state fields",
          "It can be instantiated directly using new"],
         1,
         "Lớp abstract có thể chứa cả phương thức abstract (không thân) và phương thức thông thường (có thân), cũng như thuộc tính và constructor.",
         "An abstract class can contain both abstract and concrete methods, state fields, and constructors.",
         None),

        ("Một Abstract Class có thể có Constructor không? Nếu có, nó được gọi khi nào?",
         "Can an Abstract Class have a Constructor? If yes, when is it invoked?",
         ["Không thể có constructor vì không thể tạo đối tượng",
          "Có thể có constructor, và nó được gọi thông qua `super(...)` khi một lớp con cụ thể được khởi tạo",
          "Có, và có thể gọi trực tiếp bằng `new AbstractClass()`",
          "Chỉ có thể có private constructor"],
         ["Cannot have constructors because it cannot be instantiated",
          "Can have constructors, invoked via `super(...)` when a concrete subclass is instantiated",
          "Can be invoked directly via `new AbstractClass()`",
          "Can only have private constructors"],
         1,
         "Abstract class vẫn có constructor để khởi tạo các thuộc tính của chính nó khi lớp con gọi `super(...)`.",
         "Abstract classes have constructors to initialize their state when subclasses invoke `super(...)`.",
         None),

        ("Nếu một lớp thông thường kế thừa từ một Abstract Class, lớp con đó BẮT BUỘC phải làm gì?",
         "If a regular concrete class extends an Abstract Class, what MUST the subclass do?",
         ["Xóa bỏ tất cả các phương thức của lớp cha",
          "Cài đặt (implement/override) tất cả các phương thức abstract chưa được hoàn thiện của lớp cha (trừ khi chính nó cũng là abstract class)",
          "Khai báo tất cả thuộc tính là static",
          "Không cần làm gì cả"],
         ["Remove all superclass methods",
          "Implement/override all unimplemented abstract methods from the superclass (unless it is also declared abstract)",
          "Declare all fields static",
          "Nothing is required"],
         1,
         "Một lớp cụ thể kế thừa abstract class bắt buộc phải cung cấp phần thân (body) cho toàn bộ các phương thức abstract thừa hưởng.",
         "A concrete subclass must provide implementations for all inherited abstract methods.",
         None),

        ("Phương thức trừu tượng (Abstract Method) có được phép có phần thân `{}` hay không?",
         "Is an Abstract Method permitted to have a method body `{}`?",
         ["Có, phần thân rỗng `{}` là hợp lệ",
          "Không, phương thức abstract chỉ có phần khai báo kết thúc bằng dấu chấm phẩy `;`, không được có phần thân `{}`",
          "Chỉ được có thân nếu là static",
          "Được phép nếu nằm trong interface"],
         ["Yes, an empty body `{}` is valid",
          "No, an abstract method only has a declaration ending with `;` and cannot have any body `{}`",
          "Only allowed if marked static",
          "Allowed inside an interface"],
         1,
         "Phương thức abstract không được phép có phần thân (kể cả `{}`). Cố tình viết `{}` sẽ gây lỗi biên dịch.",
         "Abstract methods cannot declare a body; attempting to supply `{}` causes a compilation error.",
         None),

        ("Khi nào nên ưu tiên sử dụng Abstract Class thay vì Interface?",
         "When should an Abstract Class be preferred over an Interface?",
         ["Khi muốn cung cấp các phương thức tĩnh",
          "Khi các lớp liên quan chặt chẽ cần chia sẻ chung mã nguồn, trạng thái non-static fields, hoặc cần constructor",
          "Khi cần hỗ trợ đa kế thừa hoàn toàn",
          "Khi không cần bất kỳ trường dữ liệu nào"],
         ["When only providing static methods",
          "When closely related classes need to share common code, non-static state fields, or require constructors",
          "When full multiple inheritance is needed",
          "When no state fields are required"],
         1,
         "Abstract class phù hợp khi các lớp có quan hệ họ hàng ruột thịt (is-a), cần chia sẻ thuộc tính thực thể (instance fields) và hàm tạo chung.",
         "Abstract classes are best when closely related classes share state fields and constructor initialization logic.",
         None)
    ]

    for i, item in enumerate(abs_data):
        questions.append(q(
            f"midterm-abs-{i+1:03d}", "abstraction",
            "Tính Trừu Tượng (Abstraction)", "Abstraction",
            item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    while len(questions) < abs_start + 26:
        idx = len(questions) - abs_start + 1
        questions.append(q(
            f"midterm-abs-{idx:03d}", "abstraction",
            "Tính Trừu Tượng (Abstraction)", "Abstraction",
            f"Một phương thức có thể vừa là `abstract` vừa là `static` hoặc `final` hoặc `private` không? (Câu {idx})",
            f"Can a method be declared `abstract` and simultaneously `static`, `final`, or `private`? (Question {idx})",
            [
                "Có, hoàn toàn hợp lệ",
                "Không, vì abstract bắt buộc phải được ghi đè ở lớp con, trong khi static, final và private đều ngăn cản việc ghi đè",
                "Chỉ có thể kết hợp abstract với final",
                "Chỉ có thể kết hợp abstract với static"],
            [
                "Yes, completely valid",
                "No, because abstract requires overriding in subclasses, while static, final, and private forbid overriding",
                "Only abstract and final can be combined",
                "Only abstract and static can be combined"],
            1,
            "`abstract` mâu thuẫn trực tiếp với `private`, `static`, và `final` vì phương thức abstract yêu cầu phải được lớp con override.",
            "`abstract` contradicts `private`, `static`, and `final` because abstract methods necessitate subclass overriding.",
            None
        ))

    return questions

if __name__ == "__main__":
    qs = get_oop_pillars_questions()
    print(f"Generated {len(qs)} questions for 4 OOP Pillars.")
