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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedback({ type: 'error', message: 'Please enter both title and description.' });
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
        message: `Request created successfully! ID: ${response.id} (Status: ${response.status})`
      });

      setTitle('');
      setDescription('');

      if (onTicketSubmitted) {
        onTicketSubmitted(response.id);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'An error occurred while submitting the request.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>Submit New Request</h2>
        <p className="card-subtitle">
          Requests are triaged, classified, and prioritized through the automated multi-service pipeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="requesterId">Employee ID</label>
          <div className="select-wrapper">
            <select
              id="requesterId"
              value={requesterId}
              onChange={(e) => setRequesterId(e.target.value)}
              className="form-control"
            >
              <option value="E1023">E1023 — Jane Doe (Engineering)</option>
              <option value="E1024">E1024 — John Smith (Security)</option>
              <option value="E1025">E1025 — Alice Wong (Product)</option>
              <option value="E1026">E1026 — Bob Miller (HR)</option>
              <option value="E1027">E1027 — Charlie Patel (IT Support)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Issue Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="e.g., Cannot connect to corporate VPN"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            className="form-control textarea"
            rows={4}
            placeholder="Describe the issue, symptoms, and urgency signals (e.g., blocking all work immediately)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-wrap">
                <span className="spinner" /> Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
};
