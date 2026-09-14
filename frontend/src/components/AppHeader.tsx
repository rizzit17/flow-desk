import React, { useState } from 'react';

export const AppHeader: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Home');

  return (
    <header className="topbar">
      <a className="brand" href="#dashboard" aria-label="FlowDesk home">
        <span className="brand-mark" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span>FlowDesk</span>
      </a>

      <nav className="top-nav" aria-label="Primary navigation">
        <a
          href="#dashboard"
          className={activeNav === 'Home' ? 'active' : ''}
          onClick={() => setActiveNav('Home')}
        >
          <span className="material-symbols-outlined">home</span>
          Home
        </a>
        <a
          href="#dashboard"
          className={activeNav === 'Requests' ? 'active' : ''}
          onClick={() => setActiveNav('Requests')}
        >
          <span className="material-symbols-outlined">confirmation_number</span>
          Requests
        </a>
        <a
          href="#ticket-states"
          className={activeNav === 'Automation' ? 'active' : ''}
          onClick={() => setActiveNav('Automation')}
        >
          <span className="material-symbols-outlined">bolt</span>
          Automation
        </a>
        <a
          href="#dashboard"
          className={activeNav === 'Reports' ? 'active' : ''}
          onClick={() => setActiveNav('Reports')}
        >
          <span className="material-symbols-outlined">bar_chart</span>
          Reports
        </a>
        <a
          href="#dashboard"
          className={activeNav === 'Admin' ? 'active' : ''}
          onClick={() => setActiveNav('Admin')}
        >
          <span className="material-symbols-outlined">settings</span>
          Admin
        </a>
      </nav>

      <div className="top-actions">
        <div className="stack-chips" aria-label="Technology stack">
          <span className="outline-chip">Spring Boot</span>
          <span className="outline-chip">FastAPI</span>
          <span className="outline-chip">C++ Engine</span>
          <span className="outline-chip">SOAP Legacy</span>
        </div>
        <button className="icon-button" aria-label="Search" title="Search">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="icon-button" aria-label="Notifications" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="avatar" aria-label="Account menu" title="Account: JD">
          JD
        </button>
      </div>
    </header>
  );
};
