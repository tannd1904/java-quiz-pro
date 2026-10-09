import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../../hooks/useI18n';
import { Play, Copy, Check, ExternalLink, Terminal, Code2, Sparkles } from 'lucide-react';

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
    // If it has "public class Foo" where Foo != Main, online compilers usually require "Main"
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
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedService, setCopiedService] = useState<string | null>(null);

  const runnableCode = useMemo(() => prepareRunnableJavaCode(rawCode), [rawCode]);

  if (!isOpen) return null;

  const handleCopyCode = async (serviceName?: string) => {
    try {
      await navigator.clipboard.writeText(runnableCode);
      if (serviceName) {
        setCopiedService(serviceName);
        setTimeout(() => setCopiedService(null), 3000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
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
      maxWidth="720px"
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
              {language === 'en' ? 'Run Java Code Online' : 'Chạy Thử Mã Nguồn Java Trực Tuyến'}
            </span>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Intro Banner */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="var(--brand-primary)" />
            <span>
              {language === 'en'
                ? 'Code has been wrapped into a runnable class Main template.'
                : 'Mã đã được tự động đóng gói sẵn vào class Main để chạy trực tiếp trên JVM.'}
            </span>
          </div>

          <button
            onClick={() => handleCopyCode()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: copied ? 'var(--state-success)' : 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? (language === 'en' ? 'Copied Code!' : 'Đã sao chép mã!') : (language === 'en' ? 'Copy Code' : 'Sao chép mã')}</span>
          </button>
        </div>

        {/* Code Preview Viewport */}
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
            <span>Main.java</span>
            <span>JAVA (JDK 17+)</span>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '14px 18px',
              maxHeight: '260px',
              overflowY: 'auto',
              overflowX: 'auto',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-code)',
            }}
          >
            <code>{runnableCode}</code>
          </pre>
        </div>

        {/* Success toast if opened compiler */}
        {copiedService && (
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--state-success-subtle)',
              border: '1px solid var(--state-success)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--state-success)',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Check size={16} />
            <span>
              {language === 'en'
                ? `Code copied! Switched to ${copiedService}. Press Ctrl+V (Cmd+V) to paste and run!`
                : `Đã tự động sao chép mã! Bạn chỉ cần nhấn phím Ctrl+V (hoặc Cmd+V) vào ô soạn thảo ${copiedService} rồi bấm Run!`}
            </span>
          </div>
        )}

        {/* Online Compiler Launchers Grid */}
        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {language === 'en' ? 'Choose Online Java Compiler:' : 'Chọn trình biên dịch trực tuyến để thực thi:'}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {/* OneCompiler */}
            <button
              onClick={() => handleLaunchCompiler('onecompiler')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--brand-primary)' }}>
                  OneCompiler ⚡
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Khởi động siêu nhanh, JDK mới nhất
                </div>
              </div>
              <ExternalLink size={16} color="var(--text-muted)" />
            </button>

            {/* JDoodle */}
            <button
              onClick={() => handleLaunchCompiler('jdoodle')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#10b981' }}>
                  JDoodle ☕
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Hỗ trợ tương tác Console stdin/out
                </div>
              </div>
              <ExternalLink size={16} color="var(--text-muted)" />
            </button>

            {/* Programiz */}
            <button
              onClick={() => handleLaunchCompiler('programiz')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f59e0b' }}>
                  Programiz 🚀
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Giao diện trực quan cho sinh viên
                </div>
              </div>
              <ExternalLink size={16} color="var(--text-muted)" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
