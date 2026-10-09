import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../../types/question';
import { QuestionReport } from '../../types/report';
import { questionReportService, EVENT_REPORTS_UPDATED } from '../../services/questionReportService';
import { useI18n } from '../../hooks/useI18n';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CodeBlock } from '../common/CodeBlock';
import {
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface ReportedQuestionsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  allQuestions: Question[];
}

type FilterTab = 'ALL' | 'PENDING' | 'RESOLVED';

export const ReportedQuestionsAdminModal: React.FC<ReportedQuestionsAdminModalProps> = ({
  isOpen,
  onClose,
  allQuestions,
}) => {
  const { language } = useI18n();

  const [reports, setReports] = useState<QuestionReport[]>(() => {
    return questionReportService.getReports();
  });
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const refreshReports = () => {
    setReports(questionReportService.getReports());
  };

  useEffect(() => {
    if (isOpen) {
      refreshReports();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      refreshReports();
    };
    window.addEventListener(EVENT_REPORTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_REPORTS_UPDATED, handleUpdate);
  }, []);

  const pendingCount = useMemo(() => {
    return reports.filter((r) => r.status === 'PENDING').length;
  }, [reports]);

  const resolvedCount = useMemo(() => {
    return reports.filter((r) => r.status === 'RESOLVED').length;
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (filterTab === 'PENDING') {
      return reports.filter((r) => r.status === 'PENDING');
    }
    if (filterTab === 'RESOLVED') {
      return reports.filter((r) => r.status === 'RESOLVED');
    }
    return reports;
  }, [reports, filterTab]);

  const handleToggleResolve = (report: QuestionReport) => {
    if (report.status === 'PENDING') {
      questionReportService.resolveReport(report.id);
    } else {
      questionReportService.unresolveReport(report.id);
    }
    refreshReports();
  };

  const handleDelete = (reportId: string) => {
    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to delete this report?'
          : 'Bạn có chắc chắn muốn xóa báo cáo này?'
      )
    ) {
      questionReportService.deleteReport(reportId);
      refreshReports();
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to delete all reports?'
          : 'Bạn có chắc chắn muốn xóa toàn bộ danh sách báo cáo?'
      )
    ) {
      questionReportService.clearAllReports();
      refreshReports();
    }
  };

  const handleExportJson = () => {
    const jsonStr = questionReportService.exportReportsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question_reports_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <AlertTriangle size={20} color="var(--brand-primary)" />
          <span>
            {language === 'en'
              ? 'Reported Questions Management'
              : 'Quản lý Báo cáo Câu hỏi bị sai'}
          </span>
          {pendingCount > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontWeight: 700,
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {pendingCount} {language === 'en' ? 'pending' : 'chờ xử lý'}
            </span>
          )}
        </div>
      }
      maxWidth="720px"
    >
      <div>
        {/* Header toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor:
                  filterTab === 'ALL' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: filterTab === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'All' : 'Tất cả'} ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('PENDING')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor:
                  filterTab === 'PENDING' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: filterTab === 'PENDING' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Pending' : 'Chưa xử lý'} ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('RESOLVED')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor:
                  filterTab === 'RESOLVED' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: filterTab === 'RESOLVED' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Resolved' : 'Đã xử lý'} ({resolvedCount})
            </button>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {reports.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportJson}
                  title={language === 'en' ? 'Export as JSON' : 'Xuất dữ liệu JSON'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} />
                  <span>{language === 'en' ? 'Export' : 'Xuất file'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  title={language === 'en' ? 'Clear all reports' : 'Xóa toàn bộ'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                  <span>{language === 'en' ? 'Clear All' : 'Xóa tất cả'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* List of reports */}
        {filteredReports.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '36px 16px',
              color: 'var(--text-muted)',
            }}
          >
            <CheckCircle2
              size={40}
              style={{ margin: '0 auto 12px', opacity: 0.5, color: 'var(--state-success)' }}
            />
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {language === 'en'
                ? 'No reports found in this view.'
                : 'Hiện không có câu hỏi nào bị báo cáo trong mục này.'}
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
              {language === 'en'
                ? 'When users report questions, they will appear here.'
                : 'Khi người dùng phát hiện lỗi và gửi báo cáo, thông tin sẽ được hiển thị tại đây.'}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '480px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredReports.map((report) => {
              const matchedQuestion = allQuestions.find((q) => q.id === report.questionId);
              const isExpanded = expandedQuestionId === report.id;
              const isResolved = report.status === 'RESOLVED';

              return (
                <div
                  key={report.id}
                  style={{
                    backgroundColor: isResolved
                      ? 'var(--bg-surface-subtle)'
                      : 'var(--bg-surface)',
                    border: `1px solid ${
                      isResolved ? 'var(--border-subtle)' : 'var(--border-default)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    opacity: isResolved ? 0.75 : 1,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {/* Top Bar: Question ID, Reason, Timestamp, Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          backgroundColor: 'var(--brand-primary-subtle)',
                          color: 'var(--brand-primary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        #{report.questionId}
                      </span>

                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            report.reason === 'WRONG_ANSWER'
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(245, 158, 11, 0.12)',
                          color:
                            report.reason === 'WRONG_ANSWER'
                              ? '#ef4444'
                              : 'var(--state-warning)',
                          border: `1px solid ${
                            report.reason === 'WRONG_ANSWER'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(245, 158, 11, 0.3)'
                          }`,
                        }}
                      >
                        {questionReportService.getReasonLabel(
                          report.reason,
                          language as 'vi' | 'en'
                        )}
                      </span>

                      {isResolved ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--state-success-subtle)',
                            color: 'var(--state-success)',
                          }}
                        >
                          ✓ {language === 'en' ? 'Resolved' : 'Đã xử lý'}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                            color: '#ef4444',
                          }}
                        >
                          ● {language === 'en' ? 'Pending' : 'Chờ sửa'}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} />
                      <span>{new Date(report.reportedAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Question Title Snippet */}
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: report.comment ? '6px' : '10px',
                      lineHeight: 1.4,
                    }}
                  >
                    {report.questionTitle}
                  </div>

                  {/* User Comment / Note if provided */}
                  {report.comment && (
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--brand-primary)',
                        marginBottom: '10px',
                        lineHeight: 1.45,
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {language === 'en' ? 'User note: ' : 'Ghi chú của người học: '}
                      </strong>
                      {report.comment}
                    </div>
                  )}

                  {/* Expanded full question view */}
                  {isExpanded && matchedQuestion && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-default)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                        {language === 'en' ? 'Question Full Text:' : 'Toàn văn câu hỏi:'}
                      </div>
                      <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                        {language === 'en' && matchedQuestion.question.en
                          ? matchedQuestion.question.en
                          : matchedQuestion.question.vi}
                      </div>

                      {matchedQuestion.codeSnippet && (
                        <div style={{ marginBottom: '8px' }}>
                          <CodeBlock code={matchedQuestion.codeSnippet} language="java" />
                        </div>
                      )}

                      {matchedQuestion.type === 'FILL_BLANK' ? (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>{language === 'en' ? 'Accepted answers: ' : 'Đáp án chấp nhận: '}</strong>
                          <span style={{ color: 'var(--state-success)', fontWeight: 700 }}>
                            {(matchedQuestion.acceptedAnswers || []).join(' | ')}
                          </span>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>{language === 'en' ? 'Options & Correct answer: ' : 'Các lựa chọn: '}</strong>
                          <ul style={{ paddingLeft: '18px', margin: '4px 0' }}>
                            {(matchedQuestion.options.vi || []).map((opt, oIdx) => {
                              const isCorrect =
                                matchedQuestion.type === 'MULTIPLE_CHOICE'
                                  ? (matchedQuestion.correctIndices || []).includes(oIdx)
                                  : matchedQuestion.correctIndex === oIdx;
                              return (
                                <li
                                  key={oIdx}
                                  style={{
                                    color: isCorrect ? 'var(--state-success)' : 'var(--text-secondary)',
                                    fontWeight: isCorrect ? 700 : 400,
                                  }}
                                >
                                  {String.fromCharCode(65 + oIdx)}. {opt} {isCorrect && '✓ [Đáp án đúng]'}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {matchedQuestion.explanation && (
                        <div>
                          <strong>{language === 'en' ? 'Explanation: ' : 'Giải thích: '}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {matchedQuestion.explanation.vi}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedQuestionId(isExpanded ? null : report.id)
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          <span>{language === 'en' ? 'Hide details' : 'Ẩn chi tiết'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>{language === 'en' ? 'View question details' : 'Xem chi tiết câu hỏi'}</span>
                        </>
                      )}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleResolve(report)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isResolved
                            ? 'var(--bg-surface-subtle)'
                            : 'var(--state-success-subtle)',
                          color: isResolved
                            ? 'var(--text-secondary)'
                            : 'var(--state-success)',
                          border: `1px solid ${
                            isResolved
                              ? 'var(--border-default)'
                              : 'var(--state-success-border)'
                          }`,
                          cursor: 'pointer',
                        }}
                      >
                        {isResolved ? (
                          <>
                            <RotateCcw size={12} />
                            <span>{language === 'en' ? 'Reopen' : 'Mở lại'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} />
                            <span>{language === 'en' ? 'Mark Resolved' : 'Đã sửa xong'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(report.id)}
                        title={language === 'en' ? 'Delete report' : 'Xóa báo cáo'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'transparent',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
