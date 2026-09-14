import React from 'react';

export const TicketStates: React.FC = () => {
  return (
    <section className="states-section" id="ticket-states">
      <div className="section-heading">
        <div>
          <p className="eyebrow blue-text">02 —</p>
          <h2>Ticket states</h2>
        </div>
        <p className="eyebrow">COMPONENT REFERENCE / CARD VARIANTS</p>
      </div>

      <div className="state-grid">
        {/* Card 1: PENDING */}
        <article className="ticket-card pending-card">
          <div className="ticket-top">
            <div className="state-label pending-label">
              <span className="state-icon">
                <span className="material-symbols-outlined">schedule</span>
              </span>
              PENDING
            </div>
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>more_vert</span>
          </div>
          <h3>FlowDesk Ticket #48271</h3>
          <p className="ticket-summary">Access request for shared Drive folder</p>
          <div className="ticket-details">
            <dl>
              <dt>REQUEST ID</dt>
              <dd>FD-48271</dd>
              <dt>REQUESTER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Alex Carter
              </dd>
              <dt>CATEGORY</dt>
              <dd>
                <span className="material-symbols-outlined">description</span>
                Access &amp; Permissions
              </dd>
              <dt>URGENCY</dt>
              <dd>
                <span className="status-dot pending"></span>
                Medium
              </dd>
              <dt>QUEUE POSITION</dt>
              <dd>7</dd>
              <dt>DEPARTMENT</dt>
              <dd>
                <span className="material-symbols-outlined">business</span>
                Product
              </dd>
              <dt>MANAGER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Priya Nair
              </dd>
            </dl>
            <div className="description">
              <dt>DESCRIPTION</dt>
              <p>
                Requesting access to the shared Drive folder for the Q3 product launch project. Need it by EOD today if possible.
              </p>
            </div>
          </div>
        </article>

        {/* Card 2: PROCESSED */}
        <article className="ticket-card processed-card">
          <div className="ticket-top">
            <div className="state-label processed-label">
              <span className="state-icon">
                <span className="material-symbols-outlined">check_circle</span>
              </span>
              PROCESSED
            </div>
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>more_vert</span>
          </div>
          <h3>FlowDesk Ticket #48302</h3>
          <p className="ticket-summary">Software installation request</p>
          <div className="ticket-details">
            <dl>
              <dt>REQUEST ID</dt>
              <dd>FD-48302</dd>
              <dt>REQUESTER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Jamie Silva
              </dd>
              <dt>CATEGORY</dt>
              <dd>
                <span className="material-symbols-outlined">settings</span>
                Software
              </dd>
              <dt>URGENCY</dt>
              <dd>
                <span className="status-dot blue-dot"></span>
                Low
              </dd>
              <dt>QUEUE POSITION</dt>
              <dd>3</dd>
              <dt>DEPARTMENT</dt>
              <dd>
                <span className="material-symbols-outlined">business</span>
                IT
              </dd>
              <dt>MANAGER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Daniel Kim
              </dd>
            </dl>
            <div className="description">
              <dt>DESCRIPTION</dt>
              <p>
                Please install the latest version of Chrome on my laptop (Asset ID 28376). Thanks!
              </p>
            </div>
          </div>
        </article>

        {/* Card 3: RESOLVED */}
        <article className="ticket-card resolved-card">
          <div className="ticket-top">
            <div className="state-label resolved-label">
              <span className="state-icon">
                <span className="material-symbols-outlined">check_circle</span>
              </span>
              RESOLVED
            </div>
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>more_vert</span>
          </div>
          <h3>FlowDesk Ticket #48196</h3>
          <p className="ticket-summary">Email delivery issue</p>
          <div className="ticket-details">
            <dl>
              <dt>REQUEST ID</dt>
              <dd>FD-48196</dd>
              <dt>REQUESTER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Morgan Lee
              </dd>
              <dt>CATEGORY</dt>
              <dd>
                <span className="material-symbols-outlined">mail</span>
                Email
              </dd>
              <dt>URGENCY</dt>
              <dd>
                <span className="status-dot success"></span>
                Low
              </dd>
              <dt>QUEUE POSITION</dt>
              <dd>0</dd>
              <dt>DEPARTMENT</dt>
              <dd>
                <span className="material-symbols-outlined">business</span>
                Marketing
              </dd>
              <dt>MANAGER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Riley Patel
              </dd>
            </dl>
            <div className="description">
              <dt>DESCRIPTION</dt>
              <p>
                Emails to external recipients were bouncing since this morning. Issue appears to be resolved now. Thanks for the quick help!
              </p>
            </div>
          </div>
        </article>

        {/* Card 4: PARTIAL / DEGRADED */}
        <article className="ticket-card degraded-card">
          <div className="ticket-top">
            <div className="state-label degraded-label">
              <span className="state-icon">
                <span className="material-symbols-outlined">info</span>
              </span>
              PARTIAL / DEGRADED
            </div>
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>more_vert</span>
          </div>
          <h3>FlowDesk Ticket #48417</h3>
          <p className="ticket-summary">Report generation timing out</p>
          <div className="inline-alert">
            <span className="material-symbols-outlined">info</span>
            <span>Some downstream services are delayed. Retry available.</span>
          </div>
          <div className="ticket-details">
            <dl>
              <dt>REQUEST ID</dt>
              <dd>FD-48417</dd>
              <dt>REQUESTER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Taylor Brooks
              </dd>
              <dt>CATEGORY</dt>
              <dd>
                <span className="material-symbols-outlined">analytics</span>
                Analytics
              </dd>
              <dt>URGENCY</dt>
              <dd>
                <span className="status-dot failed"></span>
                High
              </dd>
              <dt>QUEUE POSITION</dt>
              <dd>5</dd>
              <dt>DEPARTMENT</dt>
              <dd>
                <span className="material-symbols-outlined">business</span>
                Finance
              </dd>
              <dt>MANAGER</dt>
              <dd>
                <span className="material-symbols-outlined">person</span>
                Sanjay Rao
              </dd>
            </dl>
            <div className="description">
              <dt>DESCRIPTION</dt>
              <p>
                Monthly report is taking longer than expected to generate. Partial data available (84%). Will retry in 15 minutes.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
