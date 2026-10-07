import React from 'react';
import { TOPICS_CONFIG, TOPIC_PRESETS } from '../../config/topics.config';
import { TopicChip } from './TopicChip';
import { useI18n } from '../../hooks/useI18n';

interface TopicSelectorProps {
  selectedTopicIds: string[];
  onChange: (ids: string[]) => void;
  questionCounts?: Record<string, number>;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopicIds,
  onChange,
  questionCounts,
}) => {
  const { t } = useI18n();

  const handleToggle = (id: string) => {
    if (selectedTopicIds.includes(id)) {
      onChange(selectedTopicIds.filter((t) => t !== id));
    } else {
      onChange([...selectedTopicIds, id]);
    }
  };

  const handleSelectPreset = (preset: 'ALL' | 'OOP_6' | 'OOP_4' | 'ADV' | 'NONE') => {
    switch (preset) {
      case 'ALL':
        onChange(TOPIC_PRESETS.ALL);
        break;
      case 'OOP_6':
        onChange(TOPIC_PRESETS.CORE_OOP_6);
        break;
      case 'OOP_4':
        onChange(TOPIC_PRESETS.OOP_4);
        break;
      case 'ADV':
        onChange(TOPIC_PRESETS.ADVANCED_JVM);
        break;
      case 'NONE':
        onChange([]);
        break;
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header and Presets Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
          {t('practice.topicCardTitle')}
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleSelectPreset('ALL')}
            style={presetBtnStyle}
          >
            {t('practice.presetAll')}
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('OOP_6')}
            style={presetBtnStyle}
          >
            {t('practice.presetOop6')}
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('OOP_4')}
            style={presetBtnStyle}
          >
            {t('practice.presetOop4')}
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('ADV')}
            style={presetBtnStyle}
          >
            {t('practice.presetAdv')}
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('NONE')}
            style={{ ...presetBtnStyle, color: 'var(--state-error)', borderColor: 'var(--state-error-border)' }}
          >
            {t('practice.presetNone')}
          </button>
        </div>
      </div>

      {/* Topics Chips Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {TOPICS_CONFIG.map((topic) => (
          <TopicChip
            key={topic.id}
            topic={topic}
            selected={selectedTopicIds.includes(topic.id)}
            onToggle={handleToggle}
            count={
              questionCounts && Number.isFinite(Number(questionCounts[topic.id]))
                ? Number(questionCounts[topic.id])
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

const presetBtnStyle: React.CSSProperties = {
  padding: '5px 10px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.78rem',
  fontWeight: 600,
  backgroundColor: 'var(--bg-surface-subtle)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};
