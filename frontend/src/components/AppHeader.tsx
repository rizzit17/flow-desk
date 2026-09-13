import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <svg
          className="brand-logo-mark"
          fill="none"
          height="28"
          viewBox="0 0 32 32"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="#18181B" height="32" rx="7" stroke="#27272A" strokeWidth="1.5" width="32" />
          <path d="M9 10h14M9 16h9M9 22h5" stroke="#FAFAFA" strokeLinecap="round" strokeWidth="2.2" />
          <circle cx="21" cy="20" fill="#FAFAFA" r="2" />
        </svg>
        <span className="brand-title">FlowDesk</span>
      </div>

      <div className="header-actions">
        <div className="telemetry-pill">
          <span className="pulse-dot" />
          <span>Operational</span>
        </div>

        <div className="user-avatar" title="Signed in as Engineer">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
        </div>
      </div>
    </header>
  );
};
