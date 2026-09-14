import React, { useState } from 'react';
import { createTicket } from '../api/client';

interface RequestFormProps {
  onTicketSubmitted?: (ticketId: string) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onTicketSubmitted }) => {
  const [requesterId, setRequesterId] = useState('E1023');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [department, setDepartment] = useState('');
  const [manager, setManager] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a description of your request.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Derive concise title from category or first sentence of description
    const descLines = description.trim().split('\n');
    const firstLine = descLines[0].trim();
    const title = category && category !== 'Select category'
      ? `${category}: ${firstLine.substring(0, 55)}`
      : firstLine.substring(0, 70);

    try {
      const response = await createTicket({
        title: title || 'Service Request',
        description: description.trim(),
        requesterId: requesterId.trim()
      });

      setFeedback({
        type: 'success',
        message: `Request created: ${response.id.substring(0, 8)}... (${response.status})`
      });

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

  return (
    <article className="panel request-panel">
      <div className="panel-heading">
        <div className="heading-icon">
          <span className="material-symbols-outlined">description</span>
        </div>
        <div>
          <h2>Submit a request</h2>
          <p>Create a new ticket for your team. The request will be routed automatically based on category, urgency and department.</p>
        </div>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">person</span>
            Requester
          </span>
          <select
            value={requesterId}
            onChange={(e) => setRequesterId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="E1023">Alex Johnson</option>
            <option value="E1024">Jamie Lee</option>
            <option value="E1025">Maria Garcia</option>
            <option value="E1026">David Kim</option>
            <option value="E1027">Sarah Lee</option>
          </select>
        </label>

        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">sell</span>
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select category</option>
            <option value="Access & Permissions">Access &amp; Permissions</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Database">Database</option>
            <option value="Security">Security</option>
          </select>
        </label>

        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">warning</span>
            Urgency
          </span>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">business</span>
            Department
          </span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select department</option>
            <option value="Product">Product</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Security">Security</option>
          </select>
        </label>

        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">person</span>
            Manager
          </span>
          <select
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select manager</option>
            <option value="Priya Nair">Priya Nair</option>
            <option value="Daniel Kim">Daniel Kim</option>
            <option value="Riley Patel">Riley Patel</option>
            <option value="Sanjay Rao">Sanjay Rao</option>
          </select>
        </label>

        <label>
          <span className="label-row">
            <span className="material-symbols-outlined">article</span>
            Description
          </span>
          <textarea
            maxLength={2000}
            placeholder="Please provide a detailed description of your request..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <span className="character-count">{description.length}/2000</span>
        </label>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          <span className="material-symbols-outlined">send</span>
          {isSubmitting ? 'Submitting request...' : 'Submit request'}
        </button>

        {feedback && (
          <div className={`form-feedback ${feedback.type}`}>
            <span className="material-symbols-outlined">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{feedback.message}</span>
          </div>
        )}
      </form>
    </article>
  );
};
