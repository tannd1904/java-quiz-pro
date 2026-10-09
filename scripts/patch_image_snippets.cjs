const fs = require('fs');

const codeMap = {
  "java-012": `public class Main {
    public static void main(String[] args) {
        int x = -1;
        String y = x + 3; // Lỗi: incompatible types
        System.out.println("x = " + x + " y = " + y);
    }
}`,

  "java-015": `int i = 1, j = 10;
do {
    if (i++ > --j) {
        break;
    }
} while (i < 5);
System.out.println("i = " + i + " and j = " + j);`,

  "java-019": `int i = 0;
boolean flag;
do {
    flag = false;
    System.out.print(i++);
    flag = i < 10;
    continue;
} while ((flag) ? true : false);`,

  "java-023": `public class Test {
    public static int switchIt(int x) {
        int j = 1;
        switch (x) {
            case 1: j++;
            case 2: j++;
            case 3: j++;
            case 4: j++;
            default: j++;
        }
        return j + x;
    }

    public static void main(String[] args) {
        System.out.println("value = " + switchIt(4));
    }
}`,

  "java-024": `class A {
    int x = 10;
    public void calTotal(A a) {
        a.x = 12;
        System.out.println(a.x);
    }
}`,

  "java-030": `public class Main {
    public static void main(String[] args) {
        String names[] = {
            "John",
            "Anna",
            "Peter",
            "Victor",
            "David"
        };
        System.out.println(names[2]);
    }
}`,

  "java-032": `class Student {
    public String sayHello() {
        return "Student";
    }
}

public class Man extends Student {
    // Lỗi: Kiểu trả về int không tương thích với String ở lớp cha
    public int sayHello() {
        return 0;
    }
}`,

  "java-037": `public class Main {
    public static void main(String[] args) {
        String names[] = {
            "John",
            "Anna",
            "Peter",
            "Victor",
            "David"
        };
        System.out.println(names[2]);
    }
}`,

  "java-038": `class Student {}

public class Man extends Student {
    public static void main(String[] args) {
        Man m = new Student(); // Lỗi: Incompatible types
    }
}`,

  "java-039": `class A {
    int x = 10;
    public void calTotal(A a) {
        a.x = 12;
        System.out.println(a.x);
    }
}`,

  "java-074": `String greeting = "Hello";
int k = greeting.length();
System.out.print(k);`,

  "java-078": `public class Main {
    public static void main(String[] args) {
        String names[] = {
            "John",
            "Anna",
            "Peter",
            "Victor",
            "David"
        };
        System.out.println(names[2]);
    }
}`,

  "java-079": `String s = "cabcab";
java.util.StringTokenizer st = new java.util.StringTokenizer(s, "ab");
int x = st.countTokens();
System.out.println(x);`,

  "java-080": `class Student {}

public class Man extends Student {
    public boolean isMan() {
        return true;
    }
}`,

  "java-081": `class Student {
    public String sayHello() {
        return "Student";
    }
}

public class Man extends Student {
    public String sayHello() {
        return "man";
    }

    public static void main(String[] args) {
        Man m = new Student(); // Lỗi biên dịch: Incompatible types
        System.out.println(m.sayHello());
    }
}`,

  "java-082": `class Student {
    public int getAge() {
        return 10;
    }
}

public class Man extends Student {
    // Không lỗi vì đây là nạp chồng (overload) phương thức getAge
    protected int getAge(int added) {
        return super.getAge() + added;
    }
}`,

  "java-084": `package pac02;
public class ClassA {
    public int xA;
    public String yA;
}

package pac01;
import pac02.ClassA;
public class Test {
    public static void main(String[] args) {
        ClassA a = new ClassA();
        a.xA = 12;
        a.yA = "Hello";
        System.out.println("a.xA = " + a.xA + "; a.yA = " + a.yA);
    }
}`,

  "java-086": `char[] greet = new char[10];
greet = "Hello"; // Lỗi biên dịch: không thể gán String cho char[]
int k = greet.length;
System.out.print(k);`,

  "java-090": `String greetings = "Hello";
String s = greetings.substring(0, 4); // Hell (từ index 0 đến 3)
System.out.println(s);`,

  "java-091": `String greetings = "Hello" // Thiếu dấu chấm phẩy ;
String s = greetings.substring(0, 3);`,

  "java-092": `String greetings = " Hello ";
String s = greetings.substring(0, 3);
System.out.println(s);`,

  "java-097": `int thu = 1;
switch (thu) {
    case 2:
        System.out.println("Van, Toan");
        break;
    case 3:
        System.out.println("Hoa, Ly");
        break;
    default:
        System.out.println("Ngay nghi");
        break;
}`,

  "java-098": `int thu = 2;
switch (thu) {
    case 2:
        System.out.println("Van, Toan");
        break;
    case 3:
        System.out.println("Hoa, Ly");
        break;
    default:
        System.out.println("Ngay nghi");
        break;
}`,

  "java-099": `int thu = 3;
switch (thu) {
    case 2:
        System.out.println("Van, Toan");
        break;
    case 3:
        System.out.println("Hoa, Ly");
        break;
    default:
        System.out.println("Ngay nghi");
        break;
}`,

  "java-100": `enum mausac {
    DEN,
    LAM,
    LUC,
    TRANG
}

mausac color = mausac.DEN;
String t;
switch (color) {
    case DEN:
        t = "Mau trang";
        break;
    case LAM:
        t = "Mau lam";
        break;
    default:
        t = "Khong co trong danh sach mau";
        break;
}
System.out.println(t);`,

  "java-101": `int s = 0;
for (int i = 0; i < 10; i++) {
    s += i;
}
System.out.println(s);`,

  "java-102": `int[] mang = new int[10];
int s = 0;
for (int i : mang) {
    s += i;
}
System.out.println("S = " + s);`,

  "java-108": `final int ARRAY_SIZE = 5;
ARRAY_SIZE = 10; // Lỗi ở dòng 2: không thể gán lại giá trị cho biến final
System.out.println("size = " + ARRAY_SIZE);`,

  "java-109": `class A {
    final public int method1(int a, int b) {
        return 0;
    }
}

class B extends A {
    // Lỗi: Không thể ghi đè (override) phương thức final từ lớp cha
    public int method1(int a, int b) {
        return 1;
    }
}

public class Test {
    public static void main(String args[]) {
        B b = new B();
        System.out.println("x = " + b.method1(0, 1));
    }
}`,

  "java-110": `class Student {
    public int getAge() {
        return 10;
    }
}

public class Man extends Student {
    public int getAge(int added) {
        return super.getAge() + added;
    }

    public static void main(String[] args) {
        Man s = new Man();
        System.out.println(s.getAge());
        System.out.println(s.getAge());
    }
}`,

  "java-111": `class Student {
    public String name;
}

public class Man extends Student {
    private String name; // Ẩn trường (hiding field) hợp lệ trong Java
}`,

  "java-112": `class Student {
    protected String name;
}

public class Man extends Student {
    public static void main(String[] args) {
        Man m = new Man();
        m.name = "John";
    }
}`,

  "java-113": `class Student {
    private String name;
}

public class Man extends Student {
    private String name;

    public static void main(String[] args) {
        Student m = new Student();
        m.name = "Peter"; // Lỗi biên dịch: name has private access in Student
    }
}`,

  "java-115": `class Student {}

public class Man extends Student {}`,

  "java-119": `package pac02;
public class ClassA {
    protected int xA;
    public String yA;
}

package pac01;
import pac02.ClassA;
public class Test {
    public static void main(String[] args) {
        ClassA a = new ClassA();
        a.xA = 12;
        a.yA = "Hello";
        System.out.println("a.xA = " + a.xA + "; a.yA = " + a.yA);
    }
}`,

  "java-120": `package java.school;
public class Student {}

package java.test;
public class Main {
    public static void main(String[] args) {
        java.school.Student s = new java.school.Student();
    }
}`,

  "java-122": `package java.school;
public class Student {}

package java.test;
public class Main {
    public static void main(String[] args) {
        Student s = new Student(); // Lỗi: cannot find symbol Student (chưa import)
    }
}`,

  "java-123": `public class Main {
    public static void main(String[] args) {
        String names[] = {
            "John",
            "Anna",
            "Peter",
            "Victor",
            "David"
        };
        names = new String[5]; // Cấp phát mảng mới các phần tử mặc định là null
        System.out.println(names[2]);
    }
}`,

  "java-125": `public class Delta {
    static boolean foo(char c) {
        System.out.print(c);
        return true;
    }

    public static void main(String[] argv) {
        int i = 0;
        for (foo('A'); foo('B') && (i < 2); foo('C')) {
            i++;
            foo('D');
        }
    }
}`,

  "java-126": `StringBuffer s = new StringBuffer("hello how are you how?");
int x = s.indexOf("ow");
System.out.println(x);`,

  "java-128": `final int ARRAY_SIZE = 5;
ARRAY_SIZE = 10; // Lỗi ở dòng 2: không thể gán lại biến final
System.out.println("size = " + ARRAY_SIZE);`,

  "java-129": `class Student {}

public class Man extends Student {
    public boolean isMan() {
        return true;
    }
}`,

  "java-130": `class Student {
    String sayHello() {
        return "Student";
    }
}

public class Man extends Student {
    // Không lỗi vì protected mở rộng quyền truy cập so với default
    protected String sayHello() {
        return "man";
    }

    public static void main(String[] args) {
        Student s = new Man();
        System.out.println(s.sayHello());
    }
}`,

  "java-131": `class Student {
    public int getAge() {
        return 10;
    }
}

public class Man extends Student {
    public int getAge(int added) {
        return super.getAge() + added;
    }

    public static void main(String[] args) {
        Man s = new Man();
        System.out.println(s.getAge());
        System.out.println(s.getAge());
    }
}`,

  "java-132": `class Student {
    public String name;
}

public class Man extends Student {}`,

  "java-134": `class Super {
    public float getNum() {
        return 3.0f;
    }
}

public class Sub extends Super {
    // Phương thức đưa vào dòng 6 gây lỗi:
    // public getNum() { } -> Thiếu kiểu dữ liệu trả về
}`,

  "java-136": `String[] str = {"lap", "trinh", "java"};
System.out.println(str[1][1]); // Lỗi: str là mảng 1 chiều, không thể truy cập str[1][1]`,

  "java-137": `class Student {
    public String sayHello() {
        return "Student";
    }
}

public class Man extends Student {
    public String sayHello() {
        return super.sayHello();
    }

    public static void main(String[] args) {
        Student m = new Student();
        System.out.println(m.sayHello());
    }
}`,

  "java-138": `class BreakDemo {
    public static void main(String[] args) {
        int[] arrayOfInts = {
            32, 87, 3, 589, 12, 1076, 2000, 8, 622, 127
        };
        int searchFor = 12;
        int i;
        boolean foundIt = false;
        for (i = 0; i < arrayOfInts.length; i++) {
            if (arrayOfInts[i] == searchFor) {
                foundIt = true;
                break;
            }
        }
        if (foundIt) {
            System.out.println("Found " + searchFor + " at index " + i);
        } else {
            System.out.println(searchFor + " not in the array");
        }
    }
}`,

  "java-139": `class BreakDemo {
    public static void main(String[] args) {
        int[] arrayOfInts = {
            32, 87, 3, 589, 12, 1076, 2000, 8, 622, 127
        };
        int searchFor = 12;
        int i;
        boolean foundIt = false;
        for (i = 0; i < arrayOfInts.length; i++) {
            if (arrayOfInts[i] == searchFor) {
                foundIt = true;
                break;
            }
        }
        if (foundIt) {
            System.out.println("Found " + searchFor + " at index " + i);
        } else {
            System.out.println(searchFor + " not in the array");
        }
    }
}`,

  "java-140": `class ContinueDemo {
    public static void main(String[] args) {
        String searchMe = "peter piper picked a peck of pickled peppers";
        int max = searchMe.length();
        int numPs = 0;
        for (int i = 0; i < max; i++) {
            if (searchMe.charAt(i) != 'p') continue;
            numPs++;
        }
        System.out.println("Found " + numPs + " p's in the string.");
    }
}`,

  "java-141": `class ContinueDemo {
    public static void main(String[] args) {
        String searchMe = "peter piper picked a peck of pickled peppers";
        int max = searchMe.length();
        int numPs = 0;
        for (int i = 0; i < max; i++) {
            if (searchMe.charAt(i) != 'p') continue;
            numPs++;
        }
        System.out.println("Found " + numPs + " p's in the string.");
    }
}`,

  "java-147": `StringBuffer s = new StringBuffer("hello how are you?");
int x = s.charAt(6); // 'h' có mã ASCII là 104
System.out.println(x);`,

  "java-151": `String[] students = new String[10];
String studentName = "Peter Parker";
students[0] = studentName;
studentName = null;`,

  "java-152": `public class SomeWrong {
    public static void main(String[] args) {
        Rectangle myRect; // Chưa khởi tạo bằng new Rectangle()
        myRect.width = 40;
        myRect.height = 50;
        System.out.println("Dien tich hinh chu nhat: " + myRect.area());
    }
}`,

  "java-156": `String expletive = "Expletive";
String PG13 = "deleted";
String message = expletive.substring(1, 3) + PG13; // "xp" + "deleted" = "xpldeleted"
System.out.println(message);`,

  "java-157": `int age = 13;
String message = "PG" + age;
System.out.println(message);`,

  "java-160": `String greetings = "Hello";
char letter = greetings.charAt(0);
System.out.println(letter);`,

  "java-161": `double a = 5, b = 8;
if (a == 0) {
    if (b != 0) System.out.println("Phuong trinh vo nghiem");
    else System.out.println("Phuong trinh co vo so nghiem");
} else {
    System.out.println(-b / a);
}`,

  "java-162": `double a = 0, b = 0;
if (a == 0) {
    if (b != 0) System.out.println("Phuong trinh vo nghiem");
    else System.out.println("Phuong trinh co vo so nghiem");
} else {
    System.out.println(-b / a);
}`,

  "java-163": `double a = 0, b = 8;
if (a == 0) {
    if (b != 0) System.out.println("Phuong trinh vo nghiem");
    else System.out.println("Phuong trinh co vo so nghiem");
} else {
    System.out.println(-b / a);
}`,

  "java-191": `public class foo {
    public static void main(String[] args) {
        String s;
        System.out.println("s=" + s); // Lỗi ở dòng 4: biến cục bộ s chưa được khởi tạo
    }
}`,

  "java-192": `int i = 1, j = 10;
do {
    if (i++ > --j) continue;
} while (i < 5);
System.out.println("i = " + i + " and j = " + j);`,

  "java-194": `public abstract class Test {
    public abstract void methodA();
    public abstract void methodB() { // Lỗi: phương thức abstract không được có thân hàm {}
        System.out.println("Hello");
    }
}`,

  "java-196": `public class Main {
    public static void main(String[] args) {
        String names[] = {
            "John",
            "Anna",
            "Peter",
            "Victor",
            "David"
        };
        System.out.println(names.length);
    }
}`,

  "java-197": `class Super {
    public float getNum() {
        return 3.0f;
    }
}

public class Sub extends Super {
    // Phương thức gây lỗi:
    // public getNum() { }
}`,

  "java-198": `public class Test {
    public static void main(String args[]) {
        int i = 0;
        while (true) {
            if (i == 4) break;
            System.out.println(i);
            i++;
        }
    }
}`,

  "java-199": `public class Foo {
    public static void main(String[] args) {
        try {
            return;
        } finally {
            System.out.println("Finally");
        }
    }
}`
};

function patchFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  for (const q of content) {
    if (codeMap[q.id]) {
      q.codeSnippet = codeMap[q.id];
      updatedCount++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Updated ${updatedCount}/${Object.keys(codeMap).length} questions in ${filePath}`);
}

patchFile('ngan_hang_de.json');
if (fs.existsSync('public/data/questions.json')) {
  patchFile('public/data/questions.json');
}
