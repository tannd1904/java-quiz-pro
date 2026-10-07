import React, { useState } from 'react';
import { ExamQuestionItem } from '../types/quiz';
import { TopicConfig } from '../types/question';
import { useI18n } from '../hooks/useI18n';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { TOPICS_CONFIG } from '../config/topics.config';
import { AnswerOption } from '../components/quiz/AnswerOption';
import { QuestionPalette } from '../components/quiz/QuestionPalette';
import { QuizTimer } from '../components/quiz/QuizTimer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CodeBlock } from '../components/common/CodeBlock';
import { ArrowLeft, ArrowRight, Send, AlertTriangle } from 'lucide-react';

interface ExamPageProps {
  examItems: ExamQuestionItem[];
  timeMinutes: number;
  onSubmit: (answers: Record<string, number>, remainingSeconds: number) => void;
  onCancel: () => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  examItems,
  timeMinutes,
  onSubmit,
  onCancel,
}) => {
  const { language, t } = useI18n();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState<boolean>(false);

  const totalSeconds = timeMinutes * 60;

  const timer = useQuizTimer({
    totalSeconds,
    isRunning: !isTimeoutModalOpen,
    onTimeout: () => {
      setIsTimeoutModalOpen(true);
    },
  });

  const currentItem = examItems[currentIndex];
  const questionIds = examItems.map((item) => item.question.id);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examItems.length - answeredCount;

  const handleSelectOption = (shuffledOptIdx: number) => {
    if (!currentItem) return;
    setAnswers((prev) => ({
      ...prev,
      [currentItem.question.id]: shuffledOptIdx,
    }));
  };

  const handleFinalSubmit = () => {
    onSubmit(answers, timer.remainingSeconds);
  };

  const handleConfirmCancel = () => {
    if (window.confirm(t('exam.cancelConfirmMsg'))) {
      onCancel();
    }
  };

  if (!currentItem) return null;

  const q = currentItem.question;
  const topicMeta = TOPICS_CONFIG.find((tc: TopicConfig) => tc.id === q.topicId);
  const questionText =
    language === 'en' && q.question.en ? q.question.en : q.question.vi;

  // Options rendered according to shuffledIndices
  const rawOptions =
    language === 'en' && q.options.en && q.options.en.length > 0 ? q.options.en : q.options.vi;
  const displayedOptions = currentItem.shuffledIndices.map((origIdx: number) => rawOptions[origIdx]);

  const selectedShuffledIndex = answers[q.id];

  return (
    <div style={{ padding: '24px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        {/* Exam Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 24px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t('exam.headerTitle')}
            </h2>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {t('exam.questionNum')}:{' '}
              <strong style={{ color: 'var(--brand-primary)' }}>
                {currentIndex + 1} / {examItems.length}
              </strong>{' '}
              • {t('practice.topics')}: {topicMeta?.shortName[language] || q.topicId}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <QuizTimer
              formattedTime={timer.formattedTime}
              isWarning={timer.isWarning}
              isCritical={timer.isCritical}
              progressPercent={timer.progressPercent}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmCancel}
              style={{ color: 'var(--state-error)', borderColor: 'var(--state-error-border)' }}
            >
              {t('exam.cancelBtn')}
            </Button>
          </div>
        </div>

        {/* Main Grid: Question Content (Left) + Palette Sidebar (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Question Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header: Question Number & Topic */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: 'var(--brand-primary)',
                }}
              >
                {t('exam.questionNum')} {currentIndex + 1} / {examItems.length}
              </span>

              {topicMeta && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{topicMeta.icon}</span>
                  <span>{topicMeta.shortName[language]}</span>
                </span>
              )}
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}
            >
              {questionText}
            </h3>

            {/* Code Snippet if any */}
            {q.codeSnippet && <CodeBlock code={q.codeSnippet} language="java" />}

            {/* Image if any */}
            {q.image && (
              <div style={{ margin: '16px 0', textAlign: 'center' }}>
                <img
                  src={q.image.startsWith('/') ? q.image : `/${q.image}`}
                  alt={`Question ${currentIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '360px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                  }}
                />
              </div>
            )}

            {/* Options list */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              {displayedOptions.map((optText: string, optIdx: number) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = selectedShuffledIndex === optIdx;

                return (
                  <AnswerOption
                    key={optIdx}
                    letter={letter}
                    text={optText}
                    isSelected={isSelected}
                    onClick={() => handleSelectOption(optIdx)}
                  />
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '36px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <Button
                variant="outline"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                icon={<ArrowLeft size={17} />}
              >
                Quay lại
              </Button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentIndex < examItems.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentIndex((prev) => Math.min(examItems.length - 1, prev + 1))}
                    icon={<ArrowRight size={17} />}
                    iconPosition="right"
                  >
                    Câu tiếp
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setIsConfirmModalOpen(true)}
                    icon={<Send size={16} />}
                    iconPosition="right"
                  >
                    {t('exam.submitBtn')}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Palette Sidebar */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                {t('exam.paletteTitle')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {answeredCount}/{examItems.length}
              </span>
            </div>

            <QuestionPalette
              totalQuestions={examItems.length}
              currentIndex={currentIndex}
              answers={answers}
              questionIds={questionIds}
              onSelectQuestion={setCurrentIndex}
            />

            <Button
              variant="primary"
              fullWidth
              onClick={() => setIsConfirmModalOpen(true)}
              icon={<Send size={16} />}
              iconPosition="right"
            >
              {t('exam.submitBtn')}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={t('exam.confirmSubmitTitle')}
        maxWidth="500px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
              {t('exam.continueBtn')}
            </Button>
            <Button variant="primary" onClick={handleFinalSubmit}>
              {t('exam.submitNowBtn')}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.96rem', lineHeight: 1.5 }}>
            {t('exam.confirmSubmitMsg')}{' '}
            <strong style={{ color: 'var(--brand-primary)' }}>
              {answeredCount}/{examItems.length}
            </strong>{' '}
            {t('practice.questions')}.
          </p>

          {unansweredCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--state-warning-subtle)',
                border: '1px solid var(--state-warning-border)',
                color: 'var(--state-warning)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <span>
                {t('exam.unansweredWarning')} (Còn {unansweredCount} câu)
              </span>
            </div>
          )}

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            {t('exam.confirmSubmitPrompt')}
          </p>
        </div>
      </Modal>

      {/* Timeout Auto-Submit Modal */}
      <Modal
        isOpen={isTimeoutModalOpen}
        onClose={handleFinalSubmit}
        closeOnEsc={false}
        closeOnBackdrop={false}
        title={t('exam.timeoutTitle')}
        maxWidth="460px"
        footer={
          <Button variant="primary" fullWidth onClick={handleFinalSubmit}>
            {t('exam.viewResultBtn')}
          </Button>
        }
      >
        <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {t('exam.timeoutMsg')}
        </p>
      </Modal>
    </div>
  );
};
