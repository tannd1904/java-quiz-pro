import React, { useMemo } from 'react';
import { ExamReviewItem } from '../../types/quiz';
import { TOPICS_CONFIG } from '../../config/topics.config';
import { useI18n } from '../../hooks/useI18n';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Award } from 'lucide-react';
import { Button } from '../common/Button';

interface SkillRadarChartProps {
  reviewList: ExamReviewItem[];
  onPracticeTopic?: (topicId: string) => void;
}

interface TopicPerformance {
  topicId: string;
  name: string;
  shortName: string;
  total: number;
  correct: number;
  percentage: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  reviewList,
  onPracticeTopic,
}) => {
  const { language } = useI18n();

  // 1. Group performance by topic
  const topicStats = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();

    reviewList.forEach((item) => {
      const tid = item.question.topicId;
      const cur = map.get(tid) || { total: 0, correct: 0 };
      cur.total += 1;
      if (item.isCorrect) cur.correct += 1;
      map.set(tid, cur);
    });

    const list: TopicPerformance[] = [];
    map.forEach((stat, tid) => {
      const cfg = TOPICS_CONFIG.find((t) => t.id === tid);
      const name = cfg ? (language === 'en' ? cfg.name.en : cfg.name.vi) : tid;
      const shortName = cfg
        ? (language === 'en' ? cfg.shortName.en : cfg.shortName.vi)
        : tid;
      const percentage = Math.round((stat.correct / stat.total) * 100);

      list.push({
        topicId: tid,
        name,
        shortName,
        total: stat.total,
        correct: stat.correct,
        percentage,
      });
    });

    // Sort by percentage descending
    return list.sort((a, b) => b.percentage - a.percentage);
  }, [reviewList, language]);

  // If no items, return null
  if (topicStats.length === 0) return null;

  // 2. Identify strengths, weaknesses, and smart recommendation
  const strengths = topicStats.filter((t) => t.percentage >= 75);
  const weaknesses = topicStats.filter((t) => t.percentage < 65);
  const weakestTopic = topicStats.length > 0 ? topicStats[topicStats.length - 1] : null;

  // 3. Radar Chart geometry for N >= 3 topics
  const hasRadar = topicStats.length >= 3;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 105;
  const numSides = topicStats.length;

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, scale: number) => {
    const angle = (index * 2 * Math.PI) / numSides - Math.PI / 2;
    const x = cx + radius * scale * Math.cos(angle);
    const y = cy + radius * scale * Math.sin(angle);
    return { x, y, angle };
  };

  const ringPolygons = rings.map((scale) => {
    return Array.from({ length: numSides })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, scale);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  const dataPolygon = topicStats
    .map((t, i) => {
      const scale = Math.max(0.05, t.percentage / 100);
      const { x, y } = getCoordinates(i, scale);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {language === 'en' ? 'Skill Radar & Analytics' : 'Radar Năng Lực & Phân Tích Chủ Đề'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              {language === 'en'
                ? 'Visual breakdown of your strengths and topic mastery'
                : 'Đánh giá trực quan mức độ hiểu bài theo từng chủ đề trong bài thi'}
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {topicStats.length} {language === 'en' ? 'topics evaluated' : 'chủ đề đã đánh giá'}
        </div>
      </div>

      {/* Main Content: Chart (Left) + Breakdown List (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasRadar ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Radar SVG Chart (if >= 3 topics) */}
        {hasRadar && (
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              style={{
                width: '100%',
                maxWidth: '320px',
                height: 'auto',
                overflow: 'visible',
              }}
            >
              <defs>
                <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Background Concentric Rings */}
              {ringPolygons.map((points, idx) => (
                <polygon
                  key={idx}
                  points={points}
                  fill="none"
                  stroke="var(--border-default)"
                  strokeWidth="1"
                  strokeDasharray={idx === rings.length - 1 ? 'none' : '2,2'}
                  opacity={0.6 + idx * 0.1}
                />
              ))}

              {/* Axis Spoke Lines */}
              {topicStats.map((_, i) => {
                const { x, y } = getCoordinates(i, 1.0);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="var(--border-default)"
                    strokeWidth="1"
                    opacity={0.5}
                  />
                );
              })}

              {/* Filled Data Polygon */}
              <polygon
                points={dataPolygon}
                fill="url(#radarFillGrad)"
                stroke="var(--brand-primary)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Data Points & Value Pins */}
              {topicStats.map((t, i) => {
                const scale = Math.max(0.05, t.percentage / 100);
                const { x, y } = getCoordinates(i, scale);
                const labelPos = getCoordinates(i, 1.25);

                const isGood = t.percentage >= 75;
                const isBad = t.percentage < 60;
                const pointColor = isGood ? 'var(--state-success)' : isBad ? 'var(--state-error)' : 'var(--brand-primary)';

                return (
                  <g key={i}>
                    {/* Circle Vertex */}
                    <circle cx={x} cy={y} r="4.5" fill={pointColor} stroke="#ffffff" strokeWidth="2" />

                    {/* Outer Label */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="var(--text-primary)"
                    >
                      {t.shortName}
                    </text>
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 11}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={pointColor}
                    >
                      {t.percentage}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Topic Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topicStats.map((item) => {
            const isStrength = item.percentage >= 75;
            const isWeak = item.percentage < 60;
            const barColor = isStrength
              ? 'var(--state-success)'
              : isWeak
              ? 'var(--state-error)'
              : 'var(--brand-primary)';

            return (
              <div
                key={item.topicId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontWeight: 700, color: barColor }}>
                    {item.correct}/{item.total} ({item.percentage}%)
                  </div>
                </div>

                {/* Progress Track */}
                <div
                  style={{
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percentage}%`,
                      backgroundColor: barColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.8s ease-out',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart AI Recommendations Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--brand-primary)" />
          <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {language === 'en' ? 'Smart Learning Recommendations' : 'Đánh Giá Năng Lực & Gợi Ý Ôn Luyện'}
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {/* Strengths */}
          {strengths.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--state-success-subtle)',
                color: 'var(--state-success)',
                fontSize: '0.84rem',
              }}
            >
              <Award size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>{language === 'en' ? 'Strong Points: ' : 'Điểm mạnh xuất sắc: '}</strong>
                {strengths.map((s) => `${s.shortName} (${s.percentage}%)`).join(', ')}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--state-error-subtle)',
                color: 'var(--state-error)',
                fontSize: '0.84rem',
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>{language === 'en' ? 'Needs Revision: ' : 'Cần củng cố thêm: '}</strong>
                {weaknesses.map((w) => `${w.shortName} (${w.percentage}%)`).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Action Suggestion */}
        {weakestTopic && weakestTopic.percentage < 85 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              💡{' '}
              {language === 'en' ? (
                <>
                  Recommended: Practice <strong>{weakestTopic.name}</strong> to improve your overall
                  Java score.
                </>
              ) : (
                <>
                  Gợi ý: Bạn nên luyện tập thêm chuyên đề <strong>{weakestTopic.name}</strong> để củng
                  cố lỗ hổng kiến thức và nâng cao điểm số.
                </>
              )}
            </div>

            {onPracticeTopic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPracticeTopic(weakestTopic.topicId)}
                icon={<ArrowRight size={14} />}
                iconPosition="right"
              >
                {language === 'en' ? 'Practice this topic now' : 'Luyện ngay chủ đề này 🚀'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
