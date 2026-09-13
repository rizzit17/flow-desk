import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <svg
          className="brand-logo-mark"
          fill="none"
          height="32"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="#18181B" height="32" rx="7" stroke="#27272A" strokeWidth="1.5" width="32" />
          <path d="M9 10h14M9 16h9M9 22h5" stroke="#FAFAFA" strokeLinecap="round" strokeWidth="2.2" />
          <circle cx="21" cy="20" fill="#FAFAFA" r="2" />
        </svg>
        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-title">FlowDesk</span>
            <span className="brand-version">v2.4-rt</span>
          </div>
          <span className="brand-desc">Multi-Service Workflow Automation Platform</span>
        </div>
      </div>

      <div className="tech-pills">
        <span className="tech-pill">Java 17 / Spring Boot</span>
        <span className="tech-pill">Python / FastAPI</span>
        <span className="tech-pill">C++17 Heap Engine</span>
        <span className="tech-pill">Mock Legacy SOAP</span>
        <span className="tech-pill tech-pill-active">PRODUCTION • CLUSTER-01</span>
      </div>

      <div className="header-actions">
        <div className="telemetry-pill">
          <span className="pulse-dot" />
          <span>SYSTEM NOMINAL 99.98%</span>
        </div>

        <div className="search-hint">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span>
          <span>⌘K / Search</span>
        </div>

        <div className="user-badge">
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>ENG-STAFF</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1, marginTop: '2px' }}>tier-3-ops</span>
          </div>
          <div className="user-avatar">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
