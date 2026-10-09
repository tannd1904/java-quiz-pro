/**
 * Service for executing Java code directly via isolated online compiler sandbox.
 * Runs in real-time and returns stdout, stderr, execution time, and memory without leaving the website.
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

const JUDGE0_API_URL = 'https://ce.judge0.com/submissions?wait=true';
const JAVA_LANGUAGE_ID = 62; // Java (OpenJDK 13.0.1)

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
          source_code: request.code,
          language_id: JAVA_LANGUAGE_ID,
          stdin: request.stdin || '',
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

      // Judge0 Status IDs:
      // 3: Accepted (Success)
      // 5: Time Limit Exceeded
      // 6: Compilation Error
      // 7-12: Runtime Errors
      const isCompilationError = statusId === 6 || Boolean(data.compile_output);
      const isRuntimeError = (statusId >= 7 && statusId <= 12) || Boolean(data.stderr);
      const isTimeLimitExceeded = statusId === 5;
      const success = statusId === 3 && !data.stderr && !data.compile_output;

      return {
        success,
        stdout: data.stdout || null,
        stderr: data.stderr || null,
        compileOutput: data.compile_output || null,
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
