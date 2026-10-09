/**
 * Service for executing Java code directly via isolated online compiler sandbox.
 * Runs in real-time and returns stdout, stderr, execution time, and memory without leaving the website.
 * Uses Base64 encoding to support all UTF-8 characters (Vietnamese, comments, unicode strings) without 400 errors.
 */

export interface CodeExecutionRequest {
  code: string;
  stdin?: string;
}

export interface CodeExecutionResponse {
  success: boolean;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  timeSpent?: string;
  memoryUsedKb?: number;
  statusDescription: string;
  isCompilationError: boolean;
  isRuntimeError: boolean;
  isTimeLimitExceeded: boolean;
}

const JUDGE0_API_URL = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';
const JAVA_LANGUAGE_ID = 62; // Java (OpenJDK 13.0.1)

/**
 * Safely encode UTF-8 string to Base64 in both browser and Node.js environments
 */
export function encodeUtf8Base64(str: string): string {
  try {
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(str)));
    }
  } catch {}
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64');
  }
  return btoa(str);
}

/**
 * Safely decode Base64 string back to UTF-8
 */
export function decodeUtf8Base64(b64: string | null | undefined): string | null {
  if (!b64) return null;
  try {
    if (typeof atob !== 'undefined') {
      return decodeURIComponent(escape(atob(b64)));
    }
  } catch {}
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64').toString('utf8');
    }
  } catch {}
  try {
    return atob(b64);
  } catch {
    return b64;
  }
}

export const codeExecutionService = {
  /**
   * Execute Java source code directly
   */
  async executeJava(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);

    try {
      const response = await fetch(JUDGE0_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: encodeUtf8Base64(request.code),
          language_id: JAVA_LANGUAGE_ID,
          stdin: encodeUtf8Base64(request.stdin || ''),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Execution service returned status ${response.status}`);
      }

      const data = await response.json();

      const statusId = data.status?.id || 0;
      const statusDesc = data.status?.description || 'Unknown';

      const decodedStdout = decodeUtf8Base64(data.stdout);
      const decodedStderr = decodeUtf8Base64(data.stderr);
      const decodedCompileOutput = decodeUtf8Base64(data.compile_output);

      // Judge0 Status IDs:
      // 3: Accepted (Success)
      // 5: Time Limit Exceeded
      // 6: Compilation Error
      // 7-12: Runtime Errors
      const isCompilationError = statusId === 6 || Boolean(decodedCompileOutput);
      const isRuntimeError = (statusId >= 7 && statusId <= 12) || Boolean(decodedStderr);
      const isTimeLimitExceeded = statusId === 5;
      const success = statusId === 3 && !decodedStderr && !decodedCompileOutput;

      return {
        success,
        stdout: decodedStdout,
        stderr: decodedStderr,
        compileOutput: decodedCompileOutput,
        timeSpent: data.time ? `${data.time}s` : undefined,
        memoryUsedKb: data.memory ? Math.round(data.memory) : undefined,
        statusDescription: statusDesc,
        isCompilationError,
        isRuntimeError,
        isTimeLimitExceeded,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err?.name === 'AbortError';
      return {
        success: false,
        stdout: null,
        stderr: isAbort
          ? 'Quá thời gian thực thi (Timeout > 15s). Có thể code chứa vòng lặp vô tận hoặc dịch vụ đang bận.'
          : `Không thể kết nối đến máy chủ biên dịch: ${err?.message || 'Lỗi mạng'}`,
        compileOutput: null,
        statusDescription: isAbort ? 'Time Limit Exceeded' : 'Network Error',
        isCompilationError: false,
        isRuntimeError: true,
        isTimeLimitExceeded: isAbort,
      };
    }
  },
};
