import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { RequestForm } from './components/RequestForm';
import { RequestList } from './components/RequestList';
import { TicketStates } from './components/TicketStates';

export const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeSidebarNav, setActiveSidebarNav] = useState('Dashboard');

  const handleTicketSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      <AppHeader />

      <div className="workspace">
        <aside className="sidebar">
          <nav aria-label="Workspace navigation">
            <a
              href="#dashboard"
              className={activeSidebarNav === 'Dashboard' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('Dashboard')}
            >
              <span className="material-symbols-outlined">home</span>
              Dashboard
            </a>
            <a
              href="#dashboard"
              className={activeSidebarNav === 'My Requests' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('My Requests')}
            >
              <span className="material-symbols-outlined">confirmation_number</span>
              My Requests
            </a>
            <a
              href="#dashboard"
              className={activeSidebarNav === 'Team Queue' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('Team Queue')}
            >
              <span className="material-symbols-outlined">group</span>
              Team Queue
            </a>
            <a
              href="#ticket-states"
              className={activeSidebarNav === 'Automation' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('Automation')}
            >
              <span className="material-symbols-outlined">bolt</span>
              Automation
            </a>
            <a
              href="#dashboard"
              className={activeSidebarNav === 'Knowledge Base' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('Knowledge Base')}
            >
              <span className="material-symbols-outlined">menu_book</span>
              Knowledge Base
            </a>
            <a
              href="#dashboard"
              className={activeSidebarNav === 'Settings' ? 'active' : ''}
              onClick={() => setActiveSidebarNav('Settings')}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
          </nav>

          <div className="health-card">
            <div className="health-title">
              <span className="status-dot success"></span>
              System Healthy
            </div>
            <p>All services operational</p>
          </div>
        </aside>

        <main className="main-content" id="dashboard">
          <section className="screen-heading">
            <div>
              <p className="eyebrow">DESKTOP / 1440px</p>
              <h1>Dashboard</h1>
              <p className="subtitle">Submit a request and monitor automated workflow progress.</p>
            </div>
          </section>

          <section className="dashboard-grid">
            <RequestForm onTicketSubmitted={handleTicketSubmitted} />
            <RequestList
              refreshTrigger={refreshTrigger}
              onTicketCreated={handleTicketSubmitted}
            />
          </section>
        </main>
      </div>

      <TicketStates />
    </div>
  );
};

export default App;
