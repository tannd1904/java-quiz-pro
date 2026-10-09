import React, { useState, useEffect, useMemo } from 'react';
import { AppView, ExamSetupConfig, ExamQuestionItem, ExamResult, ExamHistoryItem, ActiveExamSession } from './types/quiz';
import { Question } from './types/question';
import { questionRepository } from './services/questionRepository';
import { prepareExamSession, calculateExamResult } from './services/quizEngine';
import { userProgressService } from './services/userProgressService';
import { examTelemetryService } from './services/examTelemetryService';
import { I18nProvider, useI18n } from './hooks/useI18n';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ExamPage } from './pages/ExamPage';
import { ResultPage } from './pages/ResultPage';
import { ExamSetupModal } from './components/quiz/ExamSetupModal';
import { ExamHistoryModal } from './components/history/ExamHistoryModal';
import { Coffee, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './components/common/Button';

const MainApp: React.FC = () => {
  const { t } = useI18n();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<AppView>('HOME');
  const [isExamSetupModalOpen, setIsExamSetupModalOpen] = useState<boolean>(false);
  const [currentExamItems, setCurrentExamItems] = useState<ExamQuestionItem[]>([]);
  const [currentExamConfig, setCurrentExamConfig] = useState<ExamSetupConfig | null>(null);
  const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(null);

  // Exam History & In-Progress Exam State
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>(() => {
    return userProgressService.getExamHistory();
  });
  const [activeExamSession, setActiveExamSession] = useState<ActiveExamSession | null>(() => {
    return userProgressService.getActiveExamSession();
  });
  const [isExamHistoryModalOpen, setIsExamHistoryModalOpen] = useState<boolean>(false);
  const [resumedSessionData, setResumedSessionData] = useState<{
    answers: Record<string, number>;
    currentIndex: number;
    remainingSeconds: number;
  } | null>(null);

  // Load question bank on mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionRepository.getQuestions();
      setQuestions(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải ngân hàng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute question count by topic (using Object.create(null) to avoid prototype collision with 'constructor')
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = Object.create(null);
    questions.forEach((q) => {
      counts[q.topicId] = (Number(counts[q.topicId]) || 0) + 1;
    });
    return counts;
  }, [questions]);



  // Start exam flow
  const handleStartExam = (config: ExamSetupConfig) => {
    userProgressService.clearActiveExamSession();
    setActiveExamSession(null);
    setResumedSessionData(null);

    const items = prepareExamSession(questions, config);
    if (items.length === 0) return;

    setCurrentExamItems(items);
    setCurrentExamConfig(config);
    setIsExamSetupModalOpen(false);
    setView('EXAM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resume in-progress exam flow
  const handleResumeExam = () => {
    const active = userProgressService.getActiveExamSession();
    if (!active) {
      setActiveExamSession(null);
      return;
    }

    setCurrentExamItems(active.items);
    setCurrentExamConfig(active.config);
    setResumedSessionData({
      answers: active.answers,
      currentIndex: active.currentIndex,
      remainingSeconds: active.remainingSeconds,
    });
    setView('EXAM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Discard in-progress exam
  const handleDiscardExam = () => {
    userProgressService.clearActiveExamSession();
    setActiveExamSession(null);
    setResumedSessionData(null);
  };

  // Submit exam flow
  const handleSubmitExam = (answers: Record<string, any>, remainingSeconds: number) => {
    if (!currentExamConfig) return;

    const result = calculateExamResult(
      currentExamItems,
      answers,
      currentExamConfig.timeMinutes * 60,
      remainingSeconds,
      currentExamConfig.selectedTopicIds
    );

    // Persist to exam history
    const historyItem: ExamHistoryItem = {
      id: 'exam-' + Date.now(),
      timestamp: Date.now(),
      config: currentExamConfig,
      result,
    };
    userProgressService.saveExamHistory(historyItem);
    setExamHistory(userProgressService.getExamHistory());

    // Silently send exam results and telemetry to Google Sheets in background
    examTelemetryService.sendExamResult(result, currentExamConfig);

    userProgressService.clearActiveExamSession();
    setActiveExamSession(null);
    setResumedSessionData(null);

    setCurrentExamResult(result);
    setView('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel exam flow
  const handleCancelExam = () => {
    userProgressService.clearActiveExamSession();
    setActiveExamSession(null);
    setResumedSessionData(null);
    setCurrentExamItems([]);
    setCurrentExamConfig(null);
    setView('HOME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake exam flow
  const handleRetakeExam = () => {
    setIsExamSetupModalOpen(true);
  };

  const handleNavigateHome = () => {
    setActiveExamSession(userProgressService.getActiveExamSession());
    setView('HOME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPractice = () => {
    setView('PRACTICE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Review past exam from history
  const handleReviewHistoryItem = (item: ExamHistoryItem) => {
    setCurrentExamResult(item.result);
    setCurrentExamConfig(item.config);
    setIsExamHistoryModalOpen(false);
    setView('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    userProgressService.deleteExamHistoryItem(id);
    setExamHistory(userProgressService.getExamHistory());
  };

  const handleClearAllHistory = () => {
    userProgressService.clearExamHistory();
    setExamHistory([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onNavigateHome={handleNavigateHome}
        onOpenExamHistory={() => setIsExamHistoryModalOpen(true)}
        historyCount={examHistory.length}
      />

      <main style={{ flex: 1 }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-primary-subtle)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite',
              }}
            >
              <Coffee size={28} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Đang tải ngân hàng 900+ câu hỏi trắc nghiệm Java...
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: '16px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <AlertCircle size={48} color="var(--state-error)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Không thể tải dữ liệu</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>{error}</p>
            <Button variant="primary" onClick={loadData} icon={<RefreshCw size={16} />}>
              Thử lại
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {view === 'HOME' && (
              <HomePage
                onOpenExamSetup={() => setIsExamSetupModalOpen(true)}
                onStartPractice={handleStartPractice}
                totalQuestions={questions.length}
                activeExamSession={activeExamSession}
                onResumeExam={handleResumeExam}
                onDiscardExam={handleDiscardExam}
                onOpenHistory={() => setIsExamHistoryModalOpen(true)}
                examHistoryCount={examHistory.length}
              />
            )}

            {view === 'PRACTICE' && (
              <PracticePage
                allQuestions={questions}
                topicCounts={topicCounts}
                onNavigateHome={handleNavigateHome}
              />
            )}

            {view === 'EXAM' && currentExamConfig && (
              <ExamPage
                examItems={currentExamItems}
                timeMinutes={currentExamConfig.timeMinutes}
                examConfig={currentExamConfig}
                initialAnswers={resumedSessionData ? resumedSessionData.answers : undefined}
                initialCurrentIndex={resumedSessionData ? resumedSessionData.currentIndex : undefined}
                initialRemainingSeconds={resumedSessionData ? resumedSessionData.remainingSeconds : undefined}
                onSubmit={handleSubmitExam}
                onCancel={handleCancelExam}
              />
            )}

            {view === 'RESULT' && currentExamResult && (
              <ResultPage
                result={currentExamResult}
                onRetakeExam={handleRetakeExam}
                onNavigateHome={handleNavigateHome}
                onOpenHistory={() => setIsExamHistoryModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Exam Setup Modal */}
      <ExamSetupModal
        isOpen={isExamSetupModalOpen}
        onClose={() => setIsExamSetupModalOpen(false)}
        onStartExam={handleStartExam}
        topicCounts={topicCounts}
        totalQuestions={questions.length}
      />

      {/* Exam History Modal */}
      <ExamHistoryModal
        isOpen={isExamHistoryModalOpen}
        onClose={() => setIsExamHistoryModalOpen(false)}
        historyList={examHistory}
        onSelectReview={handleReviewHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <Footer />
    </div>
  );
};

import { Analytics } from '@vercel/analytics/react';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <MainApp />
        <Analytics />
      </I18nProvider>
    </ThemeProvider>
  );
};
