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
      setFeedback({ type: 'error', message: 'Title and description are required.' });
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
        message: `Request created: ${response.id.substring(0, 8)}...`
      });

      setTitle('');
      setDescription('');

      if (onTicketSubmitted) {
        onTicketSubmitted(response.id);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to submit request.'
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
    <div className="card-panel">
      <div className="panel-header-row">
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600 }}>
          New Request
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div className="form-field">
          <label className="form-label" htmlFor="employeeSelect">Employee</label>
          <select
            id="employeeSelect"
            className="console-select"
            value={requesterId}
            onChange={(e) => setRequesterId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="E1023">E1023 — Jane Doe (Engineering)</option>
            <option value="E1024">E1024 — John Smith (Security Ops)</option>
            <option value="E1025">E1025 — Alice Wong (Product)</option>
            <option value="E1026">E1026 — Bob Miller (HR Operations)</option>
            <option value="E1027">E1027 — Charlie Patel (IT Support)</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="issueTitle">Title</label>
          <input
            id="issueTitle"
            type="text"
            className="console-input"
            placeholder="e.g. Cannot connect to corporate VPN"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="issueDesc">Description</label>
          <textarea
            id="issueDesc"
            className="console-textarea"
            rows={4}
            placeholder="Provide context or details about the issue..."
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
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>

        {feedback && (
          <div
            style={{
              fontSize: '11px',
              padding: '6px 10px',
              background: 'var(--surface-lowest)',
              border: feedback.type === 'success' ? '1px solid var(--text-primary)' : '1px dashed var(--text-muted)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
};
