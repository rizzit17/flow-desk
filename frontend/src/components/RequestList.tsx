import React, { useEffect, useState, useCallback } from 'react';
import { getTickets, updateTicketStatus, createTicket, TicketRequest } from '../api/client';

interface RequestListProps {
  refreshTrigger?: number;
  onTicketCreated?: () => void;
}

export const RequestList: React.FC<RequestListProps> = ({ refreshTrigger, onTicketCreated }) => {
  const [tickets, setTickets] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'degraded' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

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
    const interval = setInterval(fetchTickets, 4000);
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

  const handleCreateTestRequest = async () => {
    setIsSimulating(true);
    try {
      await createTicket({
        title: 'VPN connection issue',
        description: 'Unable to connect to internal network resources',
        requesterId: 'E1023'
      });
      await fetchTickets();
      if (onTicketCreated) onTicketCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create test request');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateSpike = async () => {
    setIsSimulating(true);
    try {
      await createTicket({
        title: 'Primary database outage',
        description: 'Database cluster is unreachable and blocking user transactions',
        requesterId: 'E1024'
      });
      await fetchTickets();
      if (onTicketCreated) onTicketCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to simulate spike');
    } finally {
      setIsSimulating(false);
    }
  };

  const pendingCount = tickets.filter((t) => t.status === 'PENDING').length;
  const degradedCount = tickets.filter((t) => t.status === 'PROCESSING_FAILED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;
  const allCount = tickets.length;

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'pending' && t.status !== 'PENDING') return false;
    if (filter === 'degraded' && t.status !== 'PROCESSING_FAILED') return false;
    if (filter === 'resolved' && t.status !== 'RESOLVED') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchReq = t.requesterId.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchDept = t.requesterDepartment?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      return Boolean(matchId || matchReq || matchTitle || matchDesc || matchDept || matchCat);
    }
    return true;
  });

  const getCategoryIcon = (category?: string | null, title?: string) => {
    const cat = (category || '').toUpperCase();
    const t = (title || '').toLowerCase();
    if (cat.includes('DATABASE') || t.includes('database') || t.includes('db')) return 'database';
    if (cat.includes('NETWORK') || t.includes('vpn') || t.includes('connection')) return 'lan';
    if (cat.includes('BILLING') || t.includes('payment') || t.includes('gateway')) return 'credit_card';
    if (cat.includes('HARDWARE') || t.includes('monitor') || t.includes('laptop')) return 'desktop_windows';
    if (cat.includes('SECURITY') || t.includes('access') || t.includes('auth')) return 'security';
    return 'terminal';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Queue Header & Filters */}
      <div className="queue-controls-bar">
        <div className="queue-header-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Operational Queue
            </h2>
            <span className="queue-counter-badge">
              {tickets.length}
            </span>
          </div>

          <button
            onClick={fetchTickets}
            disabled={isLoading}
            className="btn-console-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '5px 10px' }}
            title="Refresh queue"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '14px',
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
            >
              refresh
            </span>
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-search-strip">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({allCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'degraded' ? 'active' : ''}`}
              onClick={() => setFilter('degraded')}
            >
              Degraded ({degradedCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilter('resolved')}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          <div className="search-input-wrap">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'var(--surface-lowest)',
            border: '1px dashed var(--text-muted)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error_outline</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State (Line-Art Binary Heap Graphic) */}
      {filteredTickets.length === 0 && !isLoading && !error && (
        <div className="empty-queue-container">
          <div className="empty-state-canvas" style={{ padding: '2.5rem 1.5rem' }}>
            <svg
              className="heap-svg-graphic"
              fill="none"
              viewBox="0 0 288 176"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '220px', height: '135px', marginBottom: '1rem' }}
            >
              <g opacity="0.3">
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="16" x2="272" y1="24" y2="24" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="16" x2="272" y1="56" y2="56" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="16" x2="272" y1="88" y2="88" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="16" x2="272" y1="120" y2="120" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="16" x2="272" y1="152" y2="152" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="24" x2="24" y1="16" y2="160" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="72" x2="72" y1="16" y2="160" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="120" x2="120" y1="16" y2="160" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="168" x2="168" y1="16" y2="160" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="216" x2="216" y1="16" y2="160" />
                <line stroke="#71717A" strokeDasharray="2 4" strokeWidth="1" x1="264" x2="264" y1="16" y2="160" />
              </g>
              <g stroke="#3F3F46" strokeWidth="1">
                <path d="M48 40 H112 V72 H48 Z" fill="#121214" />
                <path d="M128 40 H192 V72 H128 Z" fill="#121214" />
                <path d="M208 40 H272 V72 H208 Z" fill="#121214" />
                <path d="M80 72 V104 H144" strokeDasharray="2 2" />
                <path d="M160 72 V104" strokeDasharray="2 2" />
                <path d="M240 72 V104 H176" strokeDasharray="2 2" />
                <path d="M96 104 H192 V136 H96 Z" fill="#18181B" stroke="#FAFAFA" />
              </g>
              <text fill="#71717A" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="80" y="58">0x00:NULL</text>
              <text fill="#71717A" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="160" y="58">0x01:NULL</text>
              <text fill="#71717A" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="240" y="58">0x02:NULL</text>
              <text fill="#FAFAFA" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="144" y="122">HEAP_ROOT: EMPTY</text>
              <rect fill="#FAFAFA" height="12" width="6" x="238" y="112">
                <animate attributeName="opacity" dur="1.1s" repeatCount="indefinite" values="1;0;1" />
              </rect>
              <text fill="#71717A" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="230" y="122">&gt;_</text>
            </svg>

            <h3 className="empty-title" style={{ fontSize: '1.1rem' }}>
              {tickets.length === 0 ? 'Queue is clear' : 'No matching tickets'}
            </h3>
            <p className="empty-desc" style={{ fontSize: '11px', maxWidth: '380px', marginTop: '0.25rem' }}>
              {tickets.length === 0
                ? 'No active requests in the queue.'
                : `No tickets match "${search || filter}".`}
            </p>

            <div className="empty-actions-row" style={{ marginTop: '1rem' }}>
              {tickets.length === 0 ? (
                <>
                  <button
                    type="button"
                    onClick={handleCreateTestRequest}
                    disabled={isSimulating}
                    className="btn-cta-primary"
                    style={{ width: 'auto', padding: '5px 12px', fontSize: '11px' }}
                  >
                    {isSimulating ? 'Creating...' : 'Create Test Request'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateSpike}
                    disabled={isSimulating}
                    className="btn-console-secondary"
                    style={{ padding: '5px 12px', fontSize: '11px' }}
                  >
                    Simulate Spike
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-console-secondary"
                  style={{ fontSize: '11px' }}
                  onClick={() => {
                    setFilter('all');
                    setSearch('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Streamlined Ticket Cards */}
      <div className="ticket-feed">
        {filteredTickets.map((ticket) => {
          const isFailed = ticket.status === 'PROCESSING_FAILED';
          const isResolved = ticket.status === 'RESOLVED';
          const isPending = ticket.status === 'PENDING';
          const isProcessed = ticket.status === 'PROCESSED';

          const priorityNum = ticket.finalPriority || (isFailed ? 3 : 2);
          const priorityBadgeClass = priorityNum === 1
            ? 'p-badge-p1'
            : priorityNum === 2
            ? 'p-badge-p2'
            : 'p-badge-p3';

          return (
            <article
              key={ticket.id}
              className={`ticket-card ${isResolved ? 'opacity-80' : ''}`}
            >
              {/* Header Row */}
              <div className="ticket-top-row">
                <div className="ticket-heading">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '18px',
                      color: isFailed ? 'var(--text-primary)' : isResolved ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}
                  >
                    {getCategoryIcon(ticket.category, ticket.title)}
                  </span>
                  <h3
                    style={{
                      textDecoration: isResolved ? 'line-through' : 'none',
                      color: isResolved ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}
                  >
                    {ticket.title}
                  </h3>
                </div>

                <div className="ticket-badges-group">
                  <span className={`p-badge ${priorityBadgeClass}`}>
                    P{priorityNum}
                  </span>

                  {isProcessed && (
                    <span className="status-pill status-pill-PROCESSED">
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FAFAFA' }} />
                      PROCESSED
                    </span>
                  )}

                  {isPending && (
                    <span className="status-pill status-pill-PENDING">
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          border: '1px solid #A1A1AA',
                          display: 'inline-block'
                        }}
                      />
                      PENDING
                    </span>
                  )}

                  {isFailed && (
                    <span className="status-pill status-pill-PROCESSING_FAILED">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>warning</span>
                      DEGRADED
                    </span>
                  )}

                  {isResolved && (
                    <span className="status-pill status-pill-RESOLVED">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check</span>
                      RESOLVED
                    </span>
                  )}
                </div>
              </div>

              {/* Concise Metadata Line */}
              <div className="ticket-meta-strip">
                <span>
                  Requester: <strong style={{ fontFamily: 'var(--font-mono)' }}>{ticket.requesterId}</strong>
                </span>
                {ticket.requesterDepartment && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>Dept: <strong>{ticket.requesterDepartment}</strong></span>
                  </>
                )}
                {ticket.category && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>Category: <strong>{ticket.category}</strong></span>
                  </>
                )}
                {ticket.urgencyScore !== null && ticket.urgencyScore !== undefined && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>Urgency: <strong>{ticket.urgencyScore}/100</strong></span>
                  </>
                )}
              </div>

              {/* Description Body */}
              <p className="ticket-body-text">
                {ticket.description}
              </p>

              {/* Degraded Alert Notice (Concise) */}
              {isFailed && ticket.errorDetail && (
                <div className="degradation-notice">
                  <span className="degradation-header">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>error_outline</span>
                    Service Notice:
                  </span>
                  <p className="degradation-detail" style={{ fontSize: '10px' }}>{ticket.errorDetail}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="ticket-footer-row" style={{ justifyContent: 'flex-end' }}>
                {!isResolved ? (
                  <button
                    type="button"
                    onClick={() => handleResolve(ticket.id)}
                    disabled={updatingId === ticket.id}
                    className="btn-console-secondary"
                  >
                    {updatingId === ticket.id ? 'Resolving...' : 'Mark Resolved'}
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Resolved
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
