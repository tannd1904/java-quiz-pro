import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prepareRunnableJavaCode } from '../src/components/common/RunCodeModal';
import { codeExecutionService } from '../src/services/codeExecutionService';

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

describe('Developer Experience - Code Execution Service', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // @ts-ignore
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    // @ts-ignore
    globalThis.fetch = originalFetch;
  });

  it('handles successful API execution response', async () => {
    const fakeResponse = {
      status: { id: 3, description: 'Accepted' },
      stdout: Buffer.from('Result = 42\n').toString('base64'),
      stderr: null,
      compile_output: null,
      time: '0.045',
      memory: 15300,
    };

    // @ts-ignore
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const result = await codeExecutionService.executeJava({
      code: 'public class Main { public static void main(String[] args) { System.out.println("Result = 42"); } }',
    });

    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Result = 42');
    expect(result.statusDescription).toBe('Accepted');
    expect(result.timeSpent).toBe('0.045s');
  });

  it('handles compilation error response correctly', async () => {
    const fakeResponse = {
      status: { id: 6, description: 'Compilation Error' },
      stdout: null,
      stderr: null,
      compile_output: Buffer.from('Main.java:1: error: semicolon expected').toString('base64'),
      time: null,
      memory: null,
    };

    // @ts-ignore
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const result = await codeExecutionService.executeJava({
      code: 'invalid code',
    });

    expect(result.success).toBe(false);
    expect(result.isCompilationError).toBe(true);
    expect(result.compileOutput).toContain('error: semicolon expected');
  });

  it('handles network failure gracefully without throwing exception', async () => {
    // @ts-ignore
    (globalThis.fetch as any).mockRejectedValueOnce(new Error('Network connection failed'));

    const result = await codeExecutionService.executeJava({
      code: 'code',
    });

    expect(result.success).toBe(false);
    expect(result.isRuntimeError).toBe(true);
    expect(result.stderr).toContain('Network connection failed');
  });
});
