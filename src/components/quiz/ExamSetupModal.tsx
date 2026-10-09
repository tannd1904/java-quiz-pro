import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TopicSelector } from '../topic/TopicSelector';
import { TOPIC_PRESETS } from '../../config/topics.config';
import { ExamSetupConfig } from '../../types/quiz';
import { useI18n } from '../../hooks/useI18n';
import { ArrowRight, User } from 'lucide-react';
import { examTelemetryService } from '../../services/examTelemetryService';

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (config: ExamSetupConfig) => void;
  topicCounts: Record<string, number>;
  totalQuestions: number;
}

export const ExamSetupModal: React.FC<ExamSetupModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
  topicCounts,
  totalQuestions,
}) => {
  const { t } = useI18n();

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(TOPIC_PRESETS.ALL);
  const [questionCount, setQuestionCount] = useState<number>(40);
  const [timeMinutes, setTimeMinutes] = useState<number>(40);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [candidateName, setCandidateName] = useState<string>(() => examTelemetryService.getCandidateName());

  // Compute total questions matching selected topics
  const matchingPoolCount = useMemo(() => {
    if (selectedTopicIds.length === 0) return 0;
    return selectedTopicIds.reduce((sum, tid) => {
      const c = Number(topicCounts?.[tid]);
      return sum + (Number.isFinite(c) ? c : 0);
    }, 0);
  }, [selectedTopicIds, topicCounts]);

  // Adjust questionCount when pool changes
  useEffect(() => {
    if (matchingPoolCount > 0 && questionCount > matchingPoolCount) {
      setQuestionCount(matchingPoolCount);
    }
  }, [matchingPoolCount]);

  const handleStart = () => {
    const pool = Number(matchingPoolCount) || 0;
    if (pool <= 0) return;
    const finalCount = Math.min(Number(questionCount) || 10, pool);
    examTelemetryService.setCandidateName(candidateName);
    onStartExam({
      selectedTopicIds,
      questionCount: finalCount,
      timeMinutes: Number(timeMinutes) || 40,
      shuffleOptions,
      shuffleQuestions,
    });
  };

  const secondsPerQuestion = useMemo(() => {
    if (questionCount <= 0) return 0;
    return Math.round((timeMinutes * 60) / questionCount);
  }, [timeMinutes, questionCount]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('examSetup.title')}
      maxWidth="760px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('examSetup.backBtn')}
          </Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={matchingPoolCount === 0 || questionCount <= 0}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            {t('examSetup.startBtn')}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: -8 }}>
          {t('examSetup.subtitle')}
        </p>

        {/* 1. Select Topics */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.96rem' }}>
              {t('examSetup.sectionTopics')}
            </span>
            <span
              style={{
                fontSize: '0.82rem',
                color: matchingPoolCount === 0 ? 'var(--state-error)' : 'var(--state-success)',
                fontWeight: 600,
              }}
            >
              {t('examSetup.availableCount')}: {matchingPoolCount} / {totalQuestions}{' '}
              {t('practice.questions')}
            </span>
          </div>
          <TopicSelector
            selectedTopicIds={selectedTopicIds}
            onChange={setSelectedTopicIds}
            questionCounts={topicCounts}
          />
        </div>

        {/* 2. Question Count */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.96rem' }}>
              {t('examSetup.sectionQuestionCount')}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '1.1rem' }}>
              {questionCount} {t('practice.questions')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[10, 20, 30, 40, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setQuestionCount(Math.min(preset, matchingPoolCount))}
                disabled={matchingPoolCount < preset}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor:
                    questionCount === preset ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: questionCount === preset ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${questionCount === preset ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                  cursor: matchingPoolCount < preset ? 'not-allowed' : 'pointer',
                  opacity: matchingPoolCount < preset ? 0.4 : 1,
                }}
              >
                {preset} {t('practice.questions')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setQuestionCount(matchingPoolCount)}
              disabled={matchingPoolCount === 0}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.86rem',
                fontWeight: 600,
                backgroundColor:
                  questionCount === matchingPoolCount
                    ? 'var(--brand-primary)'
                    : 'var(--bg-surface-subtle)',
                color: questionCount === matchingPoolCount ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${questionCount === matchingPoolCount ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                cursor: matchingPoolCount === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {t('examSetup.allCount')} ({matchingPoolCount})
            </button>
          </div>

          <input
            type="range"
            min={1}
            max={Math.max(1, matchingPoolCount)}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            style={{ width: '100%', marginTop: '14px', cursor: 'pointer' }}
          />
        </div>

        {/* 3. Duration */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.96rem' }}>
              {t('examSetup.sectionTime')}
            </span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '1.1rem' }}>
                {timeMinutes} {t('examSetup.minutes')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                (~{secondsPerQuestion} {t('examSetup.secondsPerQuestion')})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[10, 20, 30, 40, 60, 90].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTimeMinutes(preset)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor:
                    timeMinutes === preset ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: timeMinutes === preset ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${timeMinutes === preset ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                  cursor: 'pointer',
                }}
              >
                {preset} {t('examSetup.minutes')}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={120}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Number(e.target.value))}
            style={{ width: '100%', marginTop: '14px', cursor: 'pointer' }}
          />
        </div>

        {/* Optional Candidate Name */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={18} color="var(--brand-primary)" />
            <label
              htmlFor="candidate-name-input"
              style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)' }}
            >
              {t('examSetup.candidateNameLabel')}
            </label>
          </div>
          <input
            id="candidate-name-input"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder={t('examSetup.candidateNamePlaceholder')}
            maxLength={50}
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
            {t('examSetup.candidateNameSubtext')}
          </p>
        </div>

        {/* 4. Shuffling Options */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '4px 8px',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
            />
            <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {t('examSetup.shuffleOptions')}
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
            />
            <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {t('examSetup.shuffleQuestions')}
            </span>
          </label>
        </div>
      </div>
    </Modal>
  );
};
