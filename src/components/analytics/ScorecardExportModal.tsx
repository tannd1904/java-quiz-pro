import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ExamResult } from '../../types/quiz';
import { useI18n } from '../../hooks/useI18n';
import { examTelemetryService } from '../../services/examTelemetryService';
import { TOPICS_CONFIG } from '../../config/topics.config';
import {
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  User,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ScorecardExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult;
}

export const ScorecardExportModal: React.FC<ScorecardExportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const { language } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [candidateName, setCandidateName] = useState<string>(() => {
    return examTelemetryService.getCandidateName() || 'Học viên Java';
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [canShare, setCanShare] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare) {
      setCanShare(true);
    }
  }, []);

  // Compute top strengths and weaknesses from reviewList
  const topicBreakdown = React.useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    result.reviewList.forEach((item) => {
      const tid = item.question.topicId;
      const cur = map.get(tid) || { total: 0, correct: 0 };
      cur.total += 1;
      if (item.isCorrect) cur.correct += 1;
      map.set(tid, cur);
    });

    const list: { name: string; percentage: number }[] = [];
    map.forEach((stat, tid) => {
      const cfg = TOPICS_CONFIG.find((t) => t.id === tid);
      const name = cfg ? (language === 'en' ? cfg.shortName.en : cfg.shortName.vi) : tid;
      list.push({
        name,
        percentage: Math.round((stat.correct / stat.total) * 100),
      });
    });

    return list.sort((a, b) => b.percentage - a.percentage);
  }, [result.reviewList, language]);

  // Render on Canvas
  const drawScorecard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 675; // Standard 16:9 ratio
    canvas.width = width;
    canvas.height = height;

    // 1. Background with radial dark gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative glow orbs in corners
    const glow1 = ctx.createRadialGradient(150, 120, 10, 150, 120, 380);
    glow1.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
    glow1.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(1050, 520, 10, 1050, 520, 360);
    glow2.addColorStop(0, result.isPassed ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.16)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // Outer Border Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner subtle card container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(46, 46, width - 92, height - 92, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Header: Logo & Title
    // Icon badge
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(80, 80, 50, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☕', 105, 105);

    // Brand name
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '800 24px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('JAVA QUIZ PRO', 145, 102);

    ctx.font = '500 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PROFESSIONAL JAVA ASSESSMENT CERTIFICATE', 145, 122);

    // Right Header Tag: Certificate ID & Date
    const nowStr = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    ctx.textAlign = 'right';
    ctx.font = '600 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`NGÀY THI: ${nowStr.toUpperCase()}`, width - 80, 102);
    ctx.font = '500 12px Inter, monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`SESSION ID: JQP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, width - 80, 122);

    // Horizontal Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 155);
    ctx.lineTo(width - 80, 155);
    ctx.stroke();

    // 3. Candidate & Certificate Body
    ctx.textAlign = 'left';
    ctx.font = '600 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('BẢNG ĐIỂM XÁC THỰC DÀNH CHO THÍ SINH', 80, 195);

    // Candidate Name
    const displayName = candidateName.trim() || 'Học Viên Java';
    ctx.font = '800 38px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayName, 80, 240);

    // Subtitle note
    ctx.font = '400 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Đã hoàn thành bài khảo sát đánh giá năng lực lập trình Java chuyên sâu trên hệ thống Java Quiz Pro.', 80, 270);

    // 4. Hero Score Banner Card (Right-aligned / Center card)
    const cardX = 80;
    const cardY = 305;
    const cardW = width - 160;
    const cardH = 200;

    // Card background with border
    const heroGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    heroGrad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
    heroGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
    ctx.fillStyle = heroGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = result.isPassed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Score Pillar on Left side of hero card
    const scoreBoxW = 280;
    ctx.fillStyle = result.isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    ctx.beginPath();
    ctx.roundRect(cardX + 16, cardY + 16, scoreBoxW, cardH - 32, 12);
    ctx.fill();

    // Big Score 10
    ctx.textAlign = 'center';
    ctx.font = '900 56px Inter, system-ui, sans-serif';
    ctx.fillStyle = result.isPassed ? '#34d399' : '#f87171';
    ctx.fillText(`${result.score10}`, cardX + 16 + scoreBoxW / 2, cardY + 86);

    ctx.font = '700 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`THANG ĐIỂM 10.0`, cardX + 16 + scoreBoxW / 2, cardY + 114);

    // Status Pill
    const pillW = 200;
    const pillH = 32;
    const pillX = cardX + 16 + (scoreBoxW - pillW) / 2;
    const pillY = cardY + 134;

    ctx.fillStyle = result.isPassed ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 8);
    ctx.fill();

    ctx.font = '800 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(result.isPassed ? '✓ ĐẠT YÊU CẦU (PASSED)' : '✕ CHƯA ĐẠT (NEEDS RETEST)', cardX + 16 + scoreBoxW / 2, pillY + 21);

    // Key Performance Metrics Grid on Right side of hero card
    const metricsStartX = cardX + scoreBoxW + 48;
    const metricCols = [
      { label: 'TỶ LỆ ĐÚNG', value: `${result.percentage}%`, color: '#38bdf8' },
      { label: 'SỐ CÂU ĐÚNG', value: `${result.correctCount}/${result.total}`, color: '#34d399' },
      { label: 'SỐ CÂU SAI', value: `${result.wrongCount}`, color: '#f87171' },
      { label: 'THỜI GIAN LÀM', value: `${result.timeSpentFormatted}`, color: '#fbbf24' },
    ];

    const colWidth = (cardW - scoreBoxW - 80) / 4;
    metricCols.forEach((m, idx) => {
      const mx = metricsStartX + idx * colWidth;
      ctx.textAlign = 'left';
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(m.label, mx, cardY + 54);

      ctx.font = '800 28px Inter, system-ui, sans-serif';
      ctx.fillStyle = m.color;
      ctx.fillText(m.value, mx, cardY + 92);
    });

    // Horizontal inner divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(metricsStartX, cardY + 116);
    ctx.lineTo(cardX + cardW - 32, cardY + 116);
    ctx.stroke();

    // Topic Highlights Summary
    ctx.textAlign = 'left';
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('ĐÁNH GIÁ CHUYÊN ĐỀ:', metricsStartX, cardY + 144);

    const topTopics = topicBreakdown.slice(0, 4);
    let topicPillX = metricsStartX;
    const topicPillY = cardY + 156;

    topTopics.forEach((t) => {
      const isHigh = t.percentage >= 70;
      const text = `${t.name}: ${t.percentage}%`;
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const pW = textWidth + 16;

      ctx.fillStyle = isHigh ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)';
      ctx.beginPath();
      ctx.roundRect(topicPillX, topicPillY, pW, 24, 6);
      ctx.fill();

      ctx.strokeStyle = isHigh ? 'rgba(52, 211, 153, 0.35)' : 'rgba(248, 113, 113, 0.35)';
      ctx.stroke();

      ctx.fillStyle = isHigh ? '#34d399' : '#f87171';
      ctx.fillText(text, topicPillX + 8, topicPillY + 16);

      topicPillX += pW + 10;
    });

    // 5. Footer Watermark & URL
    ctx.textAlign = 'left';
    ctx.font = '500 12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Hệ thống thi & luyện trắc nghiệm Java chuyên nghiệp • Powered by Java Quiz Pro Engine', 80, height - 80);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    ctx.fillText('https://java-quiz-pro.vercel.app', width - 80, height - 80);
  }, [candidateName, result, language, topicBreakdown]);

  // Redraw when modal opens or name changes
  useEffect(() => {
    if (isOpen) {
      // Allow slight frame delay for DOM layout
      const timer = setTimeout(() => {
        drawScorecard();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, candidateName, drawScorecard]);

  if (!isOpen) return null;

  // Handle Download Image
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeName = (candidateName.trim() || 'HocVien').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
      link.download = `Bang_Diem_Java_${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // Handle Copy to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else {
          // Fallback download if clipboard image copy not supported
          handleDownloadImage();
        }
      }, 'image/png');
    } catch {
      handleDownloadImage();
    }
  };

  // Handle Mobile Share
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `Bang_Diem_Java_${candidateName.trim() || 'Scorecard'}.png`, {
        type: 'image/png',
      });

      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Bảng điểm Java Quiz Pro',
            text: `Tôi vừa đạt ${result.score10}/10 (${result.percentage}%) trong bài thi Java Quiz Pro!`,
            files: [file],
          });
        }
      } catch {}
    }, 'image/png');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="820px"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--brand-primary)" />
          <span>{language === 'en' ? 'Shareable Scorecard Certificate' : 'Xuất Bảng Điểm Kết Quả Bài Thi'}</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Name input row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <User size={16} color="var(--brand-primary)" />
            <span>{language === 'en' ? 'Candidate Name on Card:' : 'Tên hiển thị trên bảng điểm:'}</span>
          </div>

          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder={language === 'en' ? 'Enter your full name...' : 'Nhập họ và tên của bạn...'}
            maxLength={40}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          />
        </div>

        {/* Live Canvas Preview */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.45)',
            border: '1px solid var(--border-default)',
            backgroundColor: '#0a0f1d',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            paddingTop: '8px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            💡 {language === 'en' ? 'High-resolution PNG scorecard ready to download or submit.' : 'Ảnh độ phân giải cao sẵn sàng lưu về máy hoặc nộp cho giảng viên.'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {canShare && (
              <Button
                variant="outline"
                size="md"
                onClick={handleShare}
                icon={<Share2 size={16} />}
              >
                {language === 'en' ? 'Share' : 'Chia sẻ'}
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleCopyImage}
              icon={copied ? <Check size={16} color="var(--state-success)" /> : <Copy size={16} />}
            >
              {copied
                ? language === 'en'
                  ? 'Copied to Clipboard!'
                  : 'Đã sao chép ảnh!'
                : language === 'en'
                ? 'Copy Image'
                : 'Sao chép ảnh'}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadImage}
              disabled={downloading}
              icon={<Download size={16} />}
            >
              {language === 'en' ? 'Download PNG Image' : 'Tải ảnh về máy (.PNG)'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
