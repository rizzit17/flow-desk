import React, { useEffect, useState, useCallback } from 'react';
import { getTickets, updateTicketStatus, TicketRequest } from '../api/client';

interface RequestListProps {
  refreshTrigger?: number;
}

export const RequestList: React.FC<RequestListProps> = ({ refreshTrigger }) => {
  const [tickets, setTickets] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null);
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, [fetchTickets, refreshTrigger]);

  const handleResolve = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateTicketStatus(id, 'RESOLVED');
      await fetchTickets();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="card list-card">
      <div className="list-controls">
        <div>
          <h2>Operational Queue</h2>
          <p className="card-subtitle">
            Live queue sorted by C++ max-heap computed priority & arrival
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="btn btn-secondary btn-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {tickets.length === 0 && !isLoading && !error && (
        <div className="empty-state">
          <p>No requests found in the system.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b' }}>
            Submit a request using the form on the left to watch it traverse the pipeline.
          </p>
        </div>
      )}

      <div className="tickets-wrapper">
        {tickets.map((ticket) => {
          const priorityClass = ticket.finalPriority ? `priority-${ticket.finalPriority}` : 'priority-4';
          const isFailed = ticket.status === 'PROCESSING_FAILED';

          return (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-top">
                <h3 className="ticket-title">{ticket.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {ticket.finalPriority && (
                    <span className={`priority-badge ${priorityClass}`}>
                      P{ticket.finalPriority}
                    </span>
                  )}
                  <span className={`badge badge-${ticket.status}`}>
                    {ticket.status === 'PROCESSING_FAILED' ? '⚠ PARTIAL / DEGRADED' : ticket.status}
                  </span>
                </div>
              </div>

              <div className="ticket-meta-row">
                <span>Requester: <strong>{ticket.requesterId}</strong></span>
                {ticket.category && (
                  <span>• Category: <strong>{ticket.category}</strong></span>
                )}
                {ticket.urgencyScore !== null && ticket.urgencyScore !== undefined && (
                  <span>• Urgency: <strong>{ticket.urgencyScore}/100</strong></span>
                )}
                {ticket.queuePosition && (
                  <span>• Queue Position: <strong>#{ticket.queuePosition}</strong></span>
                )}
              </div>

              <p className="ticket-desc">{ticket.description}</p>

              {(ticket.requesterDepartment || ticket.requesterManagerEmail) && (
                <div className="ticket-enrichment">
                  <div className="enrich-col">
                    <span className="enrich-label">Department</span>
                    <span className="enrich-val">{ticket.requesterDepartment || 'Pending...'}</span>
                  </div>
                  <div className="enrich-col">
                    <span className="enrich-label">Manager</span>
                    <span className="enrich-val">{ticket.requesterManagerEmail || 'Pending...'}</span>
                  </div>
                  <div className="enrich-col">
                    <span className="enrich-label">Request ID</span>
                    <span className="enrich-val" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {ticket.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              )}

              {isFailed && ticket.errorDetail && (
                <div className="failure-alert">
                  <strong>Pipeline Degradation Notice:</strong> {ticket.errorDetail}
                </div>
              )}

              {ticket.status !== 'RESOLVED' && (
                <div className="ticket-actions">
                  <button
                    onClick={() => handleResolve(ticket.id)}
                    className="btn btn-secondary btn-sm"
                    disabled={updatingId === ticket.id}
                  >
                    {updatingId === ticket.id ? 'Updating...' : 'Mark Resolved'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
