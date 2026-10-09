import React, { useState, useEffect } from 'react';
import { ExamQuestionItem, ExamSetupConfig } from '../types/quiz';
import { TopicConfig } from '../types/question';
import { useI18n } from '../hooks/useI18n';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { userProgressService } from '../services/userProgressService';
import { questionReportService, EVENT_REPORTS_UPDATED } from '../services/questionReportService';
import { TOPICS_CONFIG } from '../config/topics.config';
import { AnswerOption } from '../components/quiz/AnswerOption';
import { FillBlankInput } from '../components/quiz/FillBlankInput';
import { QuestionPalette } from '../components/quiz/QuestionPalette';
import { QuizTimer } from '../components/quiz/QuizTimer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CodeBlock } from '../components/common/CodeBlock';
import { ReportQuestionModal } from '../components/quiz/ReportQuestionModal';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
  LayoutGrid,
  X,
  CheckSquare,
  Edit3,
  HelpCircle,
  Bookmark,
  Flag,
} from 'lucide-react';

interface ExamPageProps {
  examItems: ExamQuestionItem[];
  timeMinutes: number;
  examConfig?: ExamSetupConfig;
  initialAnswers?: Record<string, any>;
  initialCurrentIndex?: number;
  initialRemainingSeconds?: number;
  onSubmit: (answers: Record<string, any>, remainingSeconds: number) => void;
  onCancel: () => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  examItems,
  timeMinutes,
  examConfig,
  initialAnswers,
  initialCurrentIndex,
  initialRemainingSeconds,
  onSubmit,
  onCancel,
}) => {
  const { language, t } = useI18n();

  const [currentIndex, setCurrentIndex] = useState<number>(initialCurrentIndex || 0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers || {});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  // Bookmarks & reporting state
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    return userProgressService.getBookmarks();
  });
  const [reportingQuestion, setReportingQuestion] = useState<any | null>(null);

  // Track questions reported by this user on this device
  const [userReportedIds, setUserReportedIds] = useState<string[]>(() => {
    return questionReportService.getUserReportedQuestionIds();
  });

  useEffect(() => {
    const handleReportUpdate = () => {
      setUserReportedIds(questionReportService.getUserReportedQuestionIds());
    };
    window.addEventListener(EVENT_REPORTS_UPDATED, handleReportUpdate);
    return () => window.removeEventListener(EVENT_REPORTS_UPDATED, handleReportUpdate);
  }, []);

  const handleToggleBookmark = (questionId: string) => {
    userProgressService.toggleBookmark(questionId);
    setBookmarkedQuestionIds(userProgressService.getBookmarks());
  };

  const totalSeconds = timeMinutes * 60;

  const timer = useQuizTimer({
    totalSeconds,
    initialRemainingSeconds,
    isRunning: !isTimeoutModalOpen,
    onTimeout: () => {
      setIsTimeoutModalOpen(true);
    },
  });

  // Auto-save active exam session to localStorage
  React.useEffect(() => {
    if (!examConfig || examItems.length === 0) return;

    if (timer.remainingSeconds > 0) {
      userProgressService.saveActiveExamSession({
        id: 'active-exam-session',
        items: examItems,
        config: examConfig,
        answers,
        currentIndex,
        remainingSeconds: timer.remainingSeconds,
        startedAt: Date.now(),
        lastSavedAt: Date.now(),
      });
    }
  }, [answers, currentIndex, timer.remainingSeconds, examConfig, examItems]);

  // Save on page exit / unload
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (examConfig && timer.remainingSeconds > 0) {
        userProgressService.saveActiveExamSession({
          id: 'active-exam-session',
          items: examItems,
          config: examConfig,
          answers,
          currentIndex,
          remainingSeconds: timer.remainingSeconds,
          startedAt: Date.now(),
          lastSavedAt: Date.now(),
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, currentIndex, timer.remainingSeconds, examConfig, examItems]);

  const currentItem = examItems[currentIndex];
  const questionIds = examItems.map((item) => item.question.id);
  const answeredCount = examItems.filter((item) => {
    const ans = answers[item.question.id];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'string') return ans.trim().length > 0;
    return typeof ans === 'number';
  }).length;
  const unansweredCount = examItems.length - answeredCount;

  const handleSelectOption = (shuffledOptIdx: number) => {
    if (!currentItem) return;
    setAnswers((prev) => ({
      ...prev,
      [currentItem.question.id]: shuffledOptIdx,
    }));
  };

  const handleToggleMultipleOption = (shuffledOptIdx: number) => {
    if (!currentItem) return;
    const currentList: number[] = Array.isArray(answers[currentItem.question.id])
      ? answers[currentItem.question.id]
      : [];
    const nextList = currentList.includes(shuffledOptIdx)
      ? currentList.filter((idx) => idx !== shuffledOptIdx)
      : [...currentList, shuffledOptIdx].sort((a, b) => a - b);
    setAnswers((prev) => ({
      ...prev,
      [currentItem.question.id]: nextList,
    }));
  };

  const handleChangeBlankAnswer = (val: string) => {
    if (!currentItem) return;
    setAnswers((prev) => ({
      ...prev,
      [currentItem.question.id]: val,
    }));
  };

  const handleFinalSubmit = () => {
    userProgressService.clearActiveExamSession();
    onSubmit(answers, timer.remainingSeconds);
  };

  const handleConfirmCancel = () => {
    if (window.confirm(t('exam.cancelConfirmMsg'))) {
      userProgressService.clearActiveExamSession();
      onCancel();
    }
  };

  const handlePaletteSelect = (index: number) => {
    setCurrentIndex(index);
    setIsPaletteOpen(false); // Close palette drawer on mobile after selection
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
    <div style={{ padding: '16px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        {/* Exam Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 18px',
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Left info */}
          <div style={{ minWidth: '180px' }}>
            <h2
              style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {t('exam.headerTitle')}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('exam.questionNum')}:{' '}
              <strong style={{ color: 'var(--brand-primary)' }}>
                {currentIndex + 1}/{examItems.length}
              </strong>{' '}
              • {topicMeta?.shortName[language] || q.topicId}
            </div>
          </div>

          {/* Right Tools: Timer, Palette Toggle on Mobile, Cancel Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Mobile Palette Toggle Button */}
            <button
              type="button"
              className="mobile-only"
              onClick={() => setIsPaletteOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary-subtle)',
                border: '1px solid var(--brand-primary)',
                color: 'var(--brand-primary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={16} />
              <span>
                {answeredCount}/{examItems.length}
              </span>
            </button>

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
              style={{
                color: 'var(--state-error)',
                borderColor: 'var(--state-error-border)',
                padding: '6px 10px',
                fontSize: '0.8rem',
              }}
            >
              {t('exam.cancelBtn')}
            </Button>
          </div>
        </div>

        {/* Responsive Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Main Question Card (100% width on mobile) */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(18px, 4vw, 32px)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {/* Header: Question Number & Topic */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
                  color: 'var(--brand-primary)',
                }}
              >
                {t('exam.questionNum')} {currentIndex + 1} / {examItems.length}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Desktop Toggle Button for Question Palette */}
                <button
                  type="button"
                  onClick={() => setIsPaletteOpen((prev) => !prev)}
                  title="Mở bảng danh sách câu hỏi"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isPaletteOpen
                      ? 'var(--brand-primary)'
                      : 'var(--bg-surface-subtle)',
                    color: isPaletteOpen ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LayoutGrid size={14} />
                  <span>
                    {isPaletteOpen ? 'Đóng danh sách ✕' : `Danh sách (${answeredCount}/${examItems.length})`}
                  </span>
                </button>

                {/* Question Type Badge */}
                {q.type === 'MULTIPLE_CHOICE' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <CheckSquare size={13} />
                    <span>{language === 'en' ? 'Multiple Choice' : 'Chọn nhiều đáp án'}</span>
                  </span>
                )}
                {q.type === 'FILL_BLANK' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#a855f7',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>{language === 'en' ? 'Fill in the blank' : 'Điền vào chỗ trống'}</span>
                  </span>
                )}
                {q.type === 'TRUE_FALSE' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--state-success)',
                    }}
                  >
                    <HelpCircle size={13} />
                    <span>{language === 'en' ? 'True / False' : 'Đúng / Sai'}</span>
                  </span>
                )}

                {/* Bookmark button */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(q.id)}
                  title={
                    bookmarkedQuestionIds.includes(q.id)
                      ? (language === 'en' ? 'Remove bookmark' : 'Bỏ đánh dấu xem lại')
                      : (language === 'en' ? 'Flag / Bookmark for review' : 'Đánh dấu xem lại sau')
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: bookmarkedQuestionIds.includes(q.id)
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'var(--bg-surface-subtle)',
                    border: `1px solid ${
                      bookmarkedQuestionIds.includes(q.id) ? '#f59e0b' : 'var(--border-default)'
                    }`,
                    color: bookmarkedQuestionIds.includes(q.id) ? '#d97706' : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Bookmark
                    size={12}
                    fill={bookmarkedQuestionIds.includes(q.id) ? '#f59e0b' : 'none'}
                    color={bookmarkedQuestionIds.includes(q.id) ? '#f59e0b' : 'currentColor'}
                  />
                  <span>
                    {bookmarkedQuestionIds.includes(q.id)
                      ? (language === 'en' ? 'Flagged' : 'Đã đánh dấu')
                      : (language === 'en' ? 'Flag' : 'Đánh dấu')}
                  </span>
                </button>

                {/* Report button or Marked Reported Badge */}
                {userReportedIds.includes(q.id) ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#ef4444',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                    }}
                    title={
                      language === 'en'
                        ? 'You reported this question (Under admin review)'
                        : 'Bạn đã báo lỗi câu hỏi này (Đang chờ Quản trị viên xem xét)'
                    }
                  >
                    <Flag size={12} fill="#ef4444" color="#ef4444" />
                    <span>{language === 'en' ? 'Reported' : 'Đã báo lỗi'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReportingQuestion(currentItem)}
                    title={language === 'en' ? 'Report question error' : 'Báo lỗi câu hỏi'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-muted)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Flag size={12} />
                    <span>{language === 'en' ? 'Report' : 'Báo lỗi'}</span>
                  </button>
                )}

                {topicMeta && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>{topicMeta.icon}</span>
                    <span>{topicMeta.shortName[language]}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.15rem)',
                fontWeight: 600,
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                marginBottom: '14px',
              }}
            >
              {questionText}
            </h3>

            {/* Code Snippet if any */}
            {q.codeSnippet && <CodeBlock code={q.codeSnippet} language="java" />}

            {/* Image if any */}
            {q.image && (
              <div style={{ margin: '14px 0', textAlign: 'center' }}>
                <img
                  src={q.image.startsWith('/') ? q.image : `/${q.image}`}
                  alt={`Question ${currentIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '340px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}

            {/* Question Body: Options or Fill Blank Input */}
            {q.type === 'FILL_BLANK' ? (
              <div style={{ marginTop: '20px' }}>
                <FillBlankInput
                  value={typeof answers[q.id] === 'string' ? answers[q.id] : ''}
                  onChange={handleChangeBlankAnswer}
                  placeholder={
                    language === 'en' && q.blankPlaceholder?.en
                      ? q.blankPlaceholder.en
                      : (q.blankPlaceholder?.vi || (language === 'en' ? 'Type your answer here...' : 'Nhập câu trả lời của bạn vào đây...'))
                  }
                />
              </div>
            ) : q.type === 'MULTIPLE_CHOICE' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '16px',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '2px' }}>
                  ℹ️ {language === 'en' ? 'Choose all correct options:' : 'Chọn tất cả các phương án đúng:'}
                </div>
                {displayedOptions.map((optText: string, optIdx: number) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const selectedList: number[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                  const isSelected = selectedList.includes(optIdx);

                  return (
                    <AnswerOption
                      key={optIdx}
                      letter={letter}
                      text={optText}
                      isSelected={isSelected}
                      isCheckbox={true}
                      onClick={() => handleToggleMultipleOption(optIdx)}
                    />
                  );
                })}
              </div>
            ) : (
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
                  const isSelected = answers[q.id] === optIdx;

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
            )}

            {/* Navigation buttons bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '28px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                icon={<ArrowLeft size={16} />}
              >
                Quay lại
              </Button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {currentIndex < examItems.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentIndex((prev) => Math.min(examItems.length - 1, prev + 1))}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Câu tiếp
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsConfirmModalOpen(true)}
                    icon={<Send size={15} />}
                    iconPosition="right"
                  >
                    {t('exam.submitBtn')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION PALETTE MODAL / BOTTOM SHEET (Toggleable on both Mobile and Desktop) */}
      {isPaletteOpen && (
        <>
          <div
            className="palette-backdrop"
            onClick={() => setIsPaletteOpen(false)}
            aria-label="Close question palette"
          />
          <div className="palette-bottom-sheet">
            {/* Header */}
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutGrid size={18} color="var(--brand-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                  {t('exam.paletteTitle')}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--brand-primary-subtle)',
                    color: 'var(--brand-primary)',
                    fontWeight: 700,
                  }}
                >
                  {answeredCount}/{examItems.length} đã làm
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPaletteOpen(false)}
                style={{
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Grid Body */}
            <div
              style={{
                padding: '18px 20px',
                overflowY: 'auto',
                maxHeight: '55vh',
                backgroundColor: 'var(--bg-surface-elevated)',
              }}
            >
              <QuestionPalette
                totalQuestions={examItems.length}
                currentIndex={currentIndex}
                answers={answers}
                questionIds={questionIds}
                bookmarkedQuestionIds={bookmarkedQuestionIds}
                onSelectQuestion={handlePaletteSelect}
              />
            </div>

            {/* Footer with Submit Button */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                gap: '12px',
              }}
            >
              <Button
                variant="ghost"
                onClick={() => setIsPaletteOpen(false)}
                style={{ flex: 1 }}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsPaletteOpen(false);
                  setIsConfirmModalOpen(true);
                }}
                icon={<Send size={15} />}
                iconPosition="right"
                style={{ flex: 2 }}
              >
                {t('exam.submitBtn')}
              </Button>
            </div>
          </div>
        </>
      )}

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

      {/* Report Question Modal */}
      <ReportQuestionModal
        isOpen={Boolean(reportingQuestion)}
        question={reportingQuestion ? reportingQuestion.question : null}
        onClose={() => setReportingQuestion(null)}
      />
    </div>
  );
};
