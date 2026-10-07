import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { CodeBlock } from '../common/CodeBlock';

interface ExplanationDrawerProps {
  explanation: string;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({ explanation }) => {
  const { t } = useI18n();

  if (!explanation) return null;

  // Check if explanation contains markdown code block ```java ... ``` or similar
  const codeBlockMatch = explanation.match(/```(?:java)?([\s\S]*?)```/);
  let textBefore = explanation;
  let codeSnippet: string | null = null;
  let textAfter: string | null = null;

  if (codeBlockMatch) {
    const fullMatch = codeBlockMatch[0];
    const index = explanation.indexOf(fullMatch);
    textBefore = explanation.substring(0, index).trim();
    codeSnippet = codeBlockMatch[1].trim();
    textAfter = explanation.substring(index + fullMatch.length).trim();
  }

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '16px 20px',
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '0.86rem',
          color: 'var(--brand-primary)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <Lightbulb size={16} />
        <span>{t('quiz.explanationBadge')}</span>
      </div>

      {textBefore && (
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            whiteSpace: 'pre-line',
          }}
        >
          {textBefore}
        </div>
      )}

      {codeSnippet && <CodeBlock code={codeSnippet} language="java" />}

      {textAfter && (
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            whiteSpace: 'pre-line',
            marginTop: '8px',
          }}
        >
          {textAfter}
        </div>
      )}
    </div>
  );
};
