import React, { useState, useEffect, useMemo } from 'react';
import { AppView, ExamSetupConfig, ExamQuestionItem, ExamResult } from './types/quiz';
import { Question } from './types/question';
import { APP_CONFIG } from './config/app.config';
import { questionRepository } from './services/questionRepository';
import { prepareExamSession, calculateExamResult } from './services/quizEngine';
import { I18nProvider, useI18n } from './hooks/useI18n';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ExamPage } from './pages/ExamPage';
import { ResultPage } from './pages/ResultPage';
import { ExamSetupModal } from './components/quiz/ExamSetupModal';
import { Coffee, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './components/common/Button';

const MainApp: React.FC = () => {
  const { t } = useI18n();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<AppView>('HOME');
  const [isPracticeEnabled, setIsPracticeEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('java_quiz_practice_enabled');
      if (saved !== null) return saved === 'true';
    } catch {}
    return APP_CONFIG.ENABLE_PRACTICE_MODE;
  });

  const [isExamSetupModalOpen, setIsExamSetupModalOpen] = useState<boolean>(false);
  const [currentExamItems, setCurrentExamItems] = useState<ExamQuestionItem[]>([]);
  const [currentExamConfig, setCurrentExamConfig] = useState<ExamSetupConfig | null>(null);
  const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(null);

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

  // Toggle admin practice lock
  const handleTogglePracticeLock = () => {
    setIsPracticeEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('java_quiz_practice_enabled', String(next));
      } catch {}
      return next;
    });
  };

  // Start exam flow
  const handleStartExam = (config: ExamSetupConfig) => {
    const items = prepareExamSession(questions, config);
    if (items.length === 0) return;

    setCurrentExamItems(items);
    setCurrentExamConfig(config);
    setIsExamSetupModalOpen(false);
    setView('EXAM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit exam flow
  const handleSubmitExam = (answers: Record<string, number>, remainingSeconds: number) => {
    if (!currentExamConfig) return;

    const result = calculateExamResult(
      currentExamItems,
      answers,
      currentExamConfig.timeMinutes * 60,
      remainingSeconds,
      currentExamConfig.selectedTopicIds
    );

    setCurrentExamResult(result);
    setView('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel exam flow
  const handleCancelExam = () => {
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
    setView('HOME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPractice = () => {
    if (!isPracticeEnabled) return;
    setView('PRACTICE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        isPracticeEnabled={isPracticeEnabled}
        onTogglePracticeLock={handleTogglePracticeLock}
        onNavigateHome={handleNavigateHome}
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
              Đang tải ngân hàng 340+ câu hỏi trắc nghiệm Java...
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
                isPracticeEnabled={isPracticeEnabled}
                totalQuestions={questions.length}
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
                onSubmit={handleSubmitExam}
                onCancel={handleCancelExam}
              />
            )}

            {view === 'RESULT' && currentExamResult && (
              <ResultPage
                result={currentExamResult}
                onRetakeExam={handleRetakeExam}
                onNavigateHome={handleNavigateHome}
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

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <MainApp />
      </I18nProvider>
    </ThemeProvider>
  );
};
