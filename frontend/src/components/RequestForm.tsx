import React, { useState } from 'react';
import { createTicket } from '../api/client';

interface RequestFormProps {
  onTicketSubmitted?: (ticketId: string) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onTicketSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterId, setRequesterId] = useState('E1023');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedback({ type: 'error', message: 'Issue title and detailed payload are required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await createTicket({
        title: title.trim(),
        description: description.trim(),
        requesterId: requesterId.trim()
      });

      setFeedback({
        type: 'success',
        message: `Ingested to heap: ${response.id.substring(0, 12)}... [${response.status}]`
      });

      setTitle('');
      setDescription('');

      if (onTicketSubmitted) {
        onTicketSubmitted(response.id);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Pipeline dispatch failure'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-panel">
        <div className="panel-header-row">
          <div className="panel-title-wrap">
            <h2>Submit New Request</h2>
          </div>
          <span className="panel-tag">FORM-IN-01</span>
        </div>

        <p className="panel-subtitle">
          Ingest tickets directly to the C++17 memory heap broker with automatic priority weight assignment.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label" htmlFor="employeeSelect">Employee Identifier</label>
              <span className="form-label-meta">REQ-AUTH</span>
            </div>
            <select
              id="employeeSelect"
              className="console-select"
              value={requesterId}
              onChange={(e) => setRequesterId(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="E1023">E1023 — Jane Doe (Engineering)</option>
              <option value="E1024">E1024 — John Smith (Security Ops)</option>
              <option value="E1025">E1025 — Alice Wong (Product Infrastructure)</option>
              <option value="E1026">E1026 — Bob Miller (HR Operations)</option>
              <option value="E1027">E1027 — Charlie Patel (IT Support)</option>
            </select>
          </div>

          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label" htmlFor="issueTitle">Issue Title</label>
              <span className="form-label-meta">STRING[128]</span>
            </div>
            <input
              id="issueTitle"
              type="text"
              className="console-input"
              placeholder="e.g. Memory pressure trigger on node-k8s-us-east-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label" htmlFor="issueDesc">Payload & Trace Logs</label>
              <span className="form-label-meta">UTF-8 RAW</span>
            </div>
            <textarea
              id="issueDesc"
              className="console-textarea"
              rows={4}
              placeholder="Enter stack trace, fault code, or system payload for heuristic parser..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-cta-primary"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Ingesting to Heap...' : 'Submit Request'}</span>
            <span className="btn-key-hint">↵ ⌘ENTER</span>
          </button>

          {feedback && (
            <div
              style={{
                fontSize: '11px',
                padding: '8px 10px',
                background: 'var(--surface-lowest)',
                border: feedback.type === 'success' ? '1px solid var(--text-primary)' : '1px dashed var(--text-muted)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-xs)',
                wordBreak: 'break-all'
              }}
            >
              {feedback.type === 'success' ? '■ ' : '▲ '}
              {feedback.message}
            </div>
          )}
        </form>

        <div className="heap-rule-card">
          <div className="rule-header">
            <span className="rule-title">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>memory</span>
              C++ Heap Priority Rule
            </span>
            <span className="rule-tag">max_heap_t</span>
          </div>
          <p className="rule-desc">
            Priority score is computed dynamically via high-performance native binding using strict weights:
          </p>
          <div className="weights-grid">
            <div className="weight-cell">
              <span className="weight-cell-label">Category</span>
              <span className="weight-cell-val">W = 0.40</span>
            </div>
            <div className="weight-cell">
              <span className="weight-cell-label">Urgency</span>
              <span className="weight-cell-val">W = 0.40</span>
            </div>
            <div className="weight-cell">
              <span className="weight-cell-label">Seniority</span>
              <span className="weight-cell-val">W = 0.20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auto-triage-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="triage-icon-box">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>alt_route</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>Auto-Triage Model</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FastAPI Router: Healthy</span>
          </div>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', background: 'var(--surface-high)', borderRadius: '2px' }}>
          SYNC: OK
        </span>
      </div>
    </div>
  );
};
