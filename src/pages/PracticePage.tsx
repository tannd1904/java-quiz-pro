import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Question, TopicConfig } from '../types/question';
import { TOPICS_CONFIG, TOPIC_PRESETS } from '../config/topics.config';
import { useI18n } from '../hooks/useI18n';
import { userProgressService } from '../services/userProgressService';
import { questionReportService, EVENT_REPORTS_UPDATED } from '../services/questionReportService';
import { examTelemetryService } from '../services/examTelemetryService';
import { PracticeProgressItem } from '../types/quiz';
import { TopicSelector } from '../components/topic/TopicSelector';
import { AnswerOption } from '../components/quiz/AnswerOption';
import { FillBlankInput } from '../components/quiz/FillBlankInput';
import { ExplanationDrawer } from '../components/quiz/ExplanationDrawer';
import { CodeBlock } from '../components/common/CodeBlock';
import { Button } from '../components/common/Button';
import { ReportQuestionModal } from '../components/quiz/ReportQuestionModal';
import {
  Search,
  RotateCcw,
  Home,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Filter,
  AlertCircle,
  CheckSquare,
  Edit3,
  Send,
  Bookmark,
  Flag,
} from 'lucide-react';

interface PracticePageProps {
  allQuestions: Question[];
  topicCounts: Record<string, number>;
  onNavigateHome: () => void;
}

type PracticeStatusFilter = 'ALL' | 'UNANSWERED' | 'CORRECT' | 'WRONG' | 'BOOKMARKED';

export const PracticePage: React.FC<PracticePageProps> = ({
  allQuestions,
  topicCounts,
  onNavigateHome,
}) => {
  const { language, t } = useI18n();

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(TOPIC_PRESETS.ALL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PracticeStatusFilter>('ALL');

  // Bookmarked questions state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    return userProgressService.getBookmarks();
  });
  const [reportingQuestion, setReportingQuestion] = useState<Question | null>(null);

  // Track questions reported by this user on this device
  const [userReportedIds, setUserReportedIds] = useState<string[]>(() => {
    return questionReportService.getUserReportedQuestionIds();
  });

  // Session Telemetry Tracking (Silent)
  const sessionStartTimeRef = useRef<number>(Date.now());
  const sessionAnsweredQIds = useRef<Set<string>>(new Set());
  const sessionCorrectQIds = useRef<Set<string>>(new Set());
  const sessionWrongQIds = useRef<Set<string>>(new Set());
  const hasDispatchedTelemetry = useRef<boolean>(false);

  const recordSessionAnswer = (questionId: string, isCorrect: boolean) => {
    sessionAnsweredQIds.current.add(questionId);
    if (isCorrect) {
      sessionCorrectQIds.current.add(questionId);
      sessionWrongQIds.current.delete(questionId);
    } else {
      sessionWrongQIds.current.add(questionId);
      sessionCorrectQIds.current.delete(questionId);
    }
    hasDispatchedTelemetry.current = false;
  };

  const dispatchPracticeSummary = () => {
    if (hasDispatchedTelemetry.current) return;
    if (sessionAnsweredQIds.current.size === 0) return;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    examTelemetryService.sendPracticeSummary({
      answeredCount: sessionAnsweredQIds.current.size,
      correctCount: sessionCorrectQIds.current.size,
      wrongCount: sessionWrongQIds.current.size,
      timeSpentSeconds,
      topicsSummary: selectedTopicIds.join(', '),
      wrongQuestionIds: Array.from(sessionWrongQIds.current),
    });
    hasDispatchedTelemetry.current = true;
  };

  useEffect(() => {
    const handleUnload = () => {
      dispatchPracticeSummary();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      dispatchPracticeSummary();
    };
  }, [selectedTopicIds]);

  const handleBackHome = () => {
    dispatchPracticeSummary();
    onNavigateHome();
  };

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

  // Load persistent practice progress from localStorage
  const [practiceProgress, setPracticeProgress] = useState<Record<string, PracticeProgressItem>>(() => {
    return userProgressService.getPracticeProgress();
  });

  // Extract selected answers from progress
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const saved = userProgressService.getPracticeProgress();
    const ans: Record<string, any> = {};
    Object.keys(saved).forEach((qId) => {
      ans[qId] = saved[qId].userAnswer !== undefined ? saved[qId].userAnswer : saved[qId].selectedOptionIdx;
    });
    return ans;
  });

  // Local draft state for multiple-choice selections in practice mode
  const [multiDrafts, setMultiDrafts] = useState<Record<string, number[]>>(() => {
    const saved = userProgressService.getPracticeProgress();
    const drafts: Record<string, number[]> = {};
    Object.keys(saved).forEach((qId) => {
      if (Array.isArray(saved[qId].userAnswer)) {
        drafts[qId] = saved[qId].userAnswer as number[];
      }
    });
    return drafts;
  });

  // Local draft state for fill-blank inputs
  const [blankDrafts, setBlankDrafts] = useState<Record<string, string>>(() => {
    const saved = userProgressService.getPracticeProgress();
    const drafts: Record<string, string> = {};
    Object.keys(saved).forEach((qId) => {
      if (typeof saved[qId].userAnswer === 'string') {
        drafts[qId] = saved[qId].userAnswer as string;
      }
    });
    return drafts;
  });

  // Track wrong attempt indices per question for visual feedback and allowing retries
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, any[]>>(() => {
    const saved = userProgressService.getPracticeProgress();
    const map: Record<string, any[]> = {};
    Object.keys(saved).forEach((qId) => {
      const item = saved[qId];
      if (item.wrongAttempts && Array.isArray(item.wrongAttempts)) {
        map[qId] = item.wrongAttempts;
      } else if (!item.isCorrect && typeof item.selectedOptionIdx === 'number') {
        map[qId] = [item.selectedOptionIdx];
      }
    });
    return map;
  });

  // Track explicitly revealed solutions / explanations (e.g. if user gives up and requests to see answer)
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Compute completed counts per topic
  const completedTopicCounts = useMemo(() => {
    const topicStats = userProgressService.computeTopicProgress(allQuestions, practiceProgress);
    const counts: Record<string, number> = Object.create(null);
    Object.keys(topicStats).forEach((tid) => {
      counts[tid] = topicStats[tid].completed;
    });
    return counts;
  }, [allQuestions, practiceProgress]);

  // Total completed across all questions in bank
  const totalCompletedBank = Object.keys(practiceProgress).length;
  const overallPercent = Math.round((totalCompletedBank / (allQuestions.length || 1)) * 100);

  // Filter questions by selected topics & search query & status filter
  const filteredQuestions = useMemo(() => {
    if (selectedTopicIds.length === 0) return [];

    const query = searchQuery.trim().toLowerCase();

    return allQuestions.filter((q) => {
      if (!selectedTopicIds.includes(q.topicId)) return false;

      // Status Filter
      const p = practiceProgress[q.id];
      if (statusFilter === 'UNANSWERED') {
        if (p !== undefined) return false;
      } else if (statusFilter === 'CORRECT') {
        if (!p || !p.isCorrect) return false;
      } else if (statusFilter === 'WRONG') {
        if (!p || p.isCorrect) return false;
      } else if (statusFilter === 'BOOKMARKED') {
        if (!bookmarkedIds.includes(q.id)) return false;
      }

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
  }, [allQuestions, selectedTopicIds, searchQuery, statusFilter, practiceProgress, bookmarkedIds]);

  // Count bookmarked questions in selected topics
  const bookmarkedInSelectedCount = useMemo(() => {
    return allQuestions.filter(
      (q) => selectedTopicIds.includes(q.topicId) && bookmarkedIds.includes(q.id)
    ).length;
  }, [allQuestions, selectedTopicIds, bookmarkedIds]);

  // Performance stats for practice session within selected topics
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    allQuestions.forEach((q) => {
      if (!selectedTopicIds.includes(q.topicId)) return;
      const p = practiceProgress[q.id];
      if (p !== undefined) {
        if (p.isCorrect) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    const totalInSelected = allQuestions.filter((q) => selectedTopicIds.includes(q.topicId)).length;
    return { correct, wrong, totalAnswered: correct + wrong, totalInSelected };
  }, [allQuestions, selectedTopicIds, practiceProgress]);

  // Handle selecting an option for SINGLE_CHOICE / TRUE_FALSE
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    const targetQ = allQuestions.find((q) => q.id === questionId);
    if (!targetQ) return;

    // If already correctly answered, no need to change
    if (practiceProgress[questionId]?.isCorrect) return;

    const existingWrongs = wrongAttempts[questionId] || [];
    // If this option was already tried and known to be wrong, do nothing
    if (existingWrongs.includes(optionIdx)) return;

    const isCorrect = optionIdx === targetQ.correctIndex;
    const newWrongs = isCorrect ? existingWrongs : [...existingWrongs, optionIdx];

    recordSessionAnswer(questionId, isCorrect);

    // Save persistent answer
    const record = userProgressService.savePracticeAnswer(
      questionId,
      optionIdx,
      isCorrect,
      newWrongs
    );

    setPracticeProgress((prev) => ({ ...prev, [questionId]: record }));
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setWrongAttempts((prev) => ({ ...prev, [questionId]: newWrongs }));

    if (isCorrect) {
      setRevealedSolutions((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  // Toggle multi-choice checkbox draft
  const handleToggleMultiDraft = (questionId: string, optionIdx: number) => {
    if (practiceProgress[questionId]?.isCorrect) return;
    setMultiDrafts((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionIdx)
        ? current.filter((i) => i !== optionIdx)
        : [...current, optionIdx].sort((a, b) => a - b);
      return { ...prev, [questionId]: updated };
    });
  };

  // Submit and verify multiple-choice question
  const handleCheckMultipleChoice = (questionId: string) => {
    const targetQ = allQuestions.find((q) => q.id === questionId);
    if (!targetQ) return;
    const selected = (multiDrafts[questionId] || []).sort((a, b) => a - b);
    if (selected.length === 0) return;

    const expected = [...(targetQ.correctIndices || [])].sort((a, b) => a - b);
    const isCorrect =
      expected.length === selected.length &&
      expected.every((val, idx) => val === selected[idx]);

    const existingWrongs = wrongAttempts[questionId] || [];
    const newWrongs = isCorrect ? existingWrongs : [...existingWrongs, 999];

    recordSessionAnswer(questionId, isCorrect);

    const record = userProgressService.savePracticeAnswer(
      questionId,
      selected,
      isCorrect,
      newWrongs
    );

    setPracticeProgress((prev) => ({ ...prev, [questionId]: record }));
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
    setWrongAttempts((prev) => ({ ...prev, [questionId]: newWrongs }));

    if (isCorrect) {
      setRevealedSolutions((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  // Check fill-in-the-blank answer
  const handleCheckFillBlank = (questionId: string) => {
    const targetQ = allQuestions.find((q) => q.id === questionId);
    if (!targetQ) return;
    const typed = (blankDrafts[questionId] || '').trim();
    if (!typed) return;

    const accepted = (targetQ.acceptedAnswers || []).map((a) => a.trim().toLowerCase());
    const isCorrect = accepted.includes(typed.toLowerCase());

    const existingWrongs = wrongAttempts[questionId] || [];
    const newWrongs = isCorrect ? existingWrongs : [...existingWrongs, 999];

    recordSessionAnswer(questionId, isCorrect);

    const record = userProgressService.savePracticeAnswer(
      questionId,
      typed,
      isCorrect,
      newWrongs
    );

    setPracticeProgress((prev) => ({ ...prev, [questionId]: record }));
    setAnswers((prev) => ({ ...prev, [questionId]: typed }));
    setWrongAttempts((prev) => ({ ...prev, [questionId]: newWrongs }));

    if (isCorrect) {
      setRevealedSolutions((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  // Reset a single question so user can start fresh
  const handleResetSingleQuestion = (questionId: string) => {
    userProgressService.deletePracticeAnswer(questionId);
    setPracticeProgress((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setWrongAttempts((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setRevealedSolutions((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setMultiDrafts((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setBlankDrafts((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleResetAnswers = () => {
    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to clear all practice history and reset your progress?'
          : 'Bạn có chắc chắn muốn xóa toàn bộ tiến độ luyện tập và các câu đã làm để học lại từ đầu?'
      )
    ) {
      userProgressService.clearPracticeProgress();
      setPracticeProgress({});
      setAnswers({});
      setWrongAttempts({});
      setRevealedSolutions({});
    }
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
            onClick={handleBackHome}
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
          completedCounts={completedTopicCounts}
        />

        {/* Practice Progress Summary Dashboard */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Progress Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--brand-primary)" />
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                {language === 'en' ? 'Learning Progress:' : 'Tiến Độ Luyện Thi:'}{' '}
                <span style={{ color: 'var(--brand-primary)' }}>
                  {totalCompletedBank} / {allQuestions.length}{' '}
                  {language === 'en' ? 'completed' : 'câu đã học'} ({overallPercent}%)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--state-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> {stats.correct} {language === 'en' ? 'correct' : 'đúng'}
              </span>
              <span style={{ color: 'var(--state-error)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={14} /> {stats.wrong} {language === 'en' ? 'wrong' : 'sai'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {stats.totalInSelected - stats.totalAnswered} {language === 'en' ? 'unstudied' : 'chưa học'}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${overallPercent}%`,
                background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Filter Tabs by Question Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              paddingTop: '4px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
              <Filter size={13} /> {language === 'en' ? 'Filter questions:' : 'Lọc danh sách:'}
            </span>

            {[
              { id: 'ALL', labelVi: 'Tất cả', labelEn: 'All', count: stats.totalInSelected },
              { id: 'UNANSWERED', labelVi: '⏳ Chưa học', labelEn: '⏳ Unstudied', count: stats.totalInSelected - stats.totalAnswered },
              { id: 'CORRECT', labelVi: '✅ Đã học đúng', labelEn: '✅ Correct', count: stats.correct },
              { id: 'WRONG', labelVi: '❌ Đã học sai', labelEn: '❌ Incorrect', count: stats.wrong },
              { id: 'BOOKMARKED', labelVi: '⭐ Đã đánh dấu', labelEn: '⭐ Bookmarked', count: bookmarkedInSelectedCount },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as PracticeStatusFilter)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{language === 'en' ? tab.labelEn : tab.labelVi}</span>
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface-subtle)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
              minWidth: 'min(100%, 260px)',
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

          {/* Counts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t('practice.showing')}:{' '}
              <strong style={{ color: 'var(--brand-primary)' }}>{filteredQuestions.length}</strong>{' '}
              {t('practice.questions')}
            </span>
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
            const progress = practiceProgress[q.id];
            const isCompletedCorrect = progress?.isCorrect === true;
            const currentWrongList =
              wrongAttempts[q.id] ||
              (progress && !progress.isCorrect ? [progress.selectedOptionIdx] : []);
            const hasAttempted = progress !== undefined || currentWrongList.length > 0;
            const isSolutionRevealed = isCompletedCorrect || !!revealedSolutions[q.id];
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
                  border: isCompletedCorrect
                    ? '1.5px solid var(--state-success)'
                    : currentWrongList.length > 0
                    ? '1.5px solid var(--state-warning)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(16px, 4vw, 24px)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                {/* Header: Question Number, Completion Status Badge, Reset Button, and Topic Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

                    {/* Question Type Badge */}
                    {q.type === 'MULTIPLE_CHOICE' && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(59, 130, 246, 0.12)',
                          color: 'var(--brand-primary)',
                          border: '1px solid rgba(59, 130, 246, 0.35)',
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
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(168, 85, 247, 0.12)',
                          color: '#a855f7',
                          border: '1px solid rgba(168, 85, 247, 0.35)',
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
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: 'var(--state-success)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                        }}
                      >
                        <HelpCircle size={12} />
                        <span>{language === 'en' ? 'True / False' : 'Đúng / Sai'}</span>
                      </span>
                    )}

                    {/* Completion Status Badge */}
                    {isCompletedCorrect ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--state-success-subtle)',
                          color: 'var(--state-success)',
                          border: '1px solid var(--state-success-border)',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{language === 'en' ? 'Completed (Correct)' : 'Đã học (Chính xác)'}</span>
                      </span>
                    ) : currentWrongList.length > 0 ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--state-warning-subtle)',
                          color: 'var(--state-warning)',
                          border: '1px solid var(--state-warning-border)',
                        }}
                      >
                        <XCircle size={12} />
                        <span>{language === 'en' ? 'Incorrect (Try again)' : 'Chưa đúng (Chọn lại)'}</span>
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--bg-surface-subtle)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        <Clock size={12} />
                        <span>{language === 'en' ? 'Not Answered' : 'Chưa học'}</span>
                      </span>
                    )}

                    {/* Retry / Reset Single Question Button */}
                    {hasAttempted && (
                      <button
                        type="button"
                        onClick={() => handleResetSingleQuestion(q.id)}
                        title={
                          language === 'en'
                            ? 'Reset this question and try again'
                            : 'Làm lại câu hỏi này từ đầu'
                        }
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <RotateCcw size={11} />
                        <span>{language === 'en' ? 'Reset' : 'Làm lại'}</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Bookmark Question Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(q.id)}
                      title={
                        bookmarkedIds.includes(q.id)
                          ? (language === 'en' ? 'Remove bookmark' : 'Bỏ đánh dấu câu hỏi')
                          : (language === 'en' ? 'Bookmark question' : 'Đánh dấu câu hỏi')
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: bookmarkedIds.includes(q.id)
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'var(--bg-surface-subtle)',
                        border: `1px solid ${
                          bookmarkedIds.includes(q.id) ? '#f59e0b' : 'var(--border-default)'
                        }`,
                        color: bookmarkedIds.includes(q.id) ? '#d97706' : 'var(--text-secondary)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <Bookmark
                        size={13}
                        fill={bookmarkedIds.includes(q.id) ? '#f59e0b' : 'none'}
                        color={bookmarkedIds.includes(q.id) ? '#f59e0b' : 'currentColor'}
                      />
                      <span>
                        {bookmarkedIds.includes(q.id)
                          ? (language === 'en' ? 'Bookmarked' : 'Đã đánh dấu')
                          : (language === 'en' ? 'Bookmark' : 'Đánh dấu')}
                      </span>
                    </button>

                    {/* Report Question Button or Marked Reported Badge */}
                    {userReportedIds.includes(q.id) ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
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
                        <span>{language === 'en' ? 'Reported (Under review)' : 'Đã báo lỗi (Đang xem xét)'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReportingQuestion(q)}
                        title={
                          language === 'en'
                            ? 'Report issue with this question'
                            : 'Báo lỗi câu hỏi này cho Quản trị viên'
                        }
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-muted)',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
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

                {/* Interactive Question Body: Options or Fill Blank Input */}
                {q.type === 'FILL_BLANK' ? (
                  <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <FillBlankInput
                          value={blankDrafts[q.id] || (typeof answers[q.id] === 'string' ? answers[q.id] : '')}
                          onChange={(val) => setBlankDrafts((prev) => ({ ...prev, [q.id]: val }))}
                          onSubmit={() => handleCheckFillBlank(q.id)}
                          placeholder={
                            language === 'en' && q.blankPlaceholder?.en
                              ? q.blankPlaceholder.en
                              : (q.blankPlaceholder?.vi || (language === 'en' ? 'Type your answer and press Enter...' : 'Nhập câu trả lời và nhấn Enter...'))
                          }
                          disabled={isCompletedCorrect}
                          isCorrect={isCompletedCorrect}
                          isWrong={!isCompletedCorrect && currentWrongList.length > 0}
                          acceptedAnswers={isSolutionRevealed ? q.acceptedAnswers : undefined}
                        />
                      </div>
                      {!isCompletedCorrect && (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleCheckFillBlank(q.id)}
                          icon={<Send size={15} />}
                        >
                          {language === 'en' ? 'Submit' : 'Kiểm tra'}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : q.type === 'MULTIPLE_CHOICE' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                      ℹ️ {language === 'en' ? 'Select all correct answers, then click Verify:' : 'Chọn tất cả các đáp án đúng rồi bấm Kiểm tra:'}
                    </div>
                    {optionsList.map((optText: string, optIdx: number) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const currentSelected = multiDrafts[q.id] || (Array.isArray(answers[q.id]) ? answers[q.id] : []);
                      const isSelected = currentSelected.includes(optIdx);
                      const isThisOptExpected = isSolutionRevealed && (q.correctIndices || []).includes(optIdx);
                      const isRevealed = isSolutionRevealed;

                      return (
                        <AnswerOption
                          key={optIdx}
                          letter={letter}
                          text={optText}
                          isSelected={isSelected}
                          isCorrect={isThisOptExpected}
                          isWrong={isRevealed && isSelected && !isThisOptExpected}
                          isRevealed={isRevealed}
                          isCheckbox={true}
                          disabled={isCompletedCorrect}
                          onClick={() => handleToggleMultiDraft(q.id, optIdx)}
                        />
                      );
                    })}

                    {!isCompletedCorrect && (
                      <div style={{ marginTop: '6px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCheckMultipleChoice(q.id)}
                          disabled={(multiDrafts[q.id] || []).length === 0}
                          icon={<CheckCircle2 size={15} />}
                        >
                          {language === 'en' ? 'Verify Answer' : 'Kiểm tra đáp án'}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
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
                      const isSelected = answers[q.id] === optIdx;
                      const isThisOptWrong = currentWrongList.includes(optIdx);
                      const isThisOptCorrect = isSolutionRevealed && optIdx === q.correctIndex;
                      const isRevealed = isThisOptWrong || (isSolutionRevealed && isThisOptCorrect);
                      const disabled = isCompletedCorrect || isThisOptWrong;

                      return (
                        <AnswerOption
                          key={optIdx}
                          letter={letter}
                          text={optText}
                          isSelected={isSelected}
                          isCorrect={isThisOptCorrect}
                          isWrong={isThisOptWrong}
                          isRevealed={isRevealed}
                          disabled={disabled}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Motivational Banner on wrong choice: encourages trying again or revealing explanation */}
                {!isCompletedCorrect && currentWrongList.length > 0 && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--state-warning-subtle)',
                      border: '1px solid var(--state-warning-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} color="var(--state-warning)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--state-warning)' }}>
                        {language === 'en'
                          ? 'Incorrect attempt. Select another option to try again and learn!'
                          : 'Phương án chưa chính xác. Bạn hãy suy nghĩ và chọn lại phương án khác để tiếp tục học nhé!'}
                      </span>
                    </div>

                    {!isSolutionRevealed && (
                      <button
                        type="button"
                        onClick={() => setRevealedSolutions((prev) => ({ ...prev, [q.id]: true }))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-primary)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        {language === 'en' ? 'Show answer & explanation' : 'Xem đáp án & giải thích'}
                      </button>
                    )}
                  </div>
                )}

                {/* Instant Explanation Drawer */}
                {isSolutionRevealed && <ExplanationDrawer explanation={explanationText} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Question Modal */}
      <ReportQuestionModal
        isOpen={Boolean(reportingQuestion)}
        question={reportingQuestion}
        onClose={() => setReportingQuestion(null)}
      />
    </div>
  );
};

