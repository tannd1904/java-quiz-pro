import React, { useState } from 'react';
import { ExamResult } from '../types/quiz';
import { useI18n } from '../hooks/useI18n';
import { ScoreCard } from '../components/result/ScoreCard';
import { MetricsGrid } from '../components/result/MetricsGrid';
import { ReviewQuestionList } from '../components/result/ReviewQuestionList';
import { SkillRadarChart } from '../components/analytics/SkillRadarChart';
import { ScorecardExportModal } from '../components/analytics/ScorecardExportModal';
import { Button } from '../components/common/Button';
import { RotateCcw, Home, History, Award } from 'lucide-react';

interface ResultPageProps {
  result: ExamResult;
  onRetakeExam: () => void;
  onNavigateHome: () => void;
  onOpenHistory?: () => void;
  onPracticeTopic?: (topicId: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onRetakeExam,
  onNavigateHome,
  onOpenHistory,
  onPracticeTopic,
}) => {
  const { language, t } = useI18n();
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container" style={{ maxWidth: '980px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Pass / Fail Score Card */}
        <ScoreCard
          score10={result.score10}
          percentage={result.percentage}
          isPassed={result.isPassed}
        />

        {/* Performance Metrics Grid */}
        <MetricsGrid
          total={result.total}
          correct={result.correctCount}
          wrong={result.wrongCount}
          skipped={result.skippedCount}
          timeSpentFormatted={result.timeSpentFormatted}
        />

        {/* Skill Radar & Topic Analytics */}
        <SkillRadarChart
          reviewList={result.reviewList}
          onPracticeTopic={onPracticeTopic}
        />

        {/* Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onRetakeExam}
            icon={<RotateCcw size={18} />}
          >
            {t('result.retakeBtn')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsScorecardModalOpen(true)}
            icon={<Award size={18} color="var(--brand-primary)" />}
          >
            {language === 'en' ? 'Export Scorecard 📸' : 'Xuất bảng điểm 📸'}
          </Button>

          {onOpenHistory && (
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenHistory}
              icon={<History size={18} />}
            >
              {language === 'en' ? 'Exam History' : 'Xem lịch sử thi'}
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            onClick={onNavigateHome}
            icon={<Home size={18} />}
          >
            {t('result.backHomeBtn')}
          </Button>
        </div>

        {/* Detailed Review Breakdown */}
        <div style={{ marginTop: '16px' }}>
          <ReviewQuestionList reviewList={result.reviewList} />
        </div>
      </div>

      {/* Shareable Scorecard PNG Generator Modal */}
      <ScorecardExportModal
        isOpen={isScorecardModalOpen}
        onClose={() => setIsScorecardModalOpen(false)}
        result={result}
      />
    </div>
  );
};

