import React, { useEffect, useState, useCallback } from 'react';
import { getTickets, updateTicketStatus, TicketRequest } from '../api/client';

interface RequestListProps {
  refreshTrigger?: number;
  onTicketCreated?: () => void;
}

// Sample fallback tickets matching flowdesk-ui/index.html & flowdesk_dashboard.png
const INITIAL_SAMPLE_TICKETS: TicketRequest[] = [
  {
    id: 'REQ-004328',
    title: 'Laptop not starting',
    description: 'Laptop does not boot up after system update.',
    requesterId: 'Alex Johnson',
    requesterDepartment: 'IT Support',
    queuePosition: 3,
    status: 'PROCESSED',
    finalPriority: 4,
    category: 'Hardware'
  },
  {
    id: 'REQ-004327',
    title: 'Access to production environment',
    description: 'Require read-only access to prod cluster for debugging.',
    requesterId: 'Maria Garcia',
    requesterDepartment: 'Engineering',
    queuePosition: 5,
    status: 'PENDING',
    finalPriority: 2,
    category: 'Access & Permissions'
  },
  {
    id: 'REQ-004326',
    title: 'Password reset request',
    description: 'Locked out of identity provider account.',
    requesterId: 'David Kim',
    requesterDepartment: 'Security',
    queuePosition: 1,
    status: 'PROCESSED',
    finalPriority: 2,
    category: 'Security'
  },
  {
    id: 'REQ-004325',
    title: 'New software installation',
    description: 'Requesting installation of data analytics suite.',
    requesterId: 'Sarah Lee',
    requesterDepartment: 'Finance',
    queuePosition: 7,
    status: 'PENDING',
    finalPriority: 1,
    category: 'Software'
  },
  {
    id: 'REQ-004324',
    title: 'Team access to shared drive',
    description: 'Grant team access to Q3 planning folder.',
    requesterId: 'James Wilson',
    requesterDepartment: 'Operations',
    queuePosition: 2,
    status: 'PROCESSED',
    finalPriority: 5,
    category: 'Access & Permissions'
  },
  {
    id: 'REQ-004323',
    title: 'System configuration change',
    description: 'Update proxy routing for staging environment.',
    requesterId: 'Priya Nair',
    requesterDepartment: 'IT Operations',
    queuePosition: 6,
    status: 'RESOLVED',
    finalPriority: 3,
    category: 'IT'
  }
];

export const RequestList: React.FC<RequestListProps> = ({ refreshTrigger }) => {
  const [tickets, setTickets] = useState<TicketRequest[]>(INITIAL_SAMPLE_TICKETS);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [deptFilter, setDeptFilter] = useState('All departments');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [search, setSearch] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('10:24 AM');

  const formatTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTickets();
      if (data && data.length > 0) {
        setTickets(data);
      }
      setLastSyncTime(formatTime());
    } catch {
      // Backend not running or unreachable, keep current/sample tickets and update timestamp
      setLastSyncTime(formatTime());
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
    } catch {
      // Update local state if running standalone or backend offline
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (categoryFilter !== 'All categories') {
      const cat = (t.category || '').toLowerCase();
      if (!cat.includes(categoryFilter.toLowerCase())) return false;
    }

    if (deptFilter !== 'All departments') {
      const dept = (t.requesterDepartment || '').toLowerCase();
      if (!dept.includes(deptFilter.toLowerCase())) return false;
    }

    if (statusFilter !== 'All statuses') {
      const st = t.status.toUpperCase();
      if (statusFilter === 'In Progress' && st !== 'PROCESSED') return false;
      if (statusFilter === 'Pending' && st !== 'PENDING') return false;
      if (statusFilter === 'Resolved' && st !== 'RESOLVED') return false;
      if (statusFilter === 'Degraded' && st !== 'PROCESSING_FAILED') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchReq = t.requesterId.toLowerCase().includes(q);
      const matchDept = t.requesterDepartment?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      return Boolean(matchId || matchTitle || matchReq || matchDept || matchDesc);
    }
    return true;
  });

  const getRowIcon = (index: number, category?: string | null, title?: string) => {
    const cat = (category || '').toLowerCase();
    const t = (title || '').toLowerCase();
    if (cat.includes('hard') || t.includes('laptop')) {
      return { icon: 'laptop_mac', isBlue: true };
    }
    if (cat.includes('access') || t.includes('access') || cat.includes('perm')) {
      return { icon: 'description', isBlue: false };
    }
    if (cat.includes('sec') || t.includes('password')) {
      return { icon: 'shield', isBlue: false };
    }
    if (cat.includes('soft') || t.includes('software') || t.includes('cloud')) {
      return { icon: 'cloud', isBlue: true };
    }
    if (cat.includes('team') || t.includes('drive') || t.includes('group')) {
      return { icon: 'group', isBlue: false };
    }
    if (index % 2 === 0) {
      return { icon: 'settings', isBlue: false };
    }
    return { icon: 'description', isBlue: true };
  };

  const getPriorityLabel = (priority?: number | null) => {
    if (priority === 1) return { label: 'High', className: 'priority high' };
    if (priority === 2 || priority === 3) return { label: 'Medium', className: 'priority medium' };
    return { label: 'Low', className: 'priority low' };
  };

  const getStatusInfo = (status: string, ticket: TicketRequest) => {
    switch (status.toUpperCase()) {
      case 'PROCESSED':
        return {
          label: 'In Progress',
          dotClass: 'status-dot success',
          subtext: 'Assigned to L2 Support'
        };
      case 'PENDING':
        return {
          label: 'Pending',
          dotClass: 'status-dot pending',
          subtext: 'Awaiting approval'
        };
      case 'PROCESSING_FAILED':
        return {
          label: 'Degraded',
          dotClass: 'status-dot failed',
          subtext: ticket.errorDetail || 'Downstream timeout'
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          dotClass: 'status-dot neutral',
          subtext: 'Completed'
        };
      default:
        return {
          label: 'Open',
          dotClass: 'status-dot neutral',
          subtext: 'Awaiting assignment'
        };
    }
  };

  return (
    <article className="panel queue-panel">
        <div className="queue-heading">
          <div className="queue-title-row">
            <div className="panel-heading compact">
              <div className="heading-icon">
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </div>
              <div>
                <h2>Operational queue</h2>
                <p>Live view of current tickets and automated workflow status.</p>
              </div>
            </div>
            <div
              className="last-updated"
              onClick={fetchTickets}
              style={{ cursor: 'pointer' }}
              title="Click to refresh queue"
            >
              <span className={`material-symbols-outlined ${isLoading ? 'spin-icon' : ''}`}>
                sync
              </span>
              Last updated {lastSyncTime}
              <span className="status-dot success"></span>
            </div>
          </div>

          <div className="filters">
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All categories</option>
              <option>Access & Permissions</option>
              <option>Software</option>
              <option>Hardware</option>
              <option>Network</option>
              <option>Database</option>
              <option>Security</option>
            </select>

            <select
              aria-label="Filter by department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option>All departments</option>
              <option>IT Support</option>
              <option>Engineering</option>
              <option>Security</option>
              <option>Finance</option>
              <option>Operations</option>
              <option>Product</option>
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All statuses</option>
              <option>In Progress</option>
              <option>Pending</option>
              <option>Resolved</option>
              <option>Degraded</option>
            </select>

            <div className="search-field">
              <span className="material-symbols-outlined">search</span>
              <input
                placeholder="Search by request ID, title or requester..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="queue-table" role="table" aria-label="Operational queue">
          <div className="queue-row queue-header" role="row">
            <span>Request ID</span>
            <span>Queue Position</span>
            <span>Status</span>
            <span>Priority</span>
            <span></span>
          </div>

          {filteredTickets.map((ticket, index) => {
            const { icon, isBlue } = getRowIcon(index, ticket.category, ticket.title);
            const priority = getPriorityLabel(ticket.finalPriority);
            const statusInfo = getStatusInfo(ticket.status, ticket);
            const formattedId = ticket.id.startsWith('REQ-')
              ? ticket.id
              : `REQ-${ticket.id.substring(0, 6).toUpperCase()}`;

            return (
              <div className="queue-row" role="row" key={ticket.id}>
                <div className="request-id">
                  <span className={`row-icon ${isBlue ? 'blue' : ''}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </span>
                  <span>
                    <strong>{formattedId}</strong>
                    <small>
                      {ticket.title}
                      <br />
                      <em>
                        {ticket.requesterId}
                        {ticket.requesterDepartment ? ` · ${ticket.requesterDepartment}` : ''}
                      </em>
                    </small>
                  </span>
                </div>

                <span>
                  #{ticket.queuePosition !== null && ticket.queuePosition !== undefined ? ticket.queuePosition : index + 1}
                  <small>in queue</small>
                </span>

                <span>
                  <span className="status-line">
                    <span className={statusInfo.dotClass}></span>
                    {statusInfo.label}
                  </span>
                  <small>{statusInfo.subtext}</small>
                </span>

                <span className={priority.className}>{priority.label}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {ticket.status !== 'RESOLVED' ? (
                    <button
                      type="button"
                      className="row-action-btn"
                      onClick={() => handleResolve(ticket.id)}
                      disabled={updatingId === ticket.id}
                      title="Mark ticket resolved"
                    >
                      {updatingId === ticket.id ? 'Resolving...' : 'Resolve'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="row-chevron"
                      title="Ticket resolved"
                    >
                      <span className="material-symbols-outlined" style={{ color: 'var(--green)' }}>
                        check
                      </span>
                    </button>
                  )}
                  <span className="material-symbols-outlined row-chevron">
                    chevron_right
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="empty-queue-material">
              <div className="empty-icon">
                <span className="material-symbols-outlined">inbox</span>
              </div>
              <h3>No tickets match your filters</h3>
              <p>Try clearing your search query or selecting "All" from the filter dropdowns.</p>
              <div className="empty-queue-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setCategoryFilter('All categories');
                    setDeptFilter('All departments');
                    setStatusFilter('All statuses');
                    setSearch('');
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
  );
};
