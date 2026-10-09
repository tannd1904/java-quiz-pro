import React, { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import { RunCodeModal } from './RunCodeModal';
import { useI18n } from '../../hooks/useI18n';

interface CodeBlockProps {
  code: string;
  language?: string;
  allowRun?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'java',
  allowRun = true,
}) => {
  const { language: uiLang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const isJava = language.toLowerCase() === 'java';
  const canRun = isJava && allowRun;

  return (
    <>
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-code)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          margin: '12px 0 16px',
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
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>{language}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canRun && (
              <button
                onClick={() => setIsRunModalOpen(true)}
                aria-label="Chạy thử code này trực tuyến"
                title={uiLang === 'en' ? 'Run this code online' : 'Chạy thử mã này trên Online Compiler'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--brand-primary)',
                  backgroundColor: 'var(--brand-primary-subtle)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Play size={12} fill="currentColor" />
                <span>{uiLang === 'en' ? 'Run Code' : 'Chạy thử code'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              aria-label="Copy code"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: copied ? 'var(--state-success)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '0.75rem',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre
          style={{
            margin: 0,
            padding: '14px 18px',
            overflowX: 'auto',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-code)',
          }}
        >
          <code>{code}</code>
        </pre>
      </div>

      {/* Online Java Execution Modal */}
      {canRun && (
        <RunCodeModal
          isOpen={isRunModalOpen}
          onClose={() => setIsRunModalOpen(false)}
          rawCode={code}
        />
      )}
    </>
  );
};

