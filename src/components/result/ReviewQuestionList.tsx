import React, { useState, useEffect } from 'react';
import { ExamReviewItem } from '../../types/quiz';
import { useI18n } from '../../hooks/useI18n';
import { userProgressService } from '../../services/userProgressService';
import { questionReportService, EVENT_REPORTS_UPDATED } from '../../services/questionReportService';
import { TOPICS_CONFIG } from '../../config/topics.config';
import { AnswerOption } from '../quiz/AnswerOption';
import { ExplanationDrawer } from '../quiz/ExplanationDrawer';
import { ReportQuestionModal } from '../quiz/ReportQuestionModal';
import { CodeBlock } from '../common/CodeBlock';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckSquare,
  Edit3,
  HelpCircle,
  Bookmark,
  Flag,
} from 'lucide-react';

interface ReviewQuestionListProps {
  reviewList: ExamReviewItem[];
}

export const ReviewQuestionList: React.FC<ReviewQuestionListProps> = ({ reviewList }) => {
  const { language, t } = useI18n();

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
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
    setBookmarkedIds(userProgressService.getBookmarks());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('result.reviewSectionTitle')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          {t('result.reviewSectionDesc')}
        </p>
      </div>

      {reviewList.map((item) => {
        const q = item.question;
        const isAnswered =
          item.userAnswer !== undefined &&
          item.userAnswer !== null &&
          (Array.isArray(item.userAnswer)
            ? item.userAnswer.length > 0
            : typeof item.userAnswer === 'string'
            ? item.userAnswer.trim().length > 0
            : true);
        const topicMeta = TOPICS_CONFIG.find((tc) => tc.id === q.topicId);

        const questionText = language === 'en' && q.question.en ? q.question.en : q.question.vi;
        const explanationText =
          language === 'en' && q.explanation?.en ? q.explanation.en : (q.explanation?.vi || '');
        const optionsList =
          language === 'en' && q.options.en && q.options.en.length > 0 ? q.options.en : q.options.vi;

        return (
          <div
            key={q.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: `1.5px solid ${
                !isAnswered
                  ? 'var(--state-warning-border)'
                  : item.isCorrect
                  ? 'var(--state-success-border)'
                  : 'var(--state-error-border)'
              }`,
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Header: Question Number, Topic Badge, Result Status */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: 'var(--brand-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  #{item.num}
                </span>

                {/* Question Type Badge */}
                {q.type === 'MULTIPLE_CHOICE' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <CheckSquare size={12} />
                    <span>{language === 'en' ? 'Multiple Choice' : 'Chọn nhiều đáp án'}</span>
                  </span>
                )}
                {q.type === 'FILL_BLANK' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#a855f7',
                    }}
                  >
                    <Edit3 size={12} />
                    <span>{language === 'en' ? 'Fill Blank' : 'Điền từ'}</span>
                  </span>
                )}
                {q.type === 'TRUE_FALSE' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--state-success)',
                    }}
                  >
                    <HelpCircle size={12} />
                    <span>{language === 'en' ? 'True / False' : 'Đúng / Sai'}</span>
                  </span>
                )}

                {topicMeta && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>{topicMeta.icon}</span>
                    <span>{language === 'en' ? topicMeta.shortName.en : topicMeta.shortName.vi}</span>
                  </span>
                )}
              </div>

              {/* Status pill & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Bookmark button */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(q.id)}
                  title={
                    bookmarkedIds.includes(q.id)
                      ? (language === 'en' ? 'Remove bookmark' : 'Bỏ đánh dấu')
                      : (language === 'en' ? 'Bookmark for review' : 'Đánh dấu để học lại')
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: bookmarkedIds.includes(q.id)
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'var(--bg-surface-subtle)',
                    border: `1px solid ${
                      bookmarkedIds.includes(q.id) ? '#f59e0b' : 'var(--border-default)'
                    }`,
                    color: bookmarkedIds.includes(q.id) ? '#d97706' : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Bookmark
                    size={12}
                    fill={bookmarkedIds.includes(q.id) ? '#f59e0b' : 'none'}
                    color={bookmarkedIds.includes(q.id) ? '#f59e0b' : 'currentColor'}
                  />
                  <span>
                    {bookmarkedIds.includes(q.id)
                      ? (language === 'en' ? 'Bookmarked' : 'Đã đánh dấu')
                      : (language === 'en' ? 'Bookmark' : 'Đánh dấu')}
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
                    onClick={() => setReportingQuestion(q)}
                    title={language === 'en' ? 'Report issue' : 'Báo lỗi câu hỏi'}
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

                {!isAnswered ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--state-warning)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{t('result.statusSkipped')}</span>
                  </span>
                ) : item.isCorrect ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--state-success)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{t('result.statusCorrect')}</span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--state-error)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                    }}
                  >
                    <XCircle size={16} />
                    <span>{t('result.statusWrong')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                marginBottom: '14px',
              }}
            >
              {questionText}
            </h4>

            {/* Code snippet if any */}
            {q.codeSnippet && <CodeBlock code={q.codeSnippet} language="java" />}

            {/* Image if any */}
            {q.image && (
              <div style={{ margin: '14px 0', textAlign: 'center' }}>
                <img
                  src={q.image.startsWith('/') ? q.image : `/${q.image}`}
                  alt={`Question ${item.num}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '340px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                  }}
                />
              </div>
            )}

            {/* Review Options / Answer display */}
            {q.type === 'FILL_BLANK' ? (
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {language === 'en' ? 'Your Answer:' : 'Câu trả lời của bạn:'}{' '}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      color: !isAnswered
                        ? 'var(--text-muted)'
                        : item.isCorrect
                        ? 'var(--state-success)'
                        : 'var(--state-error)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: !isAnswered
                        ? 'var(--bg-surface-subtle)'
                        : item.isCorrect
                        ? 'var(--state-success-subtle)'
                        : 'var(--state-error-subtle)',
                    }}
                  >
                    {isAnswered ? String(item.userAnswer) : (language === 'en' ? '(No answer)' : '(Chưa điền)')}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {language === 'en' ? 'Accepted Answers:' : 'Đáp án được chấp nhận:'}{' '}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {(item.acceptedAnswers || q.acceptedAnswers || []).map((ans, aIdx) => (
                      <span
                        key={aIdx}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--state-success-subtle)',
                          border: '1px solid var(--state-success-border)',
                          color: 'var(--state-success)',
                        }}
                      >
                        {ans}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : q.type === 'MULTIPLE_CHOICE' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  ℹ️ {language === 'en' ? 'Multiple choice question:' : 'Câu hỏi chọn nhiều đáp án:'}
                </div>
                {optionsList.map((optText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isThisExpected = (item.correctOriginalIndices || q.correctIndices || []).includes(optIdx);
                  const didUserPick = (item.selectedOriginalIndices || []).includes(optIdx);

                  return (
                    <AnswerOption
                      key={optIdx}
                      letter={letter}
                      text={optText}
                      isSelected={didUserPick}
                      isCorrect={isThisExpected}
                      isWrong={didUserPick && !isThisExpected}
                      isRevealed={true}
                      isCheckbox={true}
                      disabled={true}
                      onClick={() => {}}
                    />
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                {optionsList.map((optText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isThisTheCorrectAnswer = optIdx === item.correctOriginalIndex;
                  const didUserChooseThis = item.selectedOriginalIndex === optIdx;

                  return (
                    <AnswerOption
                      key={optIdx}
                      letter={letter}
                      text={optText}
                      isSelected={didUserChooseThis}
                      isCorrect={isThisTheCorrectAnswer}
                      isWrong={didUserChooseThis && !isThisTheCorrectAnswer}
                      isRevealed={true}
                      disabled={true}
                      onClick={() => {}}
                    />
                  );
                })}
              </div>
            )}

            {/* Explanation Drawer */}
            <ExplanationDrawer explanation={explanationText} />
          </div>
        );
      })}

      {/* Report Question Modal */}
      <ReportQuestionModal
        isOpen={Boolean(reportingQuestion)}
        question={reportingQuestion}
        onClose={() => setReportingQuestion(null)}
      />
    </div>
  );
};
