import React from 'react';

export const TelemetryBar: React.FC = () => {
  return (
    <div className="telemetry-scrim">
      <div className="scrim-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
          <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '10px' }}>
            Heap Engine: v17.4-fast
          </span>
        </div>
        <span className="scrim-sep">/</span>
        <div>
          <span className="scrim-label">ROOT HEAP ADDR: </span>
          <span className="scrim-val">0x7FFEE312A090</span>
        </div>
        <span className="scrim-sep">/</span>
        <div>
          <span className="scrim-label">TOP PRIORITY SCORE: </span>
          <span className="scrim-val">0.99824</span>
        </div>
      </div>

      <div className="scrim-right">
        <span className="scrim-chip">SOAP Sync: Active</span>
        <span className="scrim-chip" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
          LATENCY 0.38ms
        </span>
      </div>
    </div>
  );
};
