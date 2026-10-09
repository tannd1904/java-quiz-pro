import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../../hooks/useI18n';
import { codeExecutionService, CodeExecutionResponse } from '../../services/codeExecutionService';
import {
  Play,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Sparkles,
  RotateCcw,
  Clock,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Code2,
} from 'lucide-react';

interface RunCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawCode: string;
}

export const prepareRunnableJavaCode = (snippet: string): string => {
  const trimmed = snippet.trim();
  const hasClass = /\b(class|interface|enum)\b/.test(trimmed);
  const hasMain = /\bpublic\s+static\s+void\s+main\b/.test(trimmed);

  // If already complete with class and main method
  if (hasClass && hasMain) {
    if (/\bpublic\s+class\s+(?!Main\b)\w+/.test(trimmed)) {
      return trimmed.replace(/\bpublic\s+class\s+\w+/, 'public class Main');
    }
    return trimmed;
  }

  // If has class but no main method (e.g. helper class definition)
  if (hasClass && !hasMain) {
    const safeClasses = trimmed.replace(/\bpublic\s+class\b/g, 'class');
    return `${safeClasses}

public class Main {
    public static void main(String[] args) {
        System.out.println("Running Java Quiz snippet...");
        // Bạn có thể khởi tạo đối tượng và chạy thử ở đây:
    }
}`;
  }

  // Raw fragment (just statements or expressions)
  const indented = trimmed
    .split('\n')
    .map((line) => `        ${line}`)
    .join('\n');

  return `public class Main {
    public static void main(String[] args) {
        // --- Mã nguồn chạy thử từ câu hỏi Java Quiz ---
${indented}
    }
}`;
};

export const RunCodeModal: React.FC<RunCodeModalProps> = ({
  isOpen,
  onClose,
  rawCode,
}) => {
  const { language } = useI18n();

  const initialCode = useMemo(() => prepareRunnableJavaCode(rawCode), [rawCode]);
  const [code, setCode] = useState<string>(initialCode);
  const [stdin, setStdin] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [copiedService, setCopiedService] = useState<string | null>(null);
  const [showExternalCompilers, setShowExternalCompilers] = useState<boolean>(false);

  // Reset when opening or rawCode changes
  useEffect(() => {
    if (isOpen) {
      const formatted = prepareRunnableJavaCode(rawCode);
      setCode(formatted);
      setStdin('');
      setExecutionResult(null);
      setIsRunning(false);
      setCopied(false);
      setCopiedService(null);
    }
  }, [isOpen, rawCode]);

  if (!isOpen) return null;

  // Execute Code directly in browser
  const handleExecuteCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const res = await codeExecutionService.executeJava({
        code,
        stdin,
      });
      setExecutionResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(prepareRunnableJavaCode(rawCode));
    setExecutionResult(null);
  };

  const handleCopyCode = async (serviceName?: string) => {
    try {
      await navigator.clipboard.writeText(code);
      if (serviceName) {
        setCopiedService(serviceName);
        setTimeout(() => setCopiedService(null), 3000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const handleLaunchCompiler = async (service: 'onecompiler' | 'jdoodle' | 'programiz') => {
    await handleCopyCode(
      service === 'onecompiler'
        ? 'OneCompiler'
        : service === 'jdoodle'
        ? 'JDoodle'
        : 'Programiz'
    );

    let url = 'https://onecompiler.com/java';
    if (service === 'jdoodle') {
      url = 'https://www.jdoodle.com/online-java-compiler/';
    } else if (service === 'programiz') {
      url = 'https://www.programiz.com/java-programming/online-compiler/';
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="840px"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 800 }}>
              {language === 'en' ? 'Java In-Browser Sandbox Runner' : 'Thực Thi & Chạy Thử Java Trực Tiếp Trên Web'}
            </span>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Subheader Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="var(--brand-primary)" />
            <span>
              {language === 'en'
                ? 'Sandbox JVM (OpenJDK 13+). You can edit variables and test right here.'
                : 'Môi trường JVM Sandbox. Bạn có thể sửa biến, thêm lệnh in và quan sát output.'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleResetCode}
              title="Khôi phục mã ban đầu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>{language === 'en' ? 'Reset' : 'Đặt lại'}</span>
            </button>

            <button
              onClick={() => handleCopyCode()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: copied ? 'var(--state-success)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? (language === 'en' ? 'Copied' : 'Đã sao chép') : (language === 'en' ? 'Copy' : 'Sao chép')}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Viewport */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-code)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>Main.java (Editable)</span>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>OpenJDK 13+</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            style={{
              width: '100%',
              margin: 0,
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-code)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Optional Stdin Accordion */}
        <div>
          <button
            onClick={() => setShowStdin(!showStdin)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            {showStdin ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>
              {language === 'en'
                ? 'Standard Input (stdin - if using Scanner)'
                : 'Dữ liệu đầu vào (stdin - nếu code có dùng Scanner/BufferedReader)'}
            </span>
          </button>

          {showStdin && (
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder={language === 'en' ? 'Enter input values here, separated by space or newline...' : 'Nhập dữ liệu vào đây (ví dụ: 10 20)...'}
              rows={2}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                boxSizing: 'border-box',
              }}
            />
          )}
        </div>

        {/* Primary Action Button: Run on Web */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="md"
            onClick={handleExecuteCode}
            disabled={isRunning}
            icon={isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} fill="currentColor" />}
          >
            {isRunning
              ? language === 'en'
                ? 'Compiling & Running...'
                : 'Đang biên dịch & thực thi trên JVM...'
              : language === 'en'
              ? 'Run Code Directly on Web ⚡'
              : 'Chạy code ngay trên Web ⚡'}
          </Button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {language === 'en'
              ? 'Executes in isolated sandbox container within 0.1-1.0s.'
              : 'Biên dịch & chạy trong sandbox cô lập tốc độ cao (0.1 - 1.0 giây).'}
          </span>
        </div>

        {/* Output Console Window */}
        {(isRunning || executionResult) && (
          <div
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#070b14',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Terminal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} color="#94a3b8" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>
                  {language === 'en' ? 'Console Output' : 'Kết Quả Thực Thi (Console)'}
                </span>

                {executionResult && (
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: executionResult.success
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      color: executionResult.success ? '#34d399' : '#f87171',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {executionResult.success ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )}
                    {executionResult.statusDescription}
                  </span>
                )}
              </div>

              {executionResult && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem', color: '#94a3b8' }}>
                  {executionResult.timeSpent && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {executionResult.timeSpent}
                    </span>
                  )}
                  {executionResult.memoryUsedKb && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <HardDrive size={12} /> {executionResult.memoryUsedKb} KB
                    </span>
                  )}
                  <button
                    onClick={() => setExecutionResult(null)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                    }}
                  >
                    {language === 'en' ? 'Clear' : 'Xóa'}
                  </button>
                </div>
              )}
            </div>

            {/* Terminal Body */}
            <div
              style={{
                padding: '14px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                maxHeight: '220px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {isRunning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                  <Loader2 size={16} className="spin" />
                  <span>
                    {language === 'en'
                      ? 'Running code, please wait a moment...'
                      : 'Đang chạy code, xin đợi trong giây lát'}
                  </span>
                </div>
              )}

              {!isRunning && executionResult && (
                <>
                  {/* Compilation Error */}
                  {executionResult.compileOutput && (
                    <div style={{ color: '#f87171' }}>
                      {executionResult.compileOutput}
                    </div>
                  )}

                  {/* Standard Error (Runtime Exception) */}
                  {executionResult.stderr && (
                    <div style={{ color: '#f87171' }}>
                      {executionResult.stderr}
                    </div>
                  )}

                  {/* Standard Output (Success) */}
                  {executionResult.stdout && (
                    <div style={{ color: '#34d399' }}>
                      {executionResult.stdout}
                    </div>
                  )}

                  {/* Empty output case */}
                  {!executionResult.compileOutput &&
                    !executionResult.stderr &&
                    !executionResult.stdout && (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                        (Chương trình đã chạy thành công nhưng không in nội dung nào ra console)
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Collapsible External Compilers */}
        <div style={{ paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setShowExternalCompilers(!showExternalCompilers)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '6px 0',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>
              {language === 'en'
                ? 'Or open in external Online Java Compilers (OneCompiler, JDoodle, Programiz)'
                : 'Hoặc mở trên các trình biên dịch trực tuyến bên ngoài (OneCompiler, JDoodle, Programiz)'}
            </span>
            {showExternalCompilers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showExternalCompilers && (
            <div style={{ marginTop: '10px' }}>
              {copiedService && (
                <div
                  style={{
                    padding: '8px 12px',
                    marginBottom: '10px',
                    backgroundColor: 'var(--state-success-subtle)',
                    border: '1px solid var(--state-success)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--state-success)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={14} />
                  <span>
                    {language === 'en'
                      ? `Code copied! Switched to ${copiedService}. Press Ctrl+V to paste and run!`
                      : `Đã tự động sao chép mã! Bạn chỉ cần nhấn phím Ctrl+V (Cmd+V) vào ô soạn thảo ${copiedService} rồi bấm Run!`}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                }}
              >
                <button
                  onClick={() => handleLaunchCompiler('onecompiler')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--brand-primary)' }}>
                      OneCompiler ⚡
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Khởi động nhanh, JDK mới
                    </div>
                  </div>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </button>

                <button
                  onClick={() => handleLaunchCompiler('jdoodle')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#10b981' }}>
                      JDoodle ☕
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Tương tác Console stdin/out
                    </div>
                  </div>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </button>

                <button
                  onClick={() => handleLaunchCompiler('programiz')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f59e0b' }}>
                      Programiz 🚀
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Dễ dùng cho sinh viên
                    </div>
                  </div>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
