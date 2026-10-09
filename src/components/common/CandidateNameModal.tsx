import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';
import { examTelemetryService } from '../../services/examTelemetryService';
import { useI18n } from '../../hooks/useI18n';

interface CandidateNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
  isMandatory?: boolean;
  title?: string;
  subtitle?: string;
}

export const CandidateNameModal: React.FC<CandidateNameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isMandatory = false,
  title,
  subtitle,
}) => {
  const { language } = useI18n();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName(examTelemetryService.getCandidateName());
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(
        language === 'en'
          ? 'Please enter your name or nickname to proceed.'
          : 'Vui lòng nhập họ và tên hoặc biệt danh để tiếp tục.'
      );
      return;
    }

    if (trimmed.length < 2) {
      setError(
        language === 'en'
          ? 'Name must be at least 2 characters.'
          : 'Họ tên cần có ít nhất 2 ký tự.'
      );
      return;
    }

    examTelemetryService.setCandidateName(trimmed);
    onSuccess(trimmed);
  };

  const defaultTitle =
    title ||
    (language === 'en' ? 'Candidate Information' : 'Thông Tin Thí Sinh');
  const defaultSubtitle =
    subtitle ||
    (language === 'en'
      ? 'Please enter your name to personalize your results and track progress.'
      : 'Vui lòng nhập họ và tên của bạn để bắt đầu học tập và theo dõi kết quả.');

  return (
    <Modal
      isOpen={isOpen}
      onClose={isMandatory ? () => {} : onClose}
      closeOnEsc={!isMandatory}
      closeOnBackdrop={!isMandatory}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="var(--brand-primary)" />
          <span>{defaultTitle}</span>
        </div>
      }
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {defaultSubtitle}
        </p>

        <div>
          <label
            htmlFor="candidate-name-modal-input"
            style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
          >
            {language === 'en' ? 'Full Name / Nickname' : 'Họ và tên / Biệt danh'}{' '}
            <span style={{ color: 'var(--state-error)' }}>*</span>
          </label>
          <input
            id="candidate-name-modal-input"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder={
              language === 'en' ? 'e.g. Alex Johnson' : 'Ví dụ: Nguyễn Văn An'
            }
            maxLength={60}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${error ? 'var(--state-error)' : 'var(--border-default)'}`,
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--state-error)',
                fontSize: '0.82rem',
                marginTop: '6px',
              }}
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          {!isMandatory && (
            <Button variant="ghost" onClick={onClose} type="button">
              {language === 'en' ? 'Cancel' : 'Hủy'}
            </Button>
          )}
          <Button variant="primary" type="submit" icon={<CheckCircle2 size={16} />}>
            {language === 'en' ? 'Confirm & Continue' : 'Xác nhận & Tiếp tục'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
