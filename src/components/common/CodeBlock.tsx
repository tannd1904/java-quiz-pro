import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'java' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
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
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: copied ? 'var(--state-success)' : 'var(--text-muted)',
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
  );
};
