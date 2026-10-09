import { describe, it, expect } from 'vitest';
import { prepareRunnableJavaCode } from '../src/components/common/RunCodeModal';

describe('Developer Experience - Runnable Java Code Preparation', () => {
  it('wraps raw statement snippet into public class Main with main method', () => {
    const raw = `int x = 10;
System.out.println(x++);`;

    const prepared = prepareRunnableJavaCode(raw);
    expect(prepared).toContain('public class Main');
    expect(prepared).toContain('public static void main(String[] args)');
    expect(prepared).toContain('System.out.println(x++);');
  });

  it('keeps code that already has Main class and main method', () => {
    const raw = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`;

    const prepared = prepareRunnableJavaCode(raw);
    expect(prepared).toContain('public class Main');
    expect(prepared).toContain('System.out.println("Hello")');
  });

  it('renames public class Foo to public class Main if it has main method', () => {
    const raw = `public class Solution {
    public static void main(String[] args) {
        System.out.println("Solve");
    }
}`;

    const prepared = prepareRunnableJavaCode(raw);
    expect(prepared).toContain('public class Main');
    expect(prepared).not.toContain('public class Solution');
  });

  it('adds Main class with main runner when snippet defines helper classes without main', () => {
    const raw = `class Person {
    String name;
}`;

    const prepared = prepareRunnableJavaCode(raw);
    expect(prepared).toContain('class Person');
    expect(prepared).toContain('public class Main');
    expect(prepared).toContain('public static void main(String[] args)');
  });
});
