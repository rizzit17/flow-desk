import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { TelemetryBar } from './components/TelemetryBar';
import { RequestForm } from './components/RequestForm';
import { RequestList } from './components/RequestList';

export const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-root">
      <AppHeader />

      <div className="app-viewport">
        <TelemetryBar />

        {/* Mobile Collapsible Submit Drawer */}
        <details className="mobile-submit-drawer">
          <summary className="drawer-summary">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}
              >
                +
              </span>
              <span style={{ color: 'var(--text-primary)' }}>Submit New Request</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
              expand_more
            </span>
          </summary>
          <div className="drawer-content">
            <RequestForm onTicketSubmitted={handleTicketSubmitted} />
          </div>
        </details>

        {/* Main 2-Panel Engineering Console */}
        <main className="main-split-grid">
          <aside className="desktop-submit-aside">
            <RequestForm onTicketSubmitted={handleTicketSubmitted} />
          </aside>
          <section>
            <RequestList refreshTrigger={refreshTrigger} onTicketCreated={handleTicketSubmitted} />
          </section>
        </main>

        {/* Lower 3 Telemetry Cards */}
        <div className="telemetry-cards-grid">
          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-card-title">Heap Strategy</span>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                data_array
              </span>
            </div>
            <span className="telemetry-card-metric">C++17 std::priority_queue</span>
            <p className="telemetry-card-desc">
              O(log n) insertions with lockless double buffer for tier-1 incidents.
            </p>
          </div>

          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-card-title">Automated Routing</span>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                alt_route
              </span>
            </div>
            <span className="telemetry-card-metric">Confidence Score &gt;= 0.92</span>
            <p className="telemetry-card-desc">
              Tickets automatically bind to specialized pods within 4ms of receipt.
            </p>
          </div>

          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-card-title">Dead-Letter Status</span>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                check_circle
              </span>
            </div>
            <span className="telemetry-card-metric">Quarantine Empty</span>
            <p className="telemetry-card-desc">
              Zero unparseable payloads in Kafka fallback buffer over the past 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
