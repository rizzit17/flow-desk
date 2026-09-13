import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
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
              <span style={{ color: 'var(--text-primary)' }}>New Request</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
              expand_more
            </span>
          </summary>
          <div className="drawer-content">
            <RequestForm onTicketSubmitted={handleTicketSubmitted} />
          </div>
        </details>

        {/* Main 2-Panel View */}
        <main className="main-split-grid">
          <aside className="desktop-submit-aside">
            <RequestForm onTicketSubmitted={handleTicketSubmitted} />
          </aside>
          <section>
            <RequestList refreshTrigger={refreshTrigger} onTicketCreated={handleTicketSubmitted} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
