import React, { useState } from 'react';
import { RequestForm } from './components/RequestForm';
import { RequestList } from './components/RequestList';

export const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <h1 className="brand-title">FlowDesk</h1>
            <p className="card-subtitle">Multi-Service Workflow Automation Platform</p>
          </div>
        </div>
        <div className="header-badges">
          <span className="meta-badge">Java 17 / Spring Boot</span>
          <span className="meta-badge">Python / FastAPI</span>
          <span className="meta-badge">C++17 Heap Engine</span>
          <span className="meta-badge">Mock Legacy SOAP</span>
        </div>
      </header>

      <main className="main-grid">
        <aside>
          <RequestForm onTicketSubmitted={handleTicketSubmitted} />
        </aside>
        <section>
          <RequestList refreshTrigger={refreshTrigger} />
        </section>
      </main>
    </div>
  );
};

export default App;
