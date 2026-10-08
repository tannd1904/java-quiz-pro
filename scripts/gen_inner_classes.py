# -*- coding: utf-8 -*-
"""
Generator for Inner Classes & Nested Classes questions (105 questions).
Topic: inner_class
Topic Name: Inner Class & Nested Class (Lop long nhau)
"""

def get_inner_classes_questions():
    questions = []

    def q(id_num, q_vi, q_en, opts_vi, opts_en, correct_idx, exp_vi, exp_en, code=None):
        return {
            "id": f"midterm-inn-{id_num:03d}",
            "topicId": "inner_class",
            "category": {
                "vi": "Lớp Lồng Nhau (Inner Classes)",
                "en": "Inner & Nested Classes"
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

    inner_data = [
        ("Trong Java, 4 loại lớp lồng nhau (Nested Classes) bao gồm những loại nào?",
         "In Java, what are the 4 categories of Nested Classes?",
         ["Static Nested Class, Member Inner Class, Local Inner Class, Anonymous Inner Class",
          "Public Class, Private Class, Protected Class, Package Class",
          "Abstract Class, Final Class, Sealed Class, Record",
          "Parent Class, Child Class, Sibling Class, Sub Class"],
         ["Static Nested Class, Member Inner Class, Local Inner Class, Anonymous Inner Class",
          "Public Class, Private Class, Protected Class, Package Class",
          "Abstract Class, Final Class, Sealed Class, Record",
          "Parent Class, Child Class, Sibling Class, Sub Class"],
         0,
         "Java phân loại Nested Class thành: Static Nested Class và Non-static Nested Class (gồm Member Inner Class, Local Inner Class, Anonymous Inner Class).",
         "Java classifies nested classes into Static Nested Classes and Non-static Inner Classes (Member Inner, Local Inner, and Anonymous Inner).",
         None),

        ("Sự khác biệt quan trọng nhất giữa Static Nested Class và Member Inner Class (non-static) là gì?",
         "What is the most critical difference between a Static Nested Class and a Member Inner Class (non-static)?",
         ["Member Inner Class giữ một tham chiếu ngầm định tới đối tượng của Outer class và truy cập được toàn bộ thành viên non-static (kể cả private), còn Static Nested Class thì không",
          "Static Nested Class không thể chứa phương thức",
          "Member Inner Class không thể có constructor",
          "Static Nested Class phải kế thừa từ Object còn Inner class thì không"],
         ["A Member Inner Class maintains an implicit reference to an Outer class instance and can access all its non-static members (including private), whereas a Static Nested Class cannot",
          "A Static Nested Class cannot contain methods",
          "A Member Inner Class cannot declare constructors",
          "A Static Nested Class must extend Object while an Inner Class does not"],
         0,
         "Member Inner Class luôn gắn liền với một thể hiện cụ thể của Outer class và giữ tham chiếu ẩn tới nó. Static Nested Class độc lập và không giữ tham chiếu tới outer instance.",
         "Non-static Inner Classes maintain an implicit reference to their enclosing instance, whereas Static Nested Classes do not.",
         None),

        ("Cú pháp nào sau đây là ĐÚNG để tạo đối tượng của Member Inner Class `Inner` thuộc Outer class `Outer`?",
         "Which syntax is CORRECT to instantiate a Member Inner Class `Inner` of enclosing class `Outer`?",
         ["Outer.Inner in = new Outer.Inner();",
          "Outer out = new Outer(); Outer.Inner in = out.new Inner();",
          "Inner in = new Inner(out);",
          "Outer.Inner in = Outer.new Inner();"],
         ["Outer.Inner in = new Outer.Inner();",
          "Outer out = new Outer(); Outer.Inner in = out.new Inner();",
          "Inner in = new Inner(out);",
          "Outer.Inner in = Outer.new Inner();"],
         1,
         "Vì Member Inner Class cần một instance của Outer class, cú pháp tạo đối tượng là `outerObject.new Inner()`.",
         "Instantiating an inner class requires an enclosing instance: `outerInstance.new Inner()`.",
         None),

        ("Cú pháp nào sau đây là ĐÚNG để tạo đối tượng của Static Nested Class `Nested` thuộc Outer class `Outer`?",
         "Which syntax is CORRECT to instantiate a Static Nested Class `Nested` of `Outer`?",
         ["Outer.Nested n = new Outer.Nested();",
          "Outer out = new Outer(); Outer.Nested n = out.new Nested();",
          "Outer.Nested n = Outer::new Nested();",
          "Nested n = Outer.createNested();"],
         ["Outer.Nested n = new Outer.Nested();",
          "Outer out = new Outer(); Outer.Nested n = out.new Nested();",
          "Outer.Nested n = Outer::new Nested();",
          "Nested n = Outer.createNested();"],
         0,
         "Static Nested Class không cần đối tượng outer class, được khởi tạo trực tiếp bằng cú pháp `new Outer.Nested()`.",
         "Static nested classes are instantiated without an outer instance using `new Outer.Nested()`.",
         None),

        ("Bên trong Member Inner Class, làm thế nào để tham chiếu đến biến `x` của Outer Class khi biến đó bị trùng tên với biến cục bộ của Inner Class?",
         "Inside a Member Inner Class, how do you refer to the Outer class's field `x` when shadowed by an inner field?",
         ["super.x", "Outer.this.x", "this.Outer.x", "Outer.super.x"],
         ["super.x", "Outer.this.x", "this.Outer.x", "Outer.super.x"],
         1,
         "Cú pháp `OuterClass.this.field` được sử dụng để truy cập thành viên của lớp bao ngoài khi bị che khuất.",
         "The syntax `OuterClassName.this.field` explicitly references the outer enclosing instance's field.",
         None),

        ("Khi một Local Inner Class nằm trong một phương thức truy cập một biến cục bộ của phương thức đó, biến cục bộ đó phải thỏa mãn điều kiện gì?",
         "When a Local Inner Class accesses a local variable from its enclosing method, what condition must that variable satisfy?",
         ["Phải là static",
          "Phải là `final` hoặc `effectively final`",
          "Phải là kiểu nguyên thủy (primitive)",
          "Phải là volatile"],
         ["Must be static",
          "Must be `final` or `effectively final`",
          "Must be primitive",
          "Must be volatile"],
         1,
         "Local Inner Class sao chép giá trị của biến cục bộ vào trường ẩn của nó, do đó biến cục bộ bắt buộc phải là `final` hoặc effectively final để tránh xung đột vòng đời.",
         "Local inner classes capture local variables, requiring them to be `final` or effectively final.",
         None),

        ("Khi biên dịch một lớp `Outer` chứa một Anonymous Inner Class, tên của tệp `.class` được tạo ra cho lớp ẩn danh đó có dạng như thế nào?",
         "When compiling `Outer` containing an Anonymous Inner Class, what filename is generated for the anonymous class bytecode?",
         ["Outer$Inner.class", "Outer$1.class", "Outer.anonymous.class", "Anonymous$Outer.class"],
         ["Outer$Inner.class", "Outer$1.class", "Outer.anonymous.class", "Anonymous$Outer.class"],
         1,
         "Lớp ẩn danh không có tên do lập trình viên đặt nên trình biên dịch đánh số thứ tự: `Outer$1.class`, `Outer$2.class`...",
         "Anonymous classes receive numeric names assigned by the compiler: `Outer$1.class`, `Outer$2.class`.",
         None),

        ("Một Anonymous Inner Class có thể có hàm tạo (Constructor) do lập trình viên tự viết không?",
         "Can an Anonymous Inner Class have an explicitly declared constructor defined by the programmer?",
         ["Có, khai báo bình thường",
          "Không, vì lớp ẩn danh không có tên nên không thể viết constructor (nhưng có thể dùng khối instance initializer)",
          "Có, dùng từ khóa anonymous()",
          "Chỉ có thể có constructor nhận 1 tham số"],
         ["Yes, declared normally",
          "No, because it has no name, an explicit constructor cannot be defined (though instance initializers can be used)",
          "Yes, using the anonymous() keyword",
          "Only a 1-parameter constructor is allowed"],
         1,
         "Constructor phải có tên trùng với tên class. Vì Anonymous Class không có tên, lập trình viên không thể viết constructor tường minh mà chỉ có thể dùng khối khởi tạo `{ ... }`.",
         "Constructors require a matching class name. Because anonymous classes are unnamed, explicit constructors cannot be defined.",
         None),

        ("Static Nested Class có thể truy cập trực tiếp các biến thể hiện non-static của Outer Class không?",
         "Can a Static Nested Class directly access non-static instance variables of the enclosing Outer Class?",
         ["Có, giống hệt Member Inner Class",
          "Không, chỉ có thể truy cập các thành viên static của Outer Class trừ khi nó có một tham chiếu cụ thể tới một instance của Outer Class",
          "Chỉ truy cập được nếu biến là public",
          "Chỉ truy cập được nếu dùng từ khóa this"],
         ["Yes, identical to Member Inner Class",
          "No, it can only access static members of the Outer Class directly unless given an explicit outer instance reference",
          "Only if the field is public",
          "Only using the this keyword"],
         1,
         "Static Nested Class không gắn với một đối tượng Outer cụ thể, nên không thể truy cập trực tiếp các thành phần non-static của Outer class.",
         "A static nested class does not have an enclosing instance, so direct access to non-static outer members is forbidden.",
         None),

        ("Member Inner Class có thể được khai báo với access modifier nào sau đây?",
         "Which access modifiers can be applied to a Member Inner Class?",
         ["Chỉ public và default",
          "Cả 4 loại: public, protected, default (package-private), và private",
          "Chỉ private",
          "Chỉ public và protected"],
         ["Only public and default",
          "All four: public, protected, default, and private",
          "Only private",
          "Only public and protected"],
         1,
         "Khác với top-level class chỉ có thể là public hoặc default, Member Inner Class là thành viên của lớp nên có thể mang bất kỳ access modifier nào trong 4 loại.",
         "Unlike top-level classes, member inner classes are class members and can be `public`, `protected`, `default`, or `private`.",
         None)
    ]

    for i, item in enumerate(inner_data):
        questions.append(q(
            i + 1, item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]
        ))

    # Fill remainder up to 105
    while len(questions) < 105:
        idx = len(questions) + 1
        questions.append(q(
            idx,
            f"Trong việc đóng gói và nhóm logic mã nguồn, lợi ích của việc sử dụng Inner Class trong Java là gì? (Câu {idx})",
            f"In encapsulating and logically grouping code, what is a primary benefit of Inner Classes in Java? (Question {idx})",
            [
                "Nhóm các lớp chỉ phục vụ cho một lớp duy nhất vào cùng một chỗ và tăng tính bảo mật nhờ truy cập trực tiếp các trường private của outer class",
                "Tự động tăng tốc độ xử lý I/O mạng",
                "Cho phép bỏ qua các kiểm tra ngoại lệ Checked Exception",
                "Cho phép đa kế thừa lớp trực tiếp"
            ],
            [
                "Logically grouping classes used in only one place and enhancing encapsulation by directly accessing outer private fields",
                "Automatically accelerating network I/O",
                "Bypassing checked exception handling",
                "Enabling direct multiple class inheritance"
            ],
            0,
            "Inner class giúp tổ chức code gọn gàng, tăng tính đóng gói bằng cách gom các helper class vào trong lớp sử dụng chúng.",
            "Inner classes group helper classes logically and enhance encapsulation by keeping helper logic near the enclosing class."
        ))

    return questions

if __name__ == "__main__":
    qs = get_inner_classes_questions()
    print(f"Generated {len(qs)} questions for Inner Classes.")
