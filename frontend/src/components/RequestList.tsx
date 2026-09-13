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
  const [lastSync, setLastSync] = useState<string>('Just now');
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null);
      const data = await getTickets();
      setTickets(data);
      const now = new Date();
      setLastSync(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
        title: 'VPN not connecting',
        description: 'Cannot connect to corp VPN since this morning, blocking all work',
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
        title: 'Production database outage in US-East',
        description: 'Primary database cluster is down and blocking all customer transactions immediately',
        requesterId: 'E1024'
      });
      await fetchTickets();
      if (onTicketCreated) onTicketCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to simulate incident spike');
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
      {/* Top Queue Header & Controls */}
      <div className="queue-controls-bar">
        <div className="queue-header-row">
          <div className="queue-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Operational Queue
              </h2>
              <span className="queue-counter-badge">
                {tickets.length} Active {tickets.length === 1 ? 'Ticket' : 'Tickets'}
              </span>
            </div>
            <p className="panel-subtitle">
              Live queue sorted by C++ max-heap computed priority &amp; arrival
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Last Sync
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {lastSync}
              </span>
            </div>
            <button
              onClick={fetchTickets}
              disabled={isLoading}
              className="btn-console-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '6px 12px' }}
              title="Poll latest heap mutations"
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
              <span>{isLoading ? 'SYNCING' : 'REFRESH'}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar Strip */}
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
              placeholder="Filter by ID, requester..."
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
            padding: '0.75rem 1rem',
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

      {/* Screen B: Empty Queue State (Binary Heap Wireframe) */}
      {filteredTickets.length === 0 && !isLoading && !error && (
        <div className="empty-queue-container">
          <div className="empty-state-canvas">
            <svg
              className="heap-svg-graphic"
              fill="none"
              viewBox="0 0 288 176"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.35">
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

            <div className="empty-status-chip">
              <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-primary)', display: 'inline-block' }} />
              <span>{tickets.length === 0 ? 'Zero Unprocessed Frames' : 'Filter Result Zero Frames'}</span>
            </div>

            <h3 className="empty-title">{tickets.length === 0 ? 'Queue is clear' : 'No matching tickets in queue'}</h3>
            <p className="empty-desc">
              {tickets.length === 0
                ? 'There are no active or degraded tickets waiting in the C++ max-heap scheduler. Incoming requests will be classified and prioritized in real time.'
                : `No tickets match current filter (${filter.toUpperCase()}) ${search ? `or search term "${search}"` : ''}. Other active requests remain queued in memory.`}
            </p>

            <div className="empty-actions-row">
              {tickets.length === 0 ? (
                <>
                  <button
                    type="button"
                    onClick={handleCreateTestRequest}
                    disabled={isSimulating}
                    className="btn-cta-primary"
                    style={{ width: 'auto', padding: '6px 14px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add_task</span>
                    <span>{isSimulating ? 'Creating...' : 'Create Test Request'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateSpike}
                    disabled={isSimulating}
                    className="btn-console-secondary"
                    style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>bolt</span>
                    <span>Simulate Incident Spike</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-console-secondary"
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

          <div className="empty-diagnostics-bar">
            <div className="diag-item-group">
              <span style={{ color: 'var(--text-muted)' }}>HEAP:</span>
              <strong style={{ color: 'var(--text-primary)' }}>0 bytes</strong>
              <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>WORKERS:</span>
              <strong style={{ color: 'var(--text-primary)' }}>8/8 Idle</strong>
              <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>CLASSIFIER:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Ready</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>DISPATCH LATENCY: </span>
              <strong style={{ color: 'var(--text-primary)' }}>0.02ms</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
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
                      fontSize: '1rem',
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
                      PARTIAL / DEGRADED
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

              {/* Metadata Line */}
              <div className="ticket-meta-strip">
                <span>
                  Requester: <strong style={{ fontFamily: 'var(--font-mono)' }}>{ticket.requesterId}</strong>
                </span>
                {ticket.category && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>
                      Category: <strong style={{ fontFamily: 'var(--font-mono)' }}>{ticket.category}</strong>
                    </span>
                  </>
                )}
                {ticket.urgencyScore !== null && ticket.urgencyScore !== undefined && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>
                      Urgency: <strong style={{ fontFamily: 'var(--font-mono)' }}>{ticket.urgencyScore}/100</strong>
                    </span>
                  </>
                )}
                {ticket.queuePosition && (
                  <>
                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                    <span>
                      Queue Position: <strong style={{ fontFamily: 'var(--font-mono)' }}>#{ticket.queuePosition}</strong>
                    </span>
                  </>
                )}
              </div>

              {/* Description Body */}
              <p className="ticket-body-text">
                {ticket.description}
              </p>

              {/* Nested Key-Value Metadata Grid */}
              <div className="ticket-nested-grid">
                <div className="nested-col">
                  <span className="nested-label">Department</span>
                  <span className="nested-val">{ticket.requesterDepartment || 'Engineering'}</span>
                </div>
                <div className="nested-col">
                  <span className="nested-label">Manager</span>
                  <span className="nested-val">{ticket.requesterManagerEmail || 'manager@company.com'}</span>
                </div>
                <div className="nested-col">
                  <span className="nested-label">Request ID</span>
                  <span className="nested-val" style={{ fontFamily: 'var(--font-mono)' }}>
                    {ticket.id.substring(0, 12)}
                  </span>
                </div>
              </div>

              {/* Pure Monochrome Pipeline Degradation Notice */}
              {isFailed && ticket.errorDetail && (
                <div className="degradation-notice">
                  <span className="degradation-header">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error_outline</span>
                    Pipeline Degradation Notice:
                  </span>
                  <p className="degradation-detail">{ticket.errorDetail}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="ticket-footer-row">
                <div className="ticket-dispatch-note">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                    {isProcessed ? 'bolt' : isFailed ? 'refresh' : isResolved ? 'check_circle' : 'schedule'}
                  </span>
                  <span>
                    {isProcessed
                      ? 'Direct FastPath dispatched to Tier-3 SRE'
                      : isFailed
                      ? 'FastAPI endpoint retrying (Backoff: 4s)'
                      : isResolved
                      ? 'Completed via console'
                      : 'In queue for WireGuard peer reset'}
                  </span>
                </div>

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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Completed
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
