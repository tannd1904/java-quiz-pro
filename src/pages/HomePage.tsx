import React from 'react';
import { Award, BookOpen, CheckCircle, ArrowRight, History } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { Button } from '../components/common/Button';
import { ActiveExamSession } from '../types/quiz';
import { ResumeExamCard } from '../components/exam/ResumeExamCard';

interface HomePageProps {
  onOpenExamSetup: () => void;
  onStartPractice: () => void;
  totalQuestions: number;
  activeExamSession?: ActiveExamSession | null;
  onResumeExam?: () => void;
  onDiscardExam?: () => void;
  onOpenHistory?: () => void;
  examHistoryCount?: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenExamSetup,
  onStartPractice,
  totalQuestions,
  activeExamSession,
  onResumeExam,
  onDiscardExam,
  onOpenHistory,
  examHistoryCount = 0,
}) => {
  const { language, t } = useI18n();

  return (
    <div style={{ padding: 'clamp(20px, 4vw, 48px) 0 64px' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-primary-subtle)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--brand-primary)',
              fontSize: 'clamp(0.76rem, 2.5vw, 0.85rem)',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            {t('home.badge')}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              marginBottom: '14px',
              color: 'var(--text-primary)',
            }}
          >
            Master Java Core & OOP Excellence
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.92rem, 2.8vw, 1.1rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 18px',
              lineHeight: 1.6,
            }}
          >
            Hệ thống luyện thi và đánh giá năng lực trắc nghiệm Java hiện đại với ngân hàng{' '}
            <strong style={{ color: 'var(--brand-primary)' }}>{totalQuestions}+</strong> câu hỏi
            chuyên sâu, bao quát từ Core Java, 4 tính chất OOP, Memory Model đến Collections Framework.
          </p>

          {/* Quick History Button in Hero */}
          {onOpenHistory && (
            <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Button
                variant="outline"
                size="sm"
                icon={<History size={15} />}
                onClick={onOpenHistory}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {language === 'en' ? 'View Exam History' : 'Lịch sử làm bài thi'}
                {examHistoryCount > 0 && (
                  <span
                    style={{
                      marginLeft: '4px',
                      padding: '1px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--brand-primary-subtle)',
                      color: 'var(--brand-primary)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  >
                    {examHistoryCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* In-Progress Exam Banner if available */}
        {activeExamSession && onResumeExam && onDiscardExam && (
          <ResumeExamCard
            session={activeExamSession}
            onResume={onResumeExam}
            onDiscard={onDiscardExam}
          />
        )}

        {/* 2 Primary Action Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(16px, 3vw, 28px)',
          }}
        >
          {/* Exam Mode Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Award size={30} />
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {t('home.examCardTitle')}
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              {t('home.examCardDesc')}
            </p>

            {/* Checklist */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '32px',
                flex: 1,
              }}
            >
              {[
                t('home.examFeature1'),
                t('home.examFeature2'),
                t('home.examFeature3'),
                t('home.examFeature4'),
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={17} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feat}</span>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onOpenExamSetup}
              icon={<ArrowRight size={19} />}
              iconPosition="right"
            >
              {t('home.startExamBtn')}
            </Button>
          </div>

          {/* Practice Mode Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: 'var(--state-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <BookOpen size={30} />
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {t('home.practiceCardTitle')}
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              {t('home.practiceCardDesc')}
            </p>

            {/* Checklist */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '32px',
                flex: 1,
              }}
            >
              {[
                t('home.practiceFeature1'),
                t('home.practiceFeature2'),
                t('home.practiceFeature3'),
                t('home.practiceFeature4'),
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={17} color="var(--state-success)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feat}</span>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onStartPractice}
              icon={<ArrowRight size={19} />}
              iconPosition="right"
            >
              {t('home.startPracticeBtn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
