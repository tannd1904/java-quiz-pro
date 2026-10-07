import React, { useState, useMemo } from 'react';
import { Question, TopicConfig } from '../types/question';
import { TOPICS_CONFIG, TOPIC_PRESETS } from '../config/topics.config';
import { useI18n } from '../hooks/useI18n';
import { TopicSelector } from '../components/topic/TopicSelector';
import { AnswerOption } from '../components/quiz/AnswerOption';
import { ExplanationDrawer } from '../components/quiz/ExplanationDrawer';
import { CodeBlock } from '../components/common/CodeBlock';
import { Button } from '../components/common/Button';
import { Search, RotateCcw, Home, HelpCircle } from 'lucide-react';

interface PracticePageProps {
  allQuestions: Question[];
  topicCounts: Record<string, number>;
  onNavigateHome: () => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  allQuestions,
  topicCounts,
  onNavigateHome,
}) => {
  const { language, t } = useI18n();

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(TOPIC_PRESETS.ALL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Filter questions by selected topics & search query
  const filteredQuestions = useMemo(() => {
    if (selectedTopicIds.length === 0) return [];

    const query = searchQuery.trim().toLowerCase();

    return allQuestions.filter((q) => {
      if (!selectedTopicIds.includes(q.topicId)) return false;
      if (!query) return true;

      const qVi = (q.question.vi || '').toLowerCase();
      const qEn = (q.question.en || '').toLowerCase();
      const code = (q.codeSnippet || '').toLowerCase();
      const optsVi = (q.options.vi || []).join(' ').toLowerCase();
      const optsEn = (q.options.en || []).join(' ').toLowerCase();

      return (
        qVi.includes(query) ||
        qEn.includes(query) ||
        code.includes(query) ||
        optsVi.includes(query) ||
        optsEn.includes(query)
      );
    });
  }, [allQuestions, selectedTopicIds, searchQuery]);

  // Performance stats for practice session
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    filteredQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (ans !== undefined) {
        if (ans === q.correctIndex) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    return { correct, wrong, totalAnswered: correct + wrong };
  }, [filteredQuestions, answers]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1060px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation & Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Button
            variant="ghost"
            onClick={onNavigateHome}
            icon={<Home size={18} />}
          >
            {t('practice.backHomeBtn')}
          </Button>

          {stats.totalAnswered > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAnswers}
              icon={<RotateCcw size={15} />}
            >
              {t('practice.resetHistoryBtn')}
            </Button>
          )}
        </div>

        {/* Topic Selector */}
        <TopicSelector
          selectedTopicIds={selectedTopicIds}
          onChange={setSelectedTopicIds}
          questionCounts={topicCounts}
        />

        {/* Filter & Search Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              flex: 1,
              minWidth: '260px',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('practice.searchPlaceholder')}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.92rem',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Counts & Performance Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t('practice.showing')}:{' '}
              <strong style={{ color: 'var(--brand-primary)' }}>{filteredQuestions.length}</strong>{' '}
              {t('practice.questions')} ({selectedTopicIds.length} {t('practice.topics')})
            </span>

            {stats.totalAnswered > 0 && (
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--state-success)', fontWeight: 600 }}>
                  {t('practice.correctCount')}: {stats.correct}
                </span>
                <span style={{ color: 'var(--state-error)', fontWeight: 600 }}>
                  {t('practice.wrongCount')}: {stats.wrong}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Empty States */}
        {selectedTopicIds.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-default)',
            }}
          >
            <HelpCircle size={44} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
              {t('practice.noTopicSelectedTitle')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
              {t('practice.noTopicSelectedDesc')}
            </p>
          </div>
        )}

        {selectedTopicIds.length > 0 && filteredQuestions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-default)',
            }}
          >
            <Search size={44} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
              {t('practice.noMatchTitle')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
              {t('practice.noMatchDesc')}
            </p>
          </div>
        )}

        {/* Question List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {filteredQuestions.map((q, idx) => {
            const userSelected = answers[q.id];
            const isAnswered = userSelected !== undefined;
            const topicMeta = TOPICS_CONFIG.find((tc: TopicConfig) => tc.id === q.topicId);

            const questionText =
              language === 'en' && q.question.en ? q.question.en : q.question.vi;
            const explanationText =
              language === 'en' && q.explanation?.en
                ? q.explanation.en
                : (q.explanation?.vi || '');
            const optionsList =
              language === 'en' && q.options.en && q.options.en.length > 0
                ? q.options.en
                : q.options.vi;

            return (
              <div
                key={q.id}
                id={`practice-q-${q.id}`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                {/* Header: Question Number and Topic Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    #{idx + 1}
                  </span>

                  {topicMeta && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-default)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>{topicMeta.icon}</span>
                      <span>
                        {language === 'en' ? topicMeta.shortName.en : topicMeta.shortName.vi}
                      </span>
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}
                >
                  {questionText}
                </h3>

                {/* Code block if any */}
                {q.codeSnippet && <CodeBlock code={q.codeSnippet} language="java" />}

                {/* Image if any */}
                {q.image && (
                  <div style={{ margin: '14px 0', textAlign: 'center' }}>
                    <img
                      src={q.image.startsWith('/') ? q.image : `/${q.image}`}
                      alt={`Question ${idx + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '340px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                      }}
                    />
                  </div>
                )}

                {/* Options List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '16px',
                  }}
                >
                  {optionsList.map((optText: string, optIdx: number) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isSelected = userSelected === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    const isWrong = isSelected && !isCorrect;

                    return (
                      <AnswerOption
                        key={optIdx}
                        letter={letter}
                        text={optText}
                        isSelected={isSelected}
                        isCorrect={isCorrect}
                        isWrong={isWrong}
                        isRevealed={isAnswered}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                      />
                    );
                  })}
                </div>

                {/* Instant Explanation Drawer */}
                {isAnswered && <ExplanationDrawer explanation={explanationText} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
