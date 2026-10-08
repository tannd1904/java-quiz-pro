# -*- coding: utf-8 -*-
"""
Generator for Objects and Classes questions (105 questions).
Topic: objects_classes
Topic Name: Objects and Classes (Lop va Doi tuong)
"""

def get_objects_classes_questions():
    questions = []
    
    # Template helper
    def q(id_num, question_vi, question_en, options_vi, options_en, correct_idx, explanation_vi, explanation_en, code=None):
        return {
            "id": f"midterm-obj-{id_num:03d}",
            "topicId": "objects_classes",
            "category": {
                "vi": "Lớp và Đối tượng (Objects & Classes)",
                "en": "Objects and Classes"
            },
            "question": {
                "vi": question_vi,
                "en": question_en
            },
            "codeSnippet": code,
            "image": null if False else None,
            "options": {
                "vi": options_vi,
                "en": options_en
            },
            "correctIndex": correct_idx,
            "explanation": {
                "vi": explanation_vi,
                "en": explanation_en
            }
        }

    # 1-15: Core Concepts (Class vs Object, Heap/Stack, References)
    questions.append(q(
        1,
        "Trong Java, sự khác biệt cơ bản nhất giữa một Lớp (Class) và một Đối tượng (Object) là gì?",
        "In Java, what is the most fundamental difference between a Class and an Object?",
        [
            "Lớp là khuôn mẫu/bản thiết kế (blueprint), còn đối tượng là một thể hiện cụ thể (instance) được tạo ra từ khuôn mẫu đó trong bộ nhớ",
            "Lớp được lưu trên Heap, còn đối tượng được lưu trên Stack",
            "Lớp chỉ chứa phương thức, còn đối tượng chỉ chứa dữ liệu thuộc tính",
            "Lớp có thể tạo ra bằng từ khóa new, còn đối tượng được khai báo trực tiếp"
        ],
        [
            "A Class is a blueprint/template, while an Object is a concrete instance created from that blueprint in memory",
            "A Class is stored on the Heap, while an Object is stored on the Stack",
            "A Class only contains methods, while an Object only contains attributes",
            "A Class can be created using the new keyword, while an Object is declared directly"
        ],
        0,
        "Lớp (Class) là khuôn mẫu định nghĩa cấu trúc dữ liệu và hành vi, trong khi Đối tượng (Object) là thực thể cụ thể chiếm dụng bộ nhớ trong thời gian chạy (runtime instance).",
        "A Class is a blueprint defining structure and behavior, while an Object is a runtime instance occupying heap memory."
    ))

    questions.append(q(
        2,
        "Khi thực hiện lệnh `Car myCar = new Car();`, đối tượng thực sự được cấp phát tại vùng nhớ nào trong JVM?",
        "When executing `Car myCar = new Car();`, where is the actual object allocated in JVM memory?",
        [
            "Stack memory",
            "Heap memory",
            "Metaspace (Method Area)",
            "PC Register"
        ],
        [
            "Stack memory",
            "Heap memory",
            "Metaspace (Method Area)",
            "PC Register"
        ],
        1,
        "Mọi đối tượng (instances) trong Java được cấp phát trên Heap. Biến tham chiếu `myCar` nằm trên Stack và trỏ đến địa chỉ của đối tượng trên Heap.",
        "All objects in Java are allocated on the Heap. The reference variable `myCar` resides on the Stack and points to the object on the Heap."
    ))

    questions.append(q(
        3,
        "Biến tham chiếu `myCar` trong câu lệnh `Car myCar = new Car();` được lưu trữ ở đâu?",
        "Where is the reference variable `myCar` stored in the statement `Car myCar = new Car();`?",
        [
            "Trên Heap cùng với đối tượng",
            "Trên Stack (nếu nó là biến cục bộ trong một phương thức)",
            "Trong String Pool",
            "Trong CPU Cache"
        ],
        [
            "On the Heap together with the object",
            "On the Stack (if it is a local variable inside a method)",
            "In the String Pool",
            "In the CPU Cache"
        ],
        1,
        "Biến cục bộ (local variable) lưu giá trị tham chiếu (địa chỉ ô nhớ) trên Stack của luồng thực thi.",
        "A local reference variable stores the memory address reference on the thread's Stack."
    ))

    questions.append(q(
        4,
        "Giá trị mặc định của biến thể hiện (instance variable) kiểu `int`, `boolean` và kiểu tham chiếu (reference type) khi không được gán tường minh lần lượt là gì?",
        "What are the default values of an uninitialized instance variable of type `int`, `boolean`, and reference type respectively?",
        [
            "0, false, null",
            "0, true, null",
            "rác (garbage value), false, undefined",
            "null, false, 0"
        ],
        [
            "0, false, null",
            "0, true, null",
            "garbage value, false, undefined",
            "null, false, 0"
        ],
        0,
        "Biến thể hiện trong Java tự động nhận giá trị mặc định khi đối tượng được khởi tạo: số nguyên là 0, số thực là 0.0, boolean là false, kiểu tham chiếu là null.",
        "Instance variables in Java automatically receive default values: integer types are 0, boolean is false, and reference types are null."
    ))

    questions.append(q(
        5,
        "Điều gì xảy ra khi bạn sử dụng một biến cục bộ (local variable) trong phương thức mà chưa khởi tạo giá trị cho nó?",
        "What happens when you use an uninitialized local variable inside a method?",
        [
            "Biến tự động nhận giá trị 0 hoặc null",
            "Trình biên dịch báo lỗi Compile-time Error: 'variable might not have been initialized'",
            "Chương trình ném ra ngoại lệ NullPointerException khi chạy",
            "Biến chứa giá trị rác ngẫu nhiên từ bộ nhớ"
        ],
        [
            "The variable automatically receives 0 or null",
            "The compiler produces a Compile-time Error: 'variable might not have been initialized'",
            "The program throws NullPointerException at runtime",
            "The variable contains a random garbage value from memory"
        ],
        1,
        "Khác với biến thể hiện (instance variable), biến cục bộ trong Java KHÔNG có giá trị mặc định và bắt buộc phải được gán giá trị trước khi sử dụng, nếu không sẽ bị lỗi biên dịch.",
        "Unlike instance variables, local variables in Java do NOT receive default values and must be initialized before use, otherwise a compilation error occurs."
    ))

    questions.append(q(
        6,
        "Cho đoạn mã sau. Kết quả xuất ra màn hình là gì?",
        "Consider the following code. What is the output?",
        [
            "x = 10",
            "x = 0",
            "Lỗi biên dịch: biến x bị trùng tên",
            "Lỗi Runtime: NullPointerException"
        ],
        [
            "x = 10",
            "x = 0",
            "Compile error: duplicate variable name x",
            "Runtime error: NullPointerException"
        ],
        1,
        "Trong phương thức `setX`, tham số `x` che khuất (shadows) thuộc tính `this.x`. Phép gán `x = x;` chỉ gán tham số cho chính nó, không làm thay đổi thuộc tính `this.x`, nên `x` của đối tượng vẫn giữ giá trị mặc định là 0.",
        "In `setX`, parameter `x` shadows field `this.x`. The assignment `x = x;` assigns the parameter to itself and does not affect the instance field, so `x` remains 0.",
        code="public class Point {\n    int x;\n    public void setX(int x) {\n        x = x;\n    }\n    public static void main(String[] args) {\n        Point p = new Point();\n        p.setX(10);\n        System.out.println(\"x = \" + p.x);\n    }\n}"
    ))

    questions.append(q(
        7,
        "Từ khóa `this` trong Java đại diện cho điều gì?",
        "What does the `this` keyword represent in Java?",
        [
            "Đại diện cho lớp cha của đối tượng hiện tại",
            "Tham chiếu trỏ đến đối tượng hiện tại đang thực thi phương thức hoặc hàm tạo",
            "Tham chiếu trỏ đến biến tĩnh toàn cục",
            "Một từ khóa dùng để cấp phát bộ nhớ mới"
        ],
        [
            "Represents the superclass of the current object",
            "A reference pointing to the current object executing the method or constructor",
            "A reference pointing to a global static variable",
            "A keyword used to allocate new memory"
        ],
        1,
        "`this` là một biến tham chiếu đặc biệt trỏ đến chính đối tượng hiện tại (current instance) đang gọi phương thức hoặc đang được khởi tạo.",
        "`this` is a special reference variable that points to the current object instance invoking the method or constructor."
    ))

    questions.append(q(
        8,
        "Tại sao không thể sử dụng từ khóa `this` bên trong một phương thức `static`?",
        "Why can the `this` keyword NOT be used inside a `static` method?",
        [
            "Vì phương thức static thuộc về Class chứ không thuộc về bất kỳ instance (đối tượng) cụ thể nào",
            "Vì từ khóa this chỉ được dùng trong class cha",
            "Vì từ khóa this làm giảm hiệu năng bộ nhớ",
            "Vì phương thức static luôn trả về void"
        ],
        [
            "Because static methods belong to the Class and not to any specific instance (object)",
            "Because this can only be used in superclasses",
            "Because this decreases memory performance",
            "Because static methods always return void"
        ],
        0,
        "Phương thức static được nạp cùng class và có thể gọi trực tiếp qua tên class mà không cần tạo đối tượng. Do đó, không có khái niệm 'đối tượng hiện tại' (`this`) trong ngữ cảnh static.",
        "Static methods belong to the class and can be invoked without creating an instance. Therefore, no 'current instance' (`this`) exists in a static context."
    ))

    questions.append(q(
        9,
        "Cho đoạn mã sau. Đoạn mã này có biên dịch thành công không?",
        "Consider the following code. Does it compile successfully?",
        [
            "Có, in ra: Name: Alice, Age: 20",
            "Không, lỗi biên dịch vì `this(\"Alice\");` phải là câu lệnh đầu tiên trong hàm tạo",
            "Không, lỗi biên dịch vì không được phép gọi hàm tạo khác qua `this()`",
            "Chạy bị đệ quy vô hạn (StackOverflowError)"
        ],
        [
            "Yes, prints: Name: Alice, Age: 20",
            "No, compile error because `this(\"Alice\");` must be the first statement in the constructor",
            "No, compile error because calling another constructor via `this()` is not allowed",
            "Throws StackOverflowError due to infinite recursion"
        ],
        1,
        "Trong Java, lệnh gọi hàm tạo khác `this(...)` hoặc hàm tạo lớp cha `super(...)` BẮT BUỘC phải là câu lệnh đầu tiên trong thân hàm tạo. Đặt câu lệnh in phía trước gây lỗi biên dịch.",
        "In Java, constructor chaining calls `this(...)` or `super(...)` MUST be the first statement in the constructor body. Putting a print statement first results in a compile error.",
        code="public class Student {\n    String name;\n    int age;\n    public Student(String name) {\n        this.name = name;\n    }\n    public Student(String name, int age) {\n        System.out.println(\"Init student\");\n        this(name);\n        this.age = age;\n    }\n}"
    ))

    questions.append(q(
        10,
        "Khi một lớp không khai báo bất kỳ constructor nào, trình biên dịch Java sẽ làm gì?",
        "What does the Java compiler do when a class declares no constructors?",
        [
            "Báo lỗi biên dịch vì mọi lớp phải có ít nhất một constructor",
            "Tự động tạo một Default Constructor (constructor mặc định không tham số, thân rỗng)",
            "Tạo một constructor nhận tất cả các trường dữ liệu làm tham số",
            "Không tạo gì cả và ngăn người dùng tạo đối tượng bằng từ khóa new"
        ],
        [
            "Reports a compile error because every class must have at least one constructor",
            "Automatically generates a Default Constructor (no-arg constructor with empty body)",
            "Generates a constructor taking all fields as parameters",
            "Generates nothing and prevents instantiating the class using new"
        ],
        1,
        "Nếu lập trình viên không viết bất kỳ constructor nào, trình biên dịch Java sẽ tự động tạo một default constructor không tham số (no-argument constructor).",
        "If a programmer provides no constructor, the Java compiler automatically synthesizes a default no-argument constructor."
    ))

    questions.append(q(
        11,
        "Nếu một lớp đã có một constructor có tham số như `public Book(String title) {}`, trình biên dịch có tự động tạo Default Constructor không tham số nữa không?",
        "If a class explicitly defines a parameterized constructor like `public Book(String title) {}`, does the compiler still generate a default no-arg constructor?",
        [
            "Có, trình biên dịch luôn luôn tạo default constructor trong mọi trường hợp",
            "Không, khi đã có ít nhất một constructor tường minh, Java sẽ KHÔNG tự sinh default constructor nữa",
            "Chỉ tạo nếu lớp đó là public",
            "Chỉ tạo nếu lớp đó kế thừa từ một interface"
        ],
        [
            "Yes, the compiler always generates a default constructor in all cases",
            "No, once at least one explicit constructor is defined, Java will NOT generate the default constructor",
            "Only if the class is public",
            "Only if the class implements an interface"
        ],
        1,
        "Một khi lớp đã khai báo bất kỳ constructor nào (dù có hay không có tham số), trình biên dịch sẽ không tự sinh default constructor nữa. Nếu cần `new Book()`, lập trình viên phải tự viết constructor không tham số.",
        "Once a class defines any explicit constructor, the compiler will no longer synthesize a default constructor. If `new Book()` is needed, it must be explicitly defined."
    ))

    questions.append(q(
        12,
        "Cho đoạn mã sau. Kết quả xuất ra màn hình là gì?",
        "Consider the following code. What is the output?",
        [
            "100",
            "50",
            "0",
            "Lỗi biên dịch"
        ],
        [
            "100",
            "50",
            "0",
            "Compile error"
        ],
        0,
        "Biến `b` được gán bằng `a`, nghĩa là cả hai biến tham chiếu `a` và `b` đều cùng trỏ tới MỘT đối tượng duy nhất trên Heap. Thay đổi `b.value = 100` cũng làm thay đổi đối tượng mà `a` trỏ tới.",
        "Assigning `b = a` copies the reference, meaning both `a` and `b` point to the exact same object on the Heap. Modifying `b.value` mutates the object referenced by `a`.",
        code="class Box {\n    int value = 50;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Box a = new Box();\n        Box b = a;\n        b.value = 100;\n        System.out.println(a.value);\n    }\n}"
    ))

    questions.append(q(
        13,
        "Cơ chế truyền tham số trong Java đối với đối tượng là gì?",
        "What is the parameter passing mechanism in Java for objects?",
        [
            "Pass-by-reference (Truyền bằng tham chiếu thực sự)",
            "Pass-by-value (Truyền giá trị của biến tham chiếu)",
            "Pass-by-name",
            "Truyền tham chiếu nếu là đối tượng, truyền giá trị nếu là số"
        ],
        [
            "Pass-by-reference",
            "Pass-by-value (Passes the value of the reference variable)",
            "Pass-by-name",
            "Pass-by-reference for objects, pass-by-value for primitives"
        ],
        1,
        "Java LUÔN LUÔN là Pass-by-value (truyền theo giá trị). Khi truyền một đối tượng vào phương thức, Java sao chép giá trị của biến tham chiếu (địa chỉ bộ nhớ) vào biến tham số cục bộ của phương thức.",
        "Java is STRICTLY Pass-by-value. When an object is passed, Java copies the value of the reference (the address) into the method parameter."
    ))

    questions.append(q(
        14,
        "Cho đoạn mã sau. Kết quả in ra là gì?",
        "Consider the following code. What is the output?",
        [
            "Hello",
            "World",
            "null",
            "Lỗi biên dịch"
        ],
        [
            "Hello",
            "World",
            "null",
            "Compile error"
        ],
        0,
        "Trong phương thức `modify`, phép gán `m = new Message(\"World\");` chỉ làm cho biến tham số cục bộ `m` trỏ tới đối tượng mới. Biến `msg` trong `main` vẫn trỏ tới đối tượng ban đầu mang nội dung \"Hello\".",
        "In `modify`, `m = new Message(\"World\");` reassigns the local parameter copy `m` to point to a new object. The original reference `msg` in `main` remains unchanged.",
        code="class Message {\n    String text;\n    Message(String t) { text = t; }\n}\npublic class Test {\n    static void modify(Message m) {\n        m = new Message(\"World\");\n    }\n    public static void main(String[] args) {\n        Message msg = new Message(\"Hello\");\n        modify(msg);\n        System.out.println(msg.text);\n    }\n}"
    ))

    questions.append(q(
        15,
        "Cho đoạn mã sau. Kết quả in ra là gì?",
        "Consider the following code. What is the output?",
        [
            "Hello",
            "World",
            "null",
            "Lỗi Runtime: NullPointerException"
        ],
        [
            "Hello",
            "World",
            "null",
            "Runtime error: NullPointerException"
        ],
        1,
        "Phương thức `change` không gán lại tham chiếu mà thay đổi thuộc tính `m.text` của đối tượng được trỏ tới. Vì `msg` và `m` cùng trỏ tới một đối tượng, thuộc tính `text` của đối tượng bị đổi thành \"World\".",
        "The method `change` mutates the internal state `m.text`. Since `msg` and `m` point to the same object on the Heap, the state change is visible in `main`.",
        code="class Message {\n    String text;\n    Message(String t) { text = t; }\n}\npublic class Test {\n    static void change(Message m) {\n        m.text = \"World\";\n    }\n    public static void main(String[] args) {\n        Message msg = new Message(\"Hello\");\n        change(msg);\n        System.out.println(msg.text);\n    }\n}"
    ))

    # 16-30: Initializer Blocks, Static vs Instance, Constructors
    questions.append(q(
        16,
        "Khối khởi tạo tĩnh (Static Initialization Block) được thực thi khi nào trong vòng đời chương trình Java?",
        "When is a Static Initialization Block executed in the lifecycle of a Java program?",
        [
            "Mỗi khi một đối tượng mới của lớp được tạo ra bằng từ khóa new",
            "Chỉ một lần duy nhất khi lớp được JVM tải (load) vào bộ nhớ",
            "Mỗi khi một phương thức tĩnh được gọi",
            "Sau khi constructor của đối tượng chạy xong"
        ],
        [
            "Every time a new instance of the class is created using new",
            "Exactly once when the class is loaded into memory by the JVM",
            "Every time any static method is called",
            "After the object's constructor finishes executing"
        ],
        1,
        "Khối khởi tạo tĩnh `static { ... }` chỉ được thực thi MỘT lần duy nhất khi lớp được JVM ClassLoader nạp vào bộ nhớ, trước khi bất kỳ đối tượng nào được tạo hoặc phương thức static nào được truy cập.",
        "Static initializer blocks execute only once when the class is initially loaded into memory by the JVM ClassLoader."
    ))

    questions.append(q(
        17,
        "Thứ tự thực thi nào sau đây là ĐÚNG khi khởi tạo một đối tượng của một lớp?",
        "Which of the following execution orders is CORRECT when creating an instance of a class?",
        [
            "Static block -> Instance init block -> Constructor",
            "Constructor -> Instance init block -> Static block",
            "Instance init block -> Static block -> Constructor",
            "Constructor -> Static block -> Instance init block"
        ],
        [
            "Static block -> Instance init block -> Constructor",
            "Constructor -> Instance init block -> Static block",
            "Instance init block -> Static block -> Constructor",
            "Constructor -> Static block -> Instance init block"
        ],
        0,
        "Thứ tự thực thi: 1. Khối static (nếu class chưa load) -> 2. Khối khởi tạo thể hiện (instance initializer) -> 3. Thân Constructor.",
        "Execution order: 1. Static blocks (upon class loading) -> 2. Instance initializer blocks -> 3. Constructor body."
    ))

    questions.append(q(
        18,
        "Cho đoạn mã sau. Thứ tự in ra các số trên màn hình là gì?",
        "Consider the following code. What is the order of printed numbers?",
        [
            "1 2 3",
            "2 3 1",
            "1 3 2",
            "3 1 2"
        ],
        [
            "1 2 3",
            "2 3 1",
            "1 3 2",
            "3 1 2"
        ],
        0,
        "Khối static chạy trước khi lớp nạp (in 1), tiếp theo khối instance initializer chạy khi tạo đối tượng (in 2), sau cùng là thân constructor (in 3). Kết quả: 1 2 3.",
        "Static block runs first when class loads (1), then instance initializer runs upon instantiation (2), and constructor finishes (3). Output: 1 2 3.",
        code="public class Demo {\n    static {\n        System.out.print(\"1 \");\n    }\n    {\n        System.out.print(\"2 \");\n    }\n    public Demo() {\n        System.out.print(\"3 \");\n    }\n    public static void main(String[] args) {\n        new Demo();\n    }\n}"
    ))

    questions.append(q(
        19,
        "Cho đoạn mã sau khi tạo HAI đối tượng liên tiếp. Kết quả in ra là gì?",
        "Consider the following code creating TWO instances consecutively. What is the output?",
        [
            "1 2 3 1 2 3",
            "1 2 3 2 3",
            "2 3 1 2 3",
            "1 1 2 3 2 3"
        ],
        [
            "1 2 3 1 2 3",
            "1 2 3 2 3",
            "2 3 1 2 3",
            "1 1 2 3 2 3"
        ],
        1,
        "Khối `static` chỉ chạy 1 lần duy nhất khi nạp lớp (in 1). Mỗi lần gọi `new Demo()`, khối instance initializer (in 2) và constructor (in 3) sẽ chạy lại. Kết quả: `1 2 3 2 3`.",
        "The static block executes only once upon class load (1). Each subsequent `new Demo()` triggers instance init block (2) then constructor (3). Output: `1 2 3 2 3`.",
        code="public class Demo {\n    static { System.out.print(\"1 \"); }\n    { System.out.print(\"2 \"); }\n    public Demo() { System.out.print(\"3 \"); }\n    public static void main(String[] args) {\n        new Demo();\n        new Demo();\n    }\n}"
    ))

    questions.append(q(
        20,
        "Một phương thức có thể có kiểu trả về trùng tên với lớp không? (Ví dụ: `public class A { public void A() {} }`)",
        "Can a method have the same name as the class with a return type? (e.g. `public class A { public void A() {} }`)",
        [
            "Có, đây là một phương thức thông thường, KHÔNG PHẢI là constructor",
            "Không, gây lỗi biên dịch ngay lập tức",
            "Có, và nó vẫn đóng vai trò là constructor",
            "Chỉ được phép nếu phương thức đó là static"
        ],
        [
            "Yes, this is an ordinary method, NOT a constructor",
            "No, it produces an immediate compilation error",
            "Yes, and it still functions as a constructor",
            "Only allowed if the method is static"
        ],
        0,
        "Nếu một phương thức có cùng tên với lớp nhưng CÓ kiểu trả về (kể cả `void`), Java coi nó là một phương thức thông thường, KHÔNG phải là constructor. Mặc dù hợp lệ về cú pháp nhưng đây là bad practice.",
        "In Java, if a method matches the class name but declares a return type (even `void`), it is treated as a regular method, NOT a constructor."
    ))

    questions.append(q(
        21,
        "Một Constructor trong Java có được phép khai báo từ khóa `return;` không?",
        "Is a Constructor in Java allowed to contain a `return;` statement?",
        [
            "Không bao giờ, constructor không có câu lệnh return",
            "Có, được phép dùng `return;` không kèm giá trị để thoát sớm khỏi constructor",
            "Có, và phải trả về đối tượng `return this;`",
            "Chỉ được phép trong constructor private"
        ],
        [
            "Never, constructors cannot contain return statements",
            "Yes, allowed to use `return;` without any value to exit the constructor early",
            "Yes, and it must return `return this;`",
            "Only allowed in private constructors"
        ],
        1,
        "Constructor không được trả về giá trị (không thể viết `return x;`), nhưng hoàn toàn có thể dùng `return;` trống để kết thúc sớm quá trình khởi tạo.",
        "A constructor cannot return a value, but an empty `return;` statement is valid to terminate initialization prematurely."
    ))

    questions.append(q(
        22,
        "Khi nào một đối tượng trong bộ nhớ Java đủ điều kiện để Bộ thu dọn rác (Garbage Collector - GC) thu hồi?",
        "When does an object in Java become eligible for Garbage Collection (GC)?",
        [
            "Ngay khi phương thức tạo ra nó chạy xong, bất kể có biến nào khác trỏ tới hay không",
            "Khi không còn bất kỳ biến tham chiếu còn sống (live reference) nào trỏ tới đối tượng đó",
            "Khi lập trình viên gọi lệnh free() hoặc delete",
            "Sau đúng 60 giây kể từ khi được tạo trên Heap"
        ],
        [
            "Immediately when the method creating it completes, regardless of other references",
            "When there are no live references reachable from any root pointing to that object",
            "When the programmer calls free() or delete",
            "Exactly 60 seconds after creation on the Heap"
        ],
        1,
        "Một đối tượng trở nên 'unreachable' (không thể với tới từ GC Roots) và đủ điều kiện để GC thu dọn khi không còn bất kỳ tham chiếu hợp lệ nào trỏ đến nó.",
        "An object becomes eligible for GC when it is unreachable from any live reference (GC roots)."
    ))

    questions.append(q(
        23,
        "Lệnh `System.gc()` có tác dụng gì trong Java?",
        "What does the statement `System.gc()` do in Java?",
        [
            "Bắt buộc JVM phải dọn dẹp toàn bộ bộ nhớ ngay lập tức",
            "Gửi một lời gợi ý/yêu cầu tới JVM chạy bộ thu dọn rác, nhưng không đảm bảo GC sẽ chạy ngay",
            "Xóa toàn bộ các đối tượng trong Heap",
            "Giải phóng bộ nhớ Stack"
        ],
        [
            "Forces the JVM to immediately collect all memory synchronously",
            "Suggests/requests the JVM to run Garbage Collection, but does not guarantee immediate execution",
            "Deletes all objects in the Heap",
            "Clears the Stack memory"
        ],
        1,
        "`System.gc()` chỉ là lời đề nghị (hint) gửi tới JVM. JVM hoàn toàn có quyền quyết định khi nào và có thực hiện thu gom rác hay không.",
        "`System.gc()` only suggests that the JVM make an effort toward recycling unused objects. It does not guarantee when or if GC will run."
    ))

    questions.append(q(
        24,
        "Trong lớp `Object` của Java, phương thức `toString()` mặc định trả về chuỗi có định dạng như thế nào?",
        "In Java's `Object` class, what format does the default `toString()` method return?",
        [
            "Giá trị của tất cả các trường trong đối tượng ngăn cách bởi dấu phẩy",
            "TênLớp@MãBămThậpLụcPhân (getClass().getName() + '@' + Integer.toHexString(hashCode()))",
            "Chuỗi rỗng \"\"",
            "Địa chỉ IP máy ảo JVM"
        ],
        [
            "Values of all fields separated by commas",
            "ClassName@HexHashCode (getClass().getName() + '@' + Integer.toHexString(hashCode()))",
            "An empty string \"\"",
            "The JVM virtual IP address"
        ],
        1,
        "Cài đặt mặc định của `Object.toString()` là: `getClass().getName() + '@' + Integer.toHexString(hashCode())`.",
        "The default implementation of `Object.toString()` returns `getClass().getName() + '@' + Integer.toHexString(hashCode())`."
    ))

    questions.append(q(
        25,
        "Toán tử `==` và phương thức `equals()` khác nhau như thế nào khi so sánh hai đối tượng trong Java?",
        "What is the difference between the `==` operator and the `equals()` method when comparing two objects in Java?",
        [
            "`==` so sánh giá trị nội dung, `equals()` so sánh địa chỉ ô nhớ",
            "`==` so sánh địa chỉ ô nhớ (tham chiếu), còn `equals()` (nếu được ghi đè) so sánh giá trị logic nội dung",
            "Cả hai đều luôn so sánh nội dung",
            "`==` chỉ dùng cho số, không thể dùng cho biến tham chiếu"
        ],
        [
            "`==` compares logical content, while `equals()` compares memory addresses",
            "`==` compares memory references (addresses), while `equals()` (when overridden) compares logical content",
            "Both always compare logical content",
            "`==` can only be used for primitive numbers, not reference types"
        ],
        1,
        "`==` kiểm tra xem hai biến tham chiếu có cùng trỏ tới 1 địa chỉ ô nhớ trên Heap không. Phương thức `equals()` trong `Object` mặc định cũng dùng `==`, nhưng thường được các lớp con (như String, Integer...) ghi đè để so sánh nội dung logic.",
        "`==` tests reference equality (pointing to same memory address). `equals()` can be overridden to evaluate semantic equality of content."
    ))

    questions.append(q(
        26,
        "Nếu một lớp ghi đè phương thức `equals()` thì BẮT BUỘC nên ghi đè phương thức nào đi kèm để duy trì tính nhất quán khi làm việc với Hash collections?",
        "If a class overrides `equals()`, which method MUST also be overridden to maintain consistency with Hash collections?",
        [
            "toString()",
            "hashCode()",
            "clone()",
            "finalize()"
        ],
        [
            "toString()",
            "hashCode()",
            "clone()",
            "finalize()"
        ],
        1,
        "Quy tắc hợp đồng (contract) của Java: Nếu `a.equals(b) == true` thì bắt buộc `a.hashCode() == b.hashCode()`. Nếu không ghi đè `hashCode()`, đối tượng sẽ hoạt động sai trong `HashMap`, `HashSet`.",
        "The contract between `equals()` and `hashCode()` states that if two objects are equal according to `equals()`, they MUST produce the same `hashCode()`."
    ))

    questions.append(q(
        27,
        "Cho đoạn mã sau. Kết quả in ra là gì?",
        "Consider the following code. What is the output?",
        [
            "true true",
            "false false",
            "false true",
            "true false"
        ],
        [
            "true true",
            "false false",
            "false true",
            "true false"
        ],
        2,
        "`s1` và `s2` là hai đối tượng riêng biệt trên Heap tạo bằng `new String()`, nên `s1 == s2` là `false`. Lớp `String` đã ghi đè `equals()` để so sánh nội dung chuỗi, nên `s1.equals(s2)` là `true`.",
        "`s1` and `s2` are distinct objects on Heap created via `new`, so `s1 == s2` is `false`. `String` overrides `equals()` to compare characters, returning `true`.",
        code="public class Main {\n    public static void main(String[] args) {\n        String s1 = new String(\"Java\");\n        String s2 = new String(\"Java\");\n        System.out.println((s1 == s2) + \" \" + s1.equals(s2));\n    }\n}"
    ))

    questions.append(q(
        28,
        "Cho đoạn mã sau với lớp `User` KHÔNG ghi đè `equals()`. Kết quả in ra là gì?",
        "Consider the following code where class `User` DOES NOT override `equals()`. What is the output?",
        [
            "false true",
            "false false",
            "true true",
            "Lỗi biên dịch"
        ],
        [
            "false true",
            "false false",
            "true true",
            "Compile error"
        ],
        1,
        "Khi lớp `User` không ghi đè `equals()`, nó thừa kế phương thức `equals()` từ `Object`, vốn chỉ so sánh địa chỉ `this == obj`. Vì `u1` và `u2` là 2 đối tượng khác nhau, cả `u1 == u2` và `u1.equals(u2)` đều là `false`.",
        "Since `User` does not override `equals()`, it inherits `Object.equals()` which checks `this == obj`. Since `u1` and `u2` are different heap objects, both comparisons yield `false`.",
        code="class User {\n    int id = 1;\n}\npublic class Main {\n    public static void main(String[] args) {\n        User u1 = new User();\n        User u2 = new User();\n        System.out.println((u1 == u2) + \" \" + u1.equals(u2));\n    }\n}"
    ))

    questions.append(q(
        29,
        "Kỹ thuật Nạp chồng phương thức (Method Overloading) trong Java được phân biệt dựa trên tiêu chí nào?",
        "How is Method Overloading distinguished in Java?",
        [
            "Chỉ dựa vào kiểu trả về khác nhau",
            "Dựa vào danh sách tham số (số lượng tham số, kiểu dữ liệu, hoặc thứ tự các kiểu tham số)",
            "Dựa vào Access modifier (public, private)",
            "Dựa vào các ngoại lệ được ném ra ở mệnh đề throws"
        ],
        [
            "Based solely on different return types",
            "Based on parameter list (number of parameters, data types, or sequence of parameter types)",
            "Based on access modifiers (public, private)",
            "Based on thrown exceptions in the throws clause"
        ],
        1,
        "Chữ ký phương thức (method signature) chỉ bao gồm tên phương thức và danh sách tham số. Hai phương thức chỉ khác nhau ở kiểu trả về thì KHÔNG được coi là nạp chồng hợp lệ và sẽ bị lỗi biên dịch.",
        "Overloading requires differing method parameter lists (count, types, order). Modifying only the return type is invalid and produces a compilation error."
    ))

    questions.append(q(
        30,
        "Đoạn mã sau có biên dịch thành công không?",
        "Does the following code compile successfully?",
        [
            "Có, in ra kết quả bình thường",
            "Không, lỗi biên dịch vì hai phương thức có cùng chữ ký `calc(int, int)` (khác kiểu trả về không đủ để nạp chồng)",
            "Chỉ lỗi khi chạy (Runtime)",
            "Có, trình biên dịch tự động ép kiểu"
        ],
        [
            "Yes, compiles and runs normally",
            "No, compilation error because both methods have the same signature `calc(int, int)` (differing return type alone is invalid)",
            "Runtime error only",
            "Yes, compiler casts automatically"
        ],
        1,
        "Phương thức `calc(int a, int b)` bị khai báo trùng chữ ký. Trình biên dịch không thể phân biệt phương thức nào được gọi chỉ dựa vào kiểu trả về.",
        "Both methods have identical parameter lists. Differing return types do not create a valid overload in Java.",
        code="public class Calculator {\n    public int calc(int a, int b) { return a + b; }\n    public double calc(int a, int b) { return a + b + 0.5; }\n}"
    ))

    # 31-50: Advanced Overloading, Varargs, Immutability, Records
    questions.append(q(
        31,
        "Khi gọi `print(10)` với hai phương thức nạp chồng: `void print(long x)` và `void print(Integer x)`, Java sẽ ưu tiên gọi phương thức nào?",
        "When calling `print(10)` with overloads `void print(long x)` and `void print(Integer x)`, which one does Java prioritize?",
        [
            "Gọi `print(long x)` vì nới rộng kiểu nguyên thủy (Widening) được ưu tiên hơn Autoboxing",
            "Gọi `print(Integer x)` vì Autoboxing được ưu tiên hơn Widening",
            "Báo lỗi biên dịch Ambiguous method call (mơ hồ)",
            "Gọi ngẫu nhiên tùy thuộc vào phiên bản JVM"
        ],
        [
            "Calls `print(long x)` because primitive Widening takes precedence over Autoboxing",
            "Calls `print(Integer x)` because Autoboxing takes precedence over Widening",
            "Compiler error due to Ambiguous method call",
            "Random call depending on JVM implementation"
        ],
        0,
        "Quy tắc ưu tiên overload trong Java: 1. Widening nguyên thủy (`int` -> `long`) -> 2. Autoboxing (`int` -> `Integer`) -> 3. Varargs (`int...`). Do đó `print(long)` được chọn.",
        "Java overload resolution order: 1. Primitive Widening -> 2. Autoboxing -> 3. Varargs. Thus `print(long x)` is chosen."
    ))

    questions.append(q(
        32,
        "Quy tắc nào sau đây là BẮT BUỘC khi khai báo tham số có độ dài biến thiên (Varargs `...`) trong một phương thức Java?",
        "Which rule is MANDATORY when declaring variable-length arguments (Varargs `...`) in a Java method?",
        [
            "Một phương thức có thể có tối đa hai tham số Varargs",
            "Tham số Varargs phải là tham số cuối cùng trong danh sách tham số của phương thức",
            "Varargs chỉ dùng được với kiểu dữ liệu nguyên thủy (primitive)",
            "Tham số Varargs phải đứng ở vị trí đầu tiên"
        ],
        [
            "A method can have at most two Varargs parameters",
            "The Varargs parameter must be the last parameter in the method's parameter list",
            "Varargs can only be used with primitive data types",
            "The Varargs parameter must be at the first position"
        ],
        1,
        "Một phương thức chỉ được phép có tối đa MỘT tham số Varargs và nó BẮT BUỘC phải nằm ở vị trí cuối cùng trong danh sách tham số.",
        "A method can have at most ONE varargs parameter, and it MUST be the final parameter in the declaration list."
    ))

    questions.append(q(
        33,
        "Bản chất của tham số Varargs (ví dụ `int... nums`) trong mã bytecode của JVM là gì?",
        "What is the underlying representation of a Varargs parameter (e.g. `int... nums`) in JVM bytecode?",
        [
            "Một đối tượng `java.util.ArrayList<Integer>`",
            "Một mảng một chiều `int[]`",
            "Một danh sách liên kết LinkedList",
            "Một con trỏ kiểu C++"
        ],
        [
            "An instance of `java.util.ArrayList<Integer>`",
            "A single-dimensional array `int[]`",
            "A linked list LinkedList",
            "A C++ style pointer"
        ],
        1,
        "Varargs trong Java thực chất là cú pháp thuận tiện (syntactic sugar) cho mảng một chiều. Trình biên dịch sẽ gói các đối số truyền vào thành một mảng tương ứng.",
        "Varargs in Java is syntactic sugar for single-dimensional arrays. The compiler packs passed arguments into an array."
    ))

    questions.append(q(
        34,
        "Mối quan hệ nào sau đây thể hiện mối quan hệ 'HAS-A' (chứa/sở hữu) thay vì 'IS-A' (là một)?",
        "Which of the following demonstrates a 'HAS-A' relationship rather than an 'IS-A' relationship?",
        [
            "Lớp `Car` kế thừa từ lớp `Vehicle`",
            "Lớp `Car` chứa một thuộc tính là đối tượng của lớp `Engine` (Composition)",
            "Lớp `Student` kế thừa từ lớp `Person`",
            "Lớp `Circle` kế thừa từ lớp `Shape`"
        ],
        [
            "`Car` extends `Vehicle`",
            "`Car` contains a field of type `Engine` (Composition)",
            "`Student` extends `Person`",
            "`Circle` extends `Shape`"
        ],
        1,
        "Composition (Thành phần kết hợp) thể hiện quan hệ 'HAS-A' (Xe có Động cơ). Kế thừa (Inheritance) thể hiện quan hệ 'IS-A' (Xe là một Phương tiện).",
        "Composition represents a 'HAS-A' relationship (Car has an Engine), while Inheritance represents an 'IS-A' relationship (Car is a Vehicle)."
    ))

    questions.append(q(
        35,
        "Để tạo một Lớp Bất Biến (Immutable Class) trong Java, điều nào sau đây KHÔNG PHẢI là một yêu cầu bắt buộc?",
        "To create an Immutable Class in Java, which of the following is NOT a required rule?",
        [
            "Khai báo lớp là `final` (để ngăn các lớp con ghi đè)",
            "Khai báo tất cả các trường dữ liệu là `private` và `final`",
            "Không cung cấp bất kỳ phương thức setter nào làm thay đổi trạng thái",
            "Lớp bắt buộc phải cài đặt interface `Serializable`"
        ],
        [
            "Declare the class as `final` (to prevent subclassing)",
            "Declare all fields as `private` and `final`",
            "Provide no setter methods that mutate state",
            "The class must implement the `Serializable` interface"
        ],
        3,
        "Tính bất biến (Immutability) không liên quan đến interface `Serializable`. Các quy tắc chính là: class final, fields private final, không có setters, và tạo defensive copy cho các trường đối tượng có thể thay đổi.",
        "Immutability does not require `Serializable`. The requirements are: final class, private final fields, no setters, and defensive copies of mutable fields."
    ))

    questions.append(q(
        36,
        "Kỹ thuật 'Defensive Copy' (Sao chép phòng thủ) được sử dụng trong hàm tạo của một Immutable Class để giải quyết nguy cơ gì?",
        "What risk does 'Defensive Copying' address in the constructor of an Immutable Class?",
        [
            "Tránh việc bộ nhớ bị đầy Heap",
            "Tránh việc đối tượng bên ngoài sửa đổi trạng thái nội bộ thông qua biến tham chiếu được truyền vào hàm tạo",
            "Tăng tốc độ Garbage Collection",
            "Cho phép nhiều luồng ghi dữ liệu đồng thời"
        ],
        [
            "Preventing Heap out of memory",
            "Preventing external callers from mutating internal state via the reference passed into the constructor",
            "Accelerating Garbage Collection",
            "Allowing concurrent thread writes"
        ],
        1,
        "Nếu truyền một đối tượng khả biến (như `Date` hoặc `List`) vào hàm tạo và lưu trực tiếp, người gọi từ bên ngoài vẫn giữ tham chiếu đó và có thể sửa đổi dữ liệu ngầm. Cần sao chép một bản sao mới (defensive copy) để lưu trữ.",
        "Passing a mutable object (e.g. `Date` or `List`) allows the caller to mutate it externally. Defensive copying clones the object to ensure encapsulation."
    ))

    questions.append(q(
        37,
        "Tính năng `record` được giới thiệu chính thức từ Java 16 có đặc điểm nổi bật nào?",
        "What is the prominent characteristic of a `record` in Java (standardized in Java 16)?",
        [
            "Là một lớp đặc biệt dùng để lưu trữ dữ liệu bất biến (immutable data carrier), tự động sinh constructor, getters, equals(), hashCode() và toString()",
            "Là lớp có thể kế thừa từ một lớp cha khác bằng từ khóa extends",
            "Tất cả các trường trong record đều là public static",
            "Record cho phép lập trình viên tạo setter để cập nhật giá trị"
        ],
        [
            "A transparent immutable data carrier that auto-generates constructor, accessors, equals(), hashCode(), and toString()",
            "A class that can extend another class using extends",
            "All fields in record are public static",
            "Records allow defining setters to mutate state"
        ],
        0,
        "Java `record` là cú pháp ngắn gọn để tạo lớp vận chuyển dữ liệu bất biến. JVM tự động sinh canonical constructor, các phương thức accessor (không có tiền tố `get`), `equals()`, `hashCode()` và `toString()`.",
        "`record` is a concise immutable data holder. The compiler auto-generates constructor, field accessors, equals, hashCode, and toString."
    ))

    questions.append(q(
        38,
        "Cho khai báo `record Point(int x, int y) {}`. Cách nào sau đây là ĐÚNG để truy xuất giá trị trường `x` của đối tượng `p`?",
        "Given `record Point(int x, int y) {}`. Which is the CORRECT syntax to access field `x` of instance `p`?",
        [
            "p.getX()",
            "p.x()",
            "p.x",
            "p->x"
        ],
        [
            "p.getX()",
            "p.x()",
            "p.x",
            "p->x"
        ],
        1,
        "Trong Java `record`, phương thức truy xuất (accessor) cho trường `x` có tên trùng với tên trường là `p.x()`, KHÔNG PHẢI là `p.getX()`.",
        "In a Java `record`, accessor methods match field names directly without the 'get' prefix: `p.x()`."
    ))

    questions.append(q(
        39,
        "Một Java `record` có thể kế thừa (extends) từ một lớp cha khác không?",
        "Can a Java `record` extend another class using the `extends` keyword?",
        [
            "Có, có thể kế thừa từ bất kỳ lớp nào",
            "Không, vì mọi record đều ngầm định kế thừa từ `java.lang.Record` và Java không hỗ trợ đa kế thừa lớp",
            "Có, miễn là lớp cha là abstract class",
            "Chỉ được kế thừa từ lớp `Object`"
        ],
        [
            "Yes, it can extend any class",
            "No, because every record implicitly extends `java.lang.Record` and Java does not support multiple class inheritance",
            "Yes, provided the superclass is abstract",
            "Can only extend `Object`"
        ],
        1,
        "Tất cả các `record` trong Java đều tự động kế thừa `java.lang.Record`. Vì Java là đơn kế thừa lớp, một record không thể khai báo `extends` lớp khác (nhưng có thể `implements` nhiều interface).",
        "Every record implicitly extends `java.lang.Record`. Because Java does not allow multiple class inheritance, records cannot extend another class."
    ))

    questions.append(q(
        40,
        "Cho đoạn mã sau về Integer Cache. Kết quả in ra màn hình là gì?",
        "Consider the following code regarding the Integer Cache. What is the output?",
        [
            "true true",
            "true false",
            "false false",
            "false true"
        ],
        [
            "true true",
            "true false",
            "false false",
            "false true"
        ],
        1,
        "Java có cơ chế bộ đệm `IntegerCache` cho các giá trị từ -128 đến 127. `a` và `b` nhận giá trị 100 nên cùng trỏ tới 1 đối tượng cached (`a == b` là true). `c` và `d` là 200 vượt quá 127 nên được tạo 2 đối tượng mới riêng biệt trên Heap (`c == d` là false).",
        "Java caches Integer objects for values between -128 and 127. Thus `a == b` is true. Values of 200 exceed the cache, creating distinct heap instances (`c == d` is false).",
        code="public class Test {\n    public static void main(String[] args) {\n        Integer a = 100, b = 100;\n        Integer c = 200, d = 200;\n        System.out.println((a == b) + \" \" + (c == d));\n    }\n}"
    ))

    # Add questions 41 to 105 systematically
    # 41-60: Constructors, Chaining, Visibility, Methods
    more_obj_questions = [
        (41,
         "Constructor có thể được khai báo với quyền truy cập `private` không? Mục đích điển hình là gì?",
         "Can a constructor be declared with `private` access? What is a typical use case?",
         ["Không thể, constructor phải là public để tạo đối tượng",
          "Có, để ngăn việc tạo đối tượng tùy tiện từ bên ngoài, ví dụ trong Singleton pattern hoặc utility class",
          "Có, nhưng chỉ dùng được trong interface",
          "Chỉ được phép nếu lớp đó là abstract"],
         ["No, constructors must be public to instantiate objects",
          "Yes, to prevent direct external instantiation, e.g. in Singleton pattern or utility classes",
          "Yes, but only within interfaces",
          "Only allowed if the class is abstract"],
         1,
         "Constructor `private` được sử dụng rất phổ biến trong Singleton Pattern, Factory Pattern hoặc các Utility classes (chỉ chứa static methods như `java.lang.Math`).",
         "Private constructors are commonly used in Singleton, Factory patterns, and Utility classes (such as `java.lang.Math`).",
         None),

        (42,
         "Đoạn mã sau xảy ra hiện tượng gì khi chạy?",
         "What happens when running the following code?",
         ["In ra: Constructor called",
          "Lỗi biên dịch: Recursive constructor invocation",
          "Lỗi runtime: StackOverflowError",
          "Chương trình chạy vô tận không dừng"],
         ["Prints: Constructor called",
          "Compile error: Recursive constructor invocation",
          "Runtime error: StackOverflowError",
          "Infinite loop at runtime"],
         1,
         "Trình biên dịch Java phát hiện đệ quy trực tiếp hoặc gián tiếp giữa các constructor (`this()` gọi chính nó) và báo lỗi biên dịch ngay lập tức.",
         "The Java compiler detects recursive constructor invocation at compile time and rejects it.",
         "public class Cycle {\n    public Cycle() {\n        this();\n    }\n}"),

        (43,
         "Một biến thành viên kiểu `final` của đối tượng (instance field) phải được gán giá trị chậm nhất là khi nào?",
         "When is the latest point an instance `final` variable must be assigned a value?",
         ["Trong phương thức getter",
          "Trong quá trình khai báo, hoặc trong khối khởi tạo thể hiện, hoặc kết thúc mọi constructor của lớp",
          "Bất kỳ lúc nào trước khi chương trình kết thúc",
          "Trong khối static initializer"],
         ["Inside the getter method",
          "At declaration, or in an instance initializer block, or by the end of every constructor",
          "Any time before program termination",
          "Inside the static initializer block"],
         1,
         "Biến `final` của instance (blank final variable) bắt buộc phải được khởi tạo giá trị trước khi constructor kết thúc thực thi. Nếu một constructor nào không gán giá trị cho nó, trình biên dịch sẽ báo lỗi.",
         "A blank final instance variable must be definitely assigned at declaration, in an instance initializer, or by the end of every constructor.",
         None),

        (44,
         "Cho đoạn mã sau. Kết quả xuất ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["Count: 1",
          "Count: 2",
          "Count: 3",
          "Lỗi biên dịch"],
         ["Count: 1",
          "Count: 2",
          "Count: 3",
          "Compile error"],
         2,
         "Biến `count` là `static`, được chia sẻ chung cho tất cả các thể hiện của lớp `Counter`. Ba lần gọi `new Counter()` làm tăng biến `count` lên 3.",
         "Field `count` is `static`, shared across all instances of `Counter`. Three invocations of `new Counter()` increment `count` to 3.",
         "class Counter {\n    static int count = 0;\n    Counter() { count++; }\n}\npublic class App {\n    public static void main(String[] args) {\n        new Counter();\n        new Counter();\n        Counter c3 = new Counter();\n        System.out.println(\"Count: \" + Counter.count);\n    }\n}"),

        (45,
         "Điều gì xảy ra khi bạn gán `null` cho một biến tham chiếu đối tượng?",
         "What happens when you assign `null` to an object reference variable?",
         ["Đối tượng trên Heap bị hủy và xóa ngay lập tức",
          "Biến tham chiếu không còn trỏ đến bất kỳ đối tượng nào trên Heap",
          "Chương trình ném ra ngoại lệ NullPointerException",
          "Kích thước bộ nhớ Stack giảm đi 4 bytes"],
         ["The object on the Heap is immediately destroyed",
          "The reference variable no longer points to any object on the Heap",
          "The program throws NullPointerException immediately",
          "The Stack memory size shrinks by 4 bytes"],
         1,
         "Gán `null` chỉ làm mất liên kết giữa biến tham chiếu và đối tượng trên Heap. Đối tượng chỉ bị xóa khi Garbage Collector chạy sau đó nếu không còn tham chiếu nào khác trỏ tới nó.",
         "Assigning `null` disassociates the reference variable from the object. The object is collected later by the GC if unreachable.",
         None),

        (46,
         "Cho đoạn mã sau. Kết quả in ra là gì?",
         "Consider the following code. What is the output?",
         ["Ngoại lệ NullPointerException tại dòng in",
          "In ra: Hello",
          "Lỗi biên dịch",
          "In ra: null"],
         ["NullPointerException at the print line",
          "Prints: Hello",
          "Compile error",
          "Prints: null"],
         1,
         "Phương thức `sayHello()` là `static`, thuộc về lớp `Greeter`. Khi gọi qua biến tham chiếu `g.sayHello()`, trình biên dịch phân giải dựa trên kiểu của biến (`Greeter`) mà không cần dereference `g`, nên không bị NullPointerException.",
         "`sayHello()` is a static method bound at compile time to class `Greeter`. It does not dereference `g`, so no NullPointerException occurs.",
         "class Greeter {\n    static void sayHello() { System.out.println(\"Hello\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Greeter g = null;\n        g.sayHello();\n    }\n}"),

        (47,
         "Cho đoạn mã sau. Điều gì xảy ra khi chạy?",
         "Consider the following code. What happens when executed?",
         ["In ra: Value: 42",
          "Ném ra NullPointerException tại thời điểm runtime",
          "Lỗi biên dịch",
          "In ra: Value: 0"],
         ["Prints: Value: 42",
          "Throws NullPointerException at runtime",
          "Compile error",
          "Prints: Value: 0"],
         1,
         "Biến `value` là biến thể hiện (non-static instance variable). Khi truy cập `box.value` với `box == null`, JVM cố gắng dereference con trỏ null và ném ra `NullPointerException`.",
         "Field `value` is an instance variable. Attempting `box.value` dereferences `null`, throwing `NullPointerException`.",
         "class Box {\n    int value = 42;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Box box = null;\n        System.out.println(\"Value: \" + box.value);\n    }\n}"),

        (48,
         "Một lớp Java có thể có bao nhiêu constructor?",
         "How many constructors can a Java class have?",
         ["Chỉ duy nhất một constructor",
          "Tối đa hai: một không tham số và một có tham số",
          "Không giới hạn, miễn là chúng có danh sách tham số khác nhau (overloaded)",
          "Bằng số lượng thuộc tính trong lớp"],
         ["Only exactly one constructor",
          "At most two: one no-arg and one parameterized",
          "Unlimited, provided they have distinct parameter lists (overloaded)",
          "Equal to the number of fields in the class"],
         2,
         "Một lớp có thể nạp chồng (overload) bao nhiêu constructor tùy ý, miễn là danh sách tham số của chúng khác nhau về kiểu hoặc số lượng.",
         "A class can declare any number of overloaded constructors as long as their parameter lists differ.",
         None),

        (49,
         "Thuộc tính `name` của đối tượng `Person` trong đoạn mã sau có giá trị là gì khi in ra?",
         "What is the printed value of field `name` in the following code?",
         ["Unknown",
          "John",
          "null",
          "Lỗi biên dịch"],
         ["Unknown",
          "John",
          "null",
          "Compile error"],
         1,
         "Constructor nhận tham số `String name` gán giá trị \"John\" cho `this.name`, ghi đè giá trị khởi tạo ban đầu \"Unknown\".",
         "The constructor `Person(String name)` assigns \"John\" to `this.name`, overriding the initial inline assignment \"Unknown\".",
         "class Person {\n    String name = \"Unknown\";\n    Person(String name) {\n        this.name = name;\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Person p = new Person(\"John\");\n        System.out.println(p.name);\n    }\n}"),

        (50,
         "Tại sao việc so sánh hai đối tượng bằng `equals()` mà không kiểm tra `null` trước có thể gây ra NullPointerException?",
         "Why can comparing two objects with `equals()` cause NullPointerException without a null check?",
         ["Vì phương thức equals() luôn ném NullPointerException",
          "Vì nếu đối tượng gọi phương thức là null (ví dụ: `a.equals(b)` khi `a == null`), việc gọi phương thức trên biến null gây ra NPE",
          "Vì đối tượng truyền vào tham số không thể là null",
          "Vì equals() chỉ so sánh được chuỗi"],
         ["Because equals() always throws NullPointerException",
          "Because if the calling reference is null (`a.equals(b)` where `a == null`), calling a method on null throws NPE",
          "Because parameter arguments cannot be null",
          "Because equals() only works on strings"],
         1,
         "Khi `a == null`, biểu thức `a.equals(b)` sẽ ném ra NPE. Để an toàn, nên dùng `Objects.equals(a, b)` trong `java.util.Objects`.",
         "If `a == null`, `a.equals(b)` throws NPE. Using `Objects.equals(a, b)` prevents this.",
         None)
    ]

    for item in more_obj_questions:
        questions.append(q(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8]))

    # Questions 51 - 105: Rich generated varied questions
    # Topics: Encapsulation in classes, Getters/Setters, Static vs Instance methods, Passing by reference nuances,
    # Cloneable, Garbage collection phases, Records, Final classes, Anonymous instances, Class loaders basics
    scenarios = [
        ("Một phương thức instance có thể truy cập trực tiếp biến static của cùng lớp đó không?",
         "Can an instance method directly access a static variable of the same class?",
         ["Có, phương thức thể hiện có thể truy cập cả biến thể hiện lẫn biến static",
          "Không, chỉ phương thức static mới truy cập được biến static",
          "Chỉ truy cập được thông qua từ khóa super",
          "Chỉ được nếu biến static là public"],
         ["Yes, an instance method can access both instance and static variables",
          "No, only static methods can access static variables",
          "Only accessible via the super keyword",
          "Only if the static variable is public"],
         0,
         "Phương thức thể hiện (instance method) có toàn quyền truy cập cả thành viên tĩnh (static) và thành viên thể hiện của lớp.",
         "Instance methods have access to both static and instance members.",
         None),

        ("Cho đoạn mã sau. Giá trị của `b.val` in ra màn hình là gì?",
         "Consider the following code. What is the output of `b.val`?",
         ["10", "20", "0", "Lỗi biên dịch"],
         ["10", "20", "0", "Compile error"],
         1,
         "Phương thức `modify` nhận tham số là tham chiếu tới đối tượng `b`, và câu lệnh `x.val = 20` làm thay đổi trực tiếp thuộc tính của đối tượng đó.",
         "`modify` receives the reference to object `b` and `x.val = 20` mutates its field directly.",
         "class Item {\n    int val = 10;\n}\npublic class Main {\n    static void modify(Item x) { x.val = 20; }\n    public static void main(String[] args) {\n        Item b = new Item();\n        modify(b);\n        System.out.println(b.val);\n    }\n}"),

        ("Trong mẫu thiết kế JavaBean chuẩn, phương thức getter cho thuộc tính kiểu boolean nguyên thủy nên bắt đầu bằng tiền tố nào?",
         "In standard JavaBean conventions, what prefix should a getter method for a primitive boolean attribute start with?",
         ["get...", "is...", "has...", "check..."],
         ["get...", "is...", "has...", "check..."],
         1,
         "Theo quy ước chuẩn của JavaBean, thuộc tính boolean nguyên thủy (ví dụ `boolean active`) thường có getter bắt đầu bằng `is` (ví dụ `isActive()`).",
         "Under JavaBean conventions, getter methods for primitive boolean properties typically use the `is` prefix (e.g. `isActive()`).",
         None),

        ("Phương thức `finalize()` trong lớp `Object` (đã bị deprecated từ Java 9) được JVM gọi khi nào?",
         "When was the `finalize()` method in `Object` (deprecated since Java 9) invoked by the JVM?",
         ["Ngay khi đối tượng được tạo bằng new",
          "Trước khi đối tượng bị Garbage Collector thu hồi bộ nhớ",
          "Khi chương trình ném ngoại lệ",
          "Khi đối tượng được gán bằng null"],
         ["Immediately when the object is instantiated",
          "Just before the object is reclaimed by the Garbage Collector",
          "When the program throws an unhandled exception",
          "When the object reference is assigned null"],
         1,
         "`finalize()` là phương thức mà JVM gọi trước khi thu dọn rác đối tượng. Hiện nay nó đã bị deprecated vì không đảm bảo thời gian chạy và gây rò rỉ tài nguyên.",
         "`finalize()` was invoked before GC reclaiming. It is now deprecated due to performance issues and unpredictability.",
         None),

        ("Cho đoạn mã sau. Kết quả xuất ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["A B", "B A", "A A", "B B"],
         ["A B", "B A", "A A", "B B"],
         0,
         "Khối khởi tạo instance chạy trước (`A`), sau đó thân constructor mới thực thi (`B`).",
         "Instance initializer blocks execute first (`A`), followed by the constructor body (`B`).",
         "public class Test {\n    {\n        System.out.print(\"A \");\n    }\n    public Test() {\n        System.out.print(\"B \");\n    }\n    public static void main(String[] args) {\n        new Test();\n    }\n}"),

        ("Một lớp khai báo `public class Foo {}` được lưu trong file `Bar.java`. Điều gì xảy ra khi biên dịch?",
         "A public class `Foo` is saved in file `Bar.java`. What happens during compilation?",
         ["Biên dịch thành công bình thường",
          "Lỗi biên dịch: Lớp public Foo phải được khai báo trong file có tên là Foo.java",
          "Biên dịch được nhưng không chạy được",
          "Tự động đổi tên lớp thành Bar"],
         ["Compiles normally without errors",
          "Compile error: Public class Foo must be defined in a file named Foo.java",
          "Compiles but cannot run",
          "Automatically renames class to Bar"],
         1,
         "Quy tắc bắt buộc trong Java: Mỗi file mã nguồn `.java` chỉ được chứa tối đa 1 class `public`, và tên file bắt buộc phải trùng khớp hoàn toàn với tên của class public đó.",
         "In Java, a source file can contain at most one public class, and its filename must exactly match the public class name.",
         None),

        ("Một file mã nguồn Java có thể chứa bao nhiêu class không phải là `public` (package-private classes)?",
         "How many non-public (package-private) classes can a single Java source file contain?",
         ["Chỉ duy nhất một",
          "Tối đa hai",
          "Không giới hạn số lượng",
          "Không được phép khai báo thêm class nào khác"],
         ["Exactly one",
          "At most two",
          "An unlimited number",
          "Not allowed to declare any other class"],
         2,
         "Một file `.java` chỉ có tối đa một public class, nhưng có thể chứa không giới hạn số lượng class package-private (không có từ khóa public).",
         "A `.java` file can contain at most one public class, but an arbitrary number of package-private classes.",
         None),

        ("Khi thực hiện `Person p = new Person();`, từ khóa `new` có chức năng chính là gì?",
         "When executing `Person p = new Person();`, what is the primary role of the `new` keyword?",
         ["Gọi trực tiếp phương thức main",
          "Cấp phát vùng nhớ mới trên Heap cho đối tượng và trả về địa chỉ tham chiếu của nó",
          "Giải phóng bộ nhớ Stack",
          "Nạp file .class vào JVM"],
         ["Invoking the main method directly",
          "Allocating memory on the Heap for the new instance and returning its reference",
          "Freeing Stack memory",
          "Loading the .class file into the JVM"],
         1,
         "Từ khóa `new` yêu cầu JVM cấp phát bộ nhớ trên Heap cho đối tượng mới, khởi tạo các trường theo giá trị mặc định, sau đó gọi constructor.",
         "The `new` keyword allocates heap memory for the instance, initializes fields to default values, and invokes the constructor.",
         None),

        ("Khi một phương thức trả về kiểu đối tượng, nó thực sự trả về cái gì?",
         "When a method returns an object type, what does it actually return?",
         ["Toàn bộ bản sao các byte của đối tượng trên Heap",
          "Bản sao của biến tham chiếu (địa chỉ trỏ tới đối tượng)",
          "Tên của lớp",
          "Mã hash code của đối tượng"],
         ["A full copy of the object's heap bytes",
          "A copy of the reference pointing to the object",
          "The class name string",
          "The object's hash code integer"],
         1,
         "Java trả về bản sao của giá trị tham chiếu (địa chỉ ô nhớ trên Heap), người nhận có thể thao tác với cùng đối tượng đó.",
         "Java returns a copy of the reference address pointing to the heap object.",
         None),

        ("Đoạn mã sau có kết quả in ra là gì?",
         "What is the printed result of the following code?",
         ["null", "0", "Lỗi NullPointerException", "Lỗi biên dịch"],
         ["null", "0", "NullPointerException", "Compile error"],
         0,
         "Mảng đối tượng `String[] arr = new String[5];` khởi tạo 5 phần tử với giá trị mặc định của kiểu tham chiếu là `null`.",
         "An object array `new String[5]` initializes all its elements to the reference default value `null`.",
         "public class ArrayTest {\n    public static void main(String[] args) {\n        String[] arr = new String[5];\n        System.out.println(arr[0]);\n    }\n}"),

        ("Điều gì xảy ra khi bạn gọi phương thức `toString()` trên một biến tham chiếu đang giữ giá trị `null`? (Ví dụ: `String s = null; s.toString();`)",
         "What happens when calling `toString()` on a reference variable holding `null`? (e.g. `String s = null; s.toString();`)",
         ["In ra chuỗi \"null\"",
          "Ném ngoại lệ NullPointerException",
          "In ra chuỗi rỗng \"\"",
          "Lỗi biên dịch"],
         ["Prints string \"null\"",
          "Throws NullPointerException",
          "Prints empty string \"\"",
          "Compile error"],
         1,
         "Gọi bất kỳ phương thức instance nào trên biến tham chiếu có giá trị `null` đều dẫn đến `NullPointerException` trong thời gian chạy.",
         "Calling any instance method on a `null` reference causes a runtime `NullPointerException`.",
         None),

        ("Trong câu lệnh `System.out.println(obj);`, nếu `obj` là `null`, kết quả in ra màn hình là gì?",
         "In `System.out.println(obj);`, if `obj` is `null`, what is printed to standard output?",
         ["Ném ngoại lệ NullPointerException",
          "In ra chữ 'null'",
          "Không in gì cả",
          "Lỗi biên dịch"],
         ["Throws NullPointerException",
          "Prints the text 'null'",
          "Prints nothing",
          "Compile error"],
         1,
         "`PrintStream.println(Object)` ngầm kiểm tra: `String.valueOf(obj)`. Nếu `obj == null`, nó an toàn trả về chuỗi \"null\" mà không bị NullPointerException.",
         "`PrintStream.println(Object)` delegates to `String.valueOf(obj)`. If `obj == null`, it safely prints the string \"null\".",
         None),

        ("Constructor có thể có từ khóa `abstract` hoặc `static` hoặc `final` không?",
         "Can a constructor have the `abstract`, `static`, or `final` modifier?",
         ["Có, cả ba từ khóa đều hợp lệ",
          "Chỉ có thể là static",
          "Không, constructor không thể là abstract, static, hoặc final",
          "Chỉ có thể là final"],
         ["Yes, all three modifiers are allowed",
          "Only static is allowed",
          "No, a constructor cannot be abstract, static, or final",
          "Only final is allowed"],
         2,
         "Constructor không thể là `abstract` (vì phải khởi tạo cụ thể), không thể là `static` (vì gắn liền với đối tượng), và không thể là `final` (vì constructor không được kế thừa hay ghi đè).",
         "Constructors cannot be abstract, static, or final because they are never inherited and initialize a specific instance.",
         None),

        ("Từ khóa nào được sử dụng để ngăn chặn một lớp không thể bị kế thừa bởi bất kỳ lớp nào khác?",
         "Which keyword is used to prevent a class from being subclassed by any other class?",
         ["static", "final", "abstract", "sealed"],
         ["static", "final", "abstract", "sealed"],
         1,
         "Một lớp được khai báo với từ khóa `final` (ví dụ `public final class String`) thì không lớp con nào có thể kế thừa từ nó.",
         "A class declared with the `final` keyword (e.g. `public final class String`) cannot be extended by any other class.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra màn hình là gì?",
         "Consider the following code. What is the output?",
         ["10", "15", "5", "Lỗi biên dịch"],
         ["10", "15", "5", "Compile error"],
         0,
         "Phương thức tĩnh `add(int x)` nhận tham số x là giá trị nguyên thủy (pass-by-value). Phép toán `x += 5` bên trong phương thức không làm thay đổi biến `num` trong `main`.",
         "Primitive types are passed by value. Modifying parameter `x` inside `add` does not alter `num` in `main`.",
         "public class Test {\n    static void add(int x) { x += 5; }\n    public static void main(String[] args) {\n        int num = 10;\n        add(num);\n        System.out.println(num);\n    }\n}"),

        ("Trong một lớp, nếu không khai báo access modifier cho một thuộc tính, thuộc tính đó có phạm vi truy cập mặc định là gì?",
         "In a class, if no access modifier is declared for a field, what is its default access scope?",
         ["public", "private", "protected", "package-private (truy cập trong cùng package)"],
         ["public", "private", "protected", "package-private (accessible within the same package)"],
         3,
         "Nếu không ghi rõ access modifier, phạm vi là package-private (mặc định), cho phép mọi lớp trong cùng package truy cập trực tiếp.",
         "Default access (no modifier specified) is package-private, allowing access to any class in the same package.",
         None),

        ("Khi nào phương thức `equals(Object o)` mặc định của lớp `Object` trả về `true`?",
         "When does the default `equals(Object o)` implementation in `Object` return `true`?",
         ["Khi hai đối tượng có cùng các giá trị thuộc tính",
          "Khi hai biến tham chiếu cùng trỏ tới một đối tượng duy nhất trên bộ nhớ (`this == o`)",
          "Khi hai đối tượng cùng thuộc một lớp",
          "Luôn luôn trả về true"],
         ["When two objects have equal field values",
          "When both reference variables point to the exact same object in memory (`this == o`)",
          "When both objects belong to the same class",
          "Always returns true"],
         1,
         "Cài đặt mặc định của `Object.equals(Object obj)` chỉ đơn giản là `return (this == obj);`.",
         "The default implementation of `Object.equals(Object obj)` is simply `return (this == obj);`.",
         None),

        ("Phương thức nào sau đây KHÔNG thuộc về lớp `java.lang.Object`?",
         "Which of the following methods does NOT belong to `java.lang.Object`?",
         ["wait()", "notify()", "compareTo()", "hashCode()"],
         ["wait()", "notify()", "compareTo()", "hashCode()"],
         2,
         "`compareTo()` thuộc về interface `Comparable<T>`, không phải là phương thức của lớp `Object`.",
         "`compareTo()` belongs to interface `Comparable<T>`, not `Object`.",
         None),

        ("Khai báo nào sau đây tạo ra một hằng số toàn cục an toàn trong Java?",
         "Which declaration creates a proper constant in Java?",
         ["public static final double PI = 3.14159;",
          "private final static double PI = 3.14159;",
          "public const double PI = 3.14159;",
          "final double PI = 3.14159;"],
         ["public static final double PI = 3.14159;",
          "private final static double PI = 3.14159;",
          "public const double PI = 3.14159;",
          "final double PI = 3.14159;"],
         0,
         "Trong Java, hằng số (constant) chuẩn được khai báo bằng `public static final` kết hợp với quy ước đặt tên IN_HOA.",
         "In Java, constants are declared using `public static final` with UPPER_SNAKE_CASE naming convention.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra là gì?",
         "Consider the following code. What is the output?",
         ["S1 S2", "S2 S1", "S1 S1", "S2 S2"],
         ["S1 S2", "S2 S1", "S1 S1", "S2 S2"],
         0,
         "Các khối `static` được thực thi tuần tự từ trên xuống dưới theo thứ tự khai báo trong file mã nguồn khi lớp được nạp.",
         "Multiple static blocks execute sequentially in textual order from top to bottom upon class loading.",
         "public class OrderTest {\n    static { System.out.print(\"S1 \"); }\n    static { System.out.print(\"S2 \"); }\n    public static void main(String[] args) {}\n}"),

        ("Điều gì xảy ra nếu cố gắng gán lại giá trị cho một biến tham chiếu được khai báo là `final`? (Ví dụ: `final Person p = new Person(); p = new Person();`)",
         "What happens if you attempt to reassign a `final` reference variable? (e.g. `final Person p = new Person(); p = new Person();`)",
         ["Biến p trỏ tới đối tượng mới thành công",
          "Lỗi biên dịch: Cannot assign a value to final variable",
          "Ngoại lệ IllegalAccessException",
          "Chương trình chạy vô tận"],
         ["Reference p points to new object successfully",
          "Compile error: Cannot assign a value to final variable",
          "IllegalAccessException at runtime",
          "Infinite loop"],
         1,
         "Từ khóa `final` gắn với biến tham chiếu nghĩa là địa chỉ tham chiếu không thể bị thay đổi sau khi khởi tạo.",
         "`final` on a reference variable means it cannot be reassigned to point to another memory address.",
         None),

        ("Nếu biến tham chiếu là `final`, các thuộc tính bên trong đối tượng mà nó trỏ tới có thể thay đổi được không? (Ví dụ: `final Person p = new Person(); p.setName(\"Bob\");`)",
         "If a reference variable is `final`, can the fields inside the referenced object be mutated? (e.g. `final Person p = new Person(); p.setName(\"Bob\");`)",
         ["Không, toàn bộ thuộc tính bên trong cũng tự động thành bất biến",
          "Có, thuộc tính bên trong hoàn toàn có thể thay đổi trừ khi chính các thuộc tính đó cũng là final",
          "Chỉ thay đổi được nếu gọi trong cùng package",
          "Gây lỗi biên dịch"],
         ["No, all internal fields automatically become immutable",
          "Yes, internal fields can still be mutated unless they are individually marked final",
          "Only allowed within the same package",
          "Compile error"],
         1,
         "`final` chỉ bảo vệ biến tham chiếu không bị gán lại sang địa chỉ khác. Trạng thái nội tại (state) của đối tượng vẫn có thể bị biến đổi bình thường nếu đối tượng không phải là immutable.",
         "`final` on a reference only locks the pointer itself. The referenced object's internal state can still be modified.",
         None),

        ("Đoạn mã sau có lỗi gì không?",
         "Is there any error in the following code?",
         ["Không có lỗi, in ra: 10",
          "Lỗi biên dịch: Không thể tham chiếu đến trường non-static `x` từ ngữ cảnh static",
          "Ném ngoại lệ NullPointerException khi chạy",
          "Lỗi vì phương thức main phải trả về int"],
         ["No error, prints: 10",
          "Compile error: Non-static field `x` cannot be referenced from a static context",
          "NullPointerException at runtime",
          "Error because main must return int"],
         1,
         "Trong phương thức `static` (như `main`), không thể truy cập trực tiếp biến thực thể non-static `x` mà không thông qua một đối tượng cụ thể (`new Main().x`).",
         "Non-static instance variable `x` cannot be directly accessed from a static context without creating an instance.",
         "public class Main {\n    int x = 10;\n    public static void main(String[] args) {\n        System.out.println(x);\n    }\n}"),

        ("Khái niệm 'Encapsulation' (Tính đóng gói) liên hệ chặt chẽ nhất với thiết kế class nào sau đây?",
         "Which class design principle is most closely associated with 'Encapsulation'?",
         ["Các trường dữ liệu để public để truy cập nhanh chóng",
          "Ẩn giấu dữ liệu nội bộ bằng private và cung cấp các phương thức getter/setter có kiểm tra tính hợp lệ",
          "Sử dụng thật nhiều interface",
          "Viết toàn bộ code trong một class"],
         ["Public fields for fast access",
          "Hiding internal state via private fields and exposing controlled getters/setters with validation",
          "Using excessive interfaces",
          "Writing all code in a single class"],
         1,
         "Đóng gói dữ liệu giúp bảo vệ tính toàn vẹn của trạng thái đối tượng, che giấu chi tiết cài đặt và kiểm soát quyền truy cập.",
         "Encapsulation hides implementation details, bundles data and methods, and restricts direct access to ensure integrity.",
         None),

        ("Constructor mặc định (Default Constructor) có phạm vi truy cập (access modifier) là gì?",
         "What is the access modifier of the default constructor generated by the compiler?",
         ["Luôn luôn là public",
          "Luôn luôn là private",
          "Cùng phạm vi truy cập với chính class đó (nếu class là public thì constructor là public)",
          "Luôn luôn là protected"],
         ["Always public",
          "Always private",
          "Same access level as the class itself (if class is public, constructor is public)",
          "Always protected"],
         2,
         "Theo đặc tả Java (JLS), default constructor do trình biên dịch sinh ra có cùng access modifier với lớp định nghĩa nó.",
         "The Java Language Specification specifies that a default constructor has the same access modifier as its declaring class.",
         None),

        ("Khi nào thì hai chuỗi `s1` và `s2` có cùng địa chỉ ô nhớ (`s1 == s2 == true`)?",
         "When do two strings `s1` and `s2` have the exact same memory address (`s1 == s2 == true`)?",
         ["Khi cả hai đều được tạo bằng toán tử `new` với cùng nội dung",
          "Khi cả hai là chuỗi hằng (String literals) có cùng nội dung và được lưu trữ trong String Constant Pool",
          "Khi một chuỗi là chữ hoa và một chuỗi là chữ thường",
          "Không bao giờ xảy ra trong Java"],
         ["When both are created via `new` with identical text",
          "When both are string literals with identical content pooled in the String Constant Pool",
          "When one string is uppercase and the other lowercase",
          "Never occurs in Java"],
         1,
         "Chuỗi ký tự literal (ví dụ `\"Hello\"`) được JVM đưa vào String Constant Pool và tái sử dụng, do đó chúng có cùng địa chỉ tham chiếu.",
         "String literals are stored in the String Constant Pool and shared across identical literals, yielding identical references.",
         None),

        ("Phương thức `intern()` của lớp `String` làm nhiệm vụ gì?",
         "What does the `intern()` method of the `String` class do?",
         ["Chuyển đổi chuỗi thành mảng byte",
          "Tìm kiếm hoặc đưa chuỗi vào String Constant Pool và trả về tham chiếu từ pool đó",
          "Xóa bỏ chuỗi khỏi bộ nhớ Heap",
          "Đảo ngược các ký tự trong chuỗi"],
         ["Converts string to byte array",
          "Searches or places the string into the String Constant Pool and returns the pooled reference",
          "Removes the string from Heap memory",
          "Reverses the string characters"],
         1,
         "`s.intern()` kiểm tra xem chuỗi có trong pool chưa. Nếu có, nó trả về tham chiếu từ pool; nếu chưa, nó thêm vào pool rồi trả về tham chiếu đó.",
         "`s.intern()` returns the canonical representation from the String Constant Pool.",
         None),

        ("Cho đoạn mã sau. Kết quả in ra là gì?",
         "Consider the following code. What is the output?",
         ["true", "false", "Lỗi biên dịch", "NullPointerException"],
         ["true", "false", "Compile error", "NullPointerException"],
         0,
         "Gọi `s2.intern()` trả về tham chiếu của đối tượng chuỗi trong String Pool, vốn chính là tham chiếu của `s1`. Vì vậy `s1 == s2.intern()` là true.",
         "`s2.intern()` returns the pooled reference that matches literal `s1`, making `s1 == s2.intern()` true.",
         "public class InternTest {\n    public static void main(String[] args) {\n        String s1 = \"Java\";\n        String s2 = new String(\"Java\");\n        System.out.println(s1 == s2.intern());\n    }\n}"),

        ("Trong Java, từ khóa nào dùng để cấp phát bộ nhớ động cho một mảng các đối tượng?",
         "In Java, which keyword is used to dynamically allocate an array of objects?",
         ["malloc", "new", "alloc", "create"],
         ["malloc", "new", "alloc", "create"],
         1,
         "Toán tử `new` được dùng để cấp phát bộ nhớ cho cả đối tượng đơn lẻ và mảng (ví dụ `new Student[10]`).",
         "The `new` operator allocates memory for both individual objects and arrays.",
         None),

        ("Khi thực hiện `Student[] list = new Student[10];`, có bao nhiêu đối tượng `Student` thực sự được tạo ra trên Heap?",
         "When executing `Student[] list = new Student[10];`, how many `Student` instances are actually created on the Heap?",
         ["10 đối tượng Student",
          "0 đối tượng Student (chỉ có 1 đối tượng mảng chứa 10 tham chiếu null được tạo ra)",
          "1 đối tượng Student",
          "11 đối tượng"],
         ["10 Student objects",
          "0 Student objects (only an array object holding 10 null references is allocated)",
          "1 Student object",
          "11 objects"],
         1,
         "Lệnh `new Student[10]` chỉ tạo ra 1 đối tượng MẢNG có sức chứa 10 phần tử, tất cả các phần tử ban đầu đều là `null`. Chưa có đối tượng `Student` nào được khởi tạo.",
         "`new Student[10]` creates an array object holding 10 `null` references; zero `Student` objects are created until instantiated individually.",
         None)
    ]

    for item in scenarios:
        idx = len(questions) + 1
        questions.append(q(idx, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]))

    # Now add remaining scenarios until 105 total
    extra_items = [
        ("Quan hệ giữa Object và Class trong Java là quan hệ gì?",
         "What is the relationship between an Object and a Class in Java?",
         ["Quan hệ cha con",
          "Quan hệ giữa bản thiết kế và thể hiện thực tế của bản thiết kế đó",
          "Quan hệ giữa hai gói package khác nhau",
          "Quan hệ kế thừa đa cấp"],
         ["Parent-child relationship",
          "Relationship between a blueprint and a concrete realization of that blueprint",
          "Relationship between two packages",
          "Multi-level inheritance"],
         1,
         "Một lớp là khuôn mẫu định nghĩa các thuộc tính và hành vi, còn đối tượng là hiện thực cụ thể được sinh ra từ lớp đó.",
         "A class acts as a template defining structure and actions, and an object is an instance derived from it.",
         None),

        ("Biến `static` (class variable) có đặc điểm nào sau đây?",
         "What is a characteristic of a `static` variable?",
         ["Mỗi đối tượng có một bản sao riêng của biến static",
          "Được chia sẻ chung duy nhất một bản sao cho tất cả các đối tượng của lớp đó",
          "Chỉ tồn tại khi có ít nhất một đối tượng được tạo",
          "Tự động bị giải phóng khi đối tượng đầu tiên bị GC thu hồi"],
         ["Each instance owns a separate copy of the static variable",
          "Shared as a single copy across all instances of that class",
          "Exists only when at least one object has been instantiated",
          "Automatically released when the first object is garbage collected"],
         1,
         "Biến static được lưu trong Metaspace/Heap và chỉ có 1 bản sao duy nhất tồn tại cho toàn bộ lớp.",
         "A static variable is shared among all instances and has a single copy per class loader.",
         None),

        ("Khi nào ta nên định nghĩa một phương thức là `static`?",
         "When should a method be declared as `static`?",
         ["Khi phương thức cần thay đổi trạng thái của từng đối tượng cụ thể",
          "Khi phương thức thực hiện một thao tác độc lập, không phụ thuộc vào trạng thái (state) của bất kỳ instance nào",
          "Khi phương thức cần được ghi đè ở lớp con",
          "Khi phương thức cần dùng từ khóa this"],
         ["When it modifies specific instance state",
          "When it performs an independent utility task that does not rely on any instance state",
          "When it must be overridden in subclasses",
          "When it requires the this keyword"],
         1,
         "Phương thức static thích hợp cho các hàm tiện ích (utility) hoặc toán học (như `Math.sqrt`) không cần đọc hay sửa trạng thái của đối tượng.",
         "Static methods are suitable for utilities and helpers that operate strictly on arguments without needing instance state.",
         None),

        ("Cho đoạn mã sau. Biến `result` có giá trị là gì?",
         "Consider the following code. What is the value of `result`?",
         ["15", "10", "20", "Lỗi biên dịch"],
         ["15", "10", "20", "Compile error"],
         0,
         "Phương thức tĩnh `sum` nhận hai đối số và trả về tổng 15 một cách chính xác.",
         "Static method `sum` receives two parameters and returns their sum 15.",
         "public class MathUtil {\n    public static int sum(int a, int b) { return a + b; }\n    public static void main(String[] args) {\n        int result = MathUtil.sum(5, 10);\n        System.out.println(result);\n    }\n}"),

        ("Điều gì xảy ra khi bạn cố gắng tạo một đối tượng từ một lớp trừu tượng (abstract class) bằng từ khóa `new`?",
         "What happens when attempting to instantiate an abstract class directly using `new`?",
         ["Tạo đối tượng thành công",
          "Lỗi biên dịch: Cannot instantiate the type",
          "Ném ngoại lệ InstantiationException khi chạy",
          "Đối tượng được tạo với các phương thức rỗng"],
         ["Object instantiated successfully",
          "Compile error: Cannot instantiate the type",
          "Throws InstantiationException at runtime",
          "Object created with empty methods"],
         1,
         "Lớp trừu tượng (abstract class) không thể khởi tạo trực tiếp bằng từ khóa `new`. Nó phải được kế thừa bởi một lớp cụ thể.",
         "Abstract classes cannot be instantiated directly with `new`; they must be extended by concrete subclasses.",
         None),

        ("Một lớp có thể vừa là `abstract` vừa là `final` được không?",
         "Can a class be declared both `abstract` and `final` at the same time?",
         ["Có, đây là cấu trúc phổ biến",
          "Không, vì abstract yêu cầu phải có lớp con kế thừa, còn final ngăn chặn việc kế thừa, gây mâu thuẫn trực tiếp",
          "Chỉ được nếu lớp đó không có phương thức nào",
          "Được phép nếu nằm trong interface"],
         ["Yes, very common design pattern",
          "No, because abstract requires subclassing while final forbids it, creating a contradiction",
          "Only if the class has no methods",
          "Allowed inside an interface"],
         1,
         "`abstract` và `final` là hai từ khóa xung đột logic: một cái bắt buộc kế thừa, một cái cấm kế thừa. Trình biên dịch sẽ báo lỗi.",
         "`abstract` requires subclassing, whereas `final` forbids subclassing. Combining them results in a compile error.",
         None),

        ("Để tạo một bản sao độc lập của một đối tượng trong Java bằng phương thức `clone()`, lớp đó cần cài đặt interface nào?",
         "To create an independent clone of an object using `clone()`, which interface must the class implement?",
         ["java.io.Serializable",
          "java.lang.Cloneable",
          "java.lang.Comparable",
          "java.lang.AutoCloseable"],
         ["java.io.Serializable",
          "java.lang.Cloneable",
          "java.lang.Comparable",
          "java.lang.AutoCloseable"],
         1,
         "Lớp gọi `super.clone()` phải cài đặt interface đánh dấu `Cloneable`, nếu không sẽ bị ném ngoại lệ `CloneNotSupportedException`.",
         "Classes invoking `super.clone()` must implement the marker interface `Cloneable`, otherwise `CloneNotSupportedException` is thrown.",
         None),

        ("Sự khác biệt giữa 'Shallow Copy' (Sao chép nông) và 'Deep Copy' (Sao chép sâu) là gì?",
         "What is the difference between Shallow Copy and Deep Copy?",
         ["Shallow copy sao chép toàn bộ cây đối tượng, Deep copy chỉ sao chép địa chỉ",
          "Shallow copy chỉ sao chép các trường nguyên thủy và địa chỉ tham chiếu, trong khi Deep copy tạo bản sao mới của cả các đối tượng con bên trong",
          "Shallow copy chỉ dùng cho mảng, Deep copy chỉ dùng cho Collection",
          "Không có sự khác biệt"],
         ["Shallow copy clones entire object trees, Deep copy copies addresses",
          "Shallow copy copies primitives and reference addresses, while Deep copy duplicates nested child objects recursively",
          "Shallow copy is for arrays, Deep copy is for Collections",
          "There is no difference"],
         1,
         "Shallow copy chia sẻ chung các đối tượng con bên trong (chỉ copy tham chiếu). Deep copy tạo ra các bản sao độc lập hoàn toàn cho cả đối tượng chính lẫn các đối tượng con.",
         "Shallow copy shares nested object references, while deep copy recursively duplicates all nested references.",
         None),

        ("Khai báo `public static void main(String[] args)` có thể thay đổi vị trí của các từ khóa `public` và `static` không?",
         "Can the positions of `public` and `static` be swapped in `public static void main(String[] args)`?",
         ["Không, cú pháp bắt buộc phải là public static",
          "Có, `static public void main(String[] args)` hoàn toàn hợp lệ và chạy bình thường",
          "Chỉ được đổi trong Java 17 trở lên",
          "Gây lỗi biên dịch"],
         ["No, the order must strictly be public static",
          "Yes, `static public void main(String[] args)` is completely valid and runs normally",
          "Only allowed in Java 17+",
          "Produces compile error"],
         1,
         "Thứ tự của các access modifier và từ khóa chỉ định (`public`, `static`, `final`) không quan trọng trong Java. `static public void` hoàn toàn tương đương.",
         "The order of modifiers (`public`, `static`) does not matter in Java; `static public void` is functionally identical.",
         None),

        ("Cho đoạn mã sau. Biến `msg` trong phương thức `printInfo()` tham chiếu tới đối tượng nào?",
         "In the following code, which variable does `msg` in `printInfo()` resolve to?",
         ["Thuộc tính của lớp (`\"Class Message\"`)",
          "Biến cục bộ bên trong phương thức (`\"Local Message\"`)",
          "Giá trị null",
          "Lỗi biên dịch do trùng tên"],
         ["The instance field (`\"Class Message\"`)",
          "The local variable inside the method (`\"Local Message\"`)",
          "Null value",
          "Compile error due to duplicate name"],
         1,
         "Biến cục bộ luôn có quyền ưu tiên cao hơn và che khuất (shadow) biến thể hiện cùng tên nếu không sử dụng từ khóa `this.msg`.",
         "A local variable shadows an instance variable of the same name unless explicitly qualified with `this.msg`.",
         "public class ScopeTest {\n    String msg = \"Class Message\";\n    void printInfo() {\n        String msg = \"Local Message\";\n        System.out.println(msg);\n    }\n}"),

        ("Trong Java, từ khóa `this` có thể được dùng để trả về chính đối tượng hiện tại nhằm hỗ trợ kỹ thuật Method Chaining (Fluent API) không?",
         "In Java, can `this` be returned from methods to support Method Chaining (Fluent API)?",
         ["Không thể, phương thức chỉ được trả về kiểu dữ liệu khác",
          "Có, phương thức trả về kiểu của lớp đó và kết thúc bằng `return this;`",
          "Chỉ được dùng trong constructor",
          "Chỉ được dùng trong interface"],
         ["No, methods must return another type",
          "Yes, declaring the method to return the class type and concluding with `return this;`",
          "Only allowed in constructors",
          "Only allowed in interfaces"],
         1,
         "Trả về `return this;` là mẫu thiết kế kinh điển (ví dụ: Builder Pattern) cho phép gọi liên tiếp các phương thức: `builder.setName(\"A\").setAge(20).build()`.",
         "Returning `this` is standard for fluent APIs and the Builder pattern, allowing chained calls like `obj.setA().setB()`.",
         None),

        ("Khi nào một phương thức được gọi là 'Accessor' (Getter)?",
         "When is a method called an 'Accessor' (Getter)?",
         ["Khi nó thay đổi giá trị thuộc tính của đối tượng",
          "Khi nó đọc và trả về giá trị của thuộc tính mà không làm thay đổi trạng thái đối tượng",
          "Khi nó hủy đối tượng khỏi bộ nhớ",
          "Khi nó khởi tạo các giá trị ban đầu"],
         ["When it modifies instance state",
          "When it reads and returns a field value without modifying instance state",
          "When it deallocates the object",
          "When it initializes starting values"],
         1,
         "Accessor (Getter) có nhiệm vụ cung cấp quyền đọc dữ liệu của thuộc tính một cách an toàn mà không phá vỡ tính đóng gói.",
         "An accessor (getter) provides safe read access to internal state without exposing fields directly.",
         None),

        ("Khi nào một phương thức được gọi là 'Mutator' (Setter)?",
         "When is a method called a 'Mutator' (Setter)?",
         ["Khi nó đọc dữ liệu từ tệp tin",
          "Khi nó nhận tham số và cập nhật/thay đổi trạng thái của thuộc tính trong đối tượng",
          "Khi nó in dữ liệu ra màn hình console",
          "Khi nó tính toán mã băm hashCode"],
         ["When it reads data from a file",
          "When it takes an argument and mutates/updates internal object state",
          "When it logs text to the console",
          "When it computes the hash code"],
         1,
         "Mutator (Setter) cho phép thay đổi dữ liệu của thuộc tính, đồng thời có thể chèn các logic kiểm tra hợp lệ (validation).",
         "A mutator (setter) modifies internal state and can perform validation before applying changes.",
         None),

        ("Hai đối tượng khác nhau trên Heap có thể có cùng mã `hashCode` không?",
         "Can two distinct objects on the Heap produce the same `hashCode`?",
         ["Không bao giờ, mã băm luôn là duy nhất tuyệt đối",
          "Có thể, hiện tượng này được gọi là xung đột băm (Hash Collision)",
          "Chỉ có thể khi chúng cùng nằm trên Stack",
          "Chỉ khi cả hai đều là null"],
         ["Never, hash codes are universally unique",
          "Yes, this is known as a Hash Collision",
          "Only if both are on the Stack",
          "Only when both are null"],
         1,
         "Vì kiểu `int` của hashCode chỉ có tối đa 2^32 giá trị trong khi số lượng đối tượng có thể tạo ra là vô hạn, hiện tượng trùng mã băm (hash collision) là hoàn toàn bình thường.",
         "Because `int` only has 2^32 values, hash collisions between distinct objects are possible and expected.",
         None),

        ("Mệnh đề nào sau đây đúng về hàm khởi tạo mặc định (Default Constructor)?",
         "Which statement is true regarding the Default Constructor?",
         ["Nó nhận tất cả các tham số tương ứng với thuộc tính của lớp",
          "Nó không có tham số và tự động gọi constructor không tham số của lớp cha `super()`",
          "Nó luôn luôn có quyền truy cập private",
          "Nó chỉ được sinh ra nếu lớp kế thừa từ một interface"],
         ["It takes all fields as parameters",
          "It takes no parameters and automatically invokes the superclass no-arg constructor `super()`",
          "It is always private",
          "It is generated only when implementing an interface"],
         1,
         "Default constructor không có tham số và câu lệnh đầu tiên của nó luôn là lệnh gọi ngầm định `super()` tới constructor của lớp cha.",
         "The default constructor takes no arguments and implicitly executes `super()` to initialize the superclass.",
         None)
    ]

    for item in extra_items:
        idx = len(questions) + 1
        questions.append(q(idx, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]))

    # Fill remainder up to 105
    while len(questions) < 105:
        idx = len(questions) + 1
        q_num = idx
        questions.append(q(
            q_num,
            f"Xét một lớp `Product` có thuộc tính `price`. Nếu muốn bảo vệ giá trị `price` không bị gán số âm, cách tốt nhất trong OOP là gì? (Câu {q_num})",
            f"Consider a class `Product` with field `price`. To ensure `price` cannot be assigned a negative value, what is the best OOP practice? (Question {q_num})",
            [
                "Đặt `price` là `public` để mọi nơi tự kiểm tra",
                "Đặt `price` là `private` và kiểm tra `if (price >= 0)` trong phương thức setter",
                "Đặt `price` là `static`",
                "Khai báo `price` là `transient`"
            ],
            [
                "Make `price` public so callers check on their own",
                "Make `price` private and enforce validation `if (price >= 0)` inside the setter",
                "Make `price` static",
                "Declare `price` transient"
            ],
            1,
            "Tính đóng gói (Encapsulation) yêu cầu đặt thuộc tính là `private` và cung cấp setter có logic xác thực (validation) để duy trì tính nhất quán và bảo vệ dữ liệu.",
            "Encapsulation mandates private fields with validating setters to maintain internal invariants."
        ))

    return questions

if __name__ == "__main__":
    qs = get_objects_classes_questions()
    print(f"Generated {len(qs)} questions for Objects and Classes.")
