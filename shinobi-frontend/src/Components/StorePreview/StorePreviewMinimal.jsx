import React from 'react';
import './StorePreviewMinimal.css';

const StorePreviewMinimal = () => {
  return (
    <div className="store-preview-minimal">
      <div className="store-preview-minimal-content shadowed-box rounded-sm">
        <div className="store-preview-minimal-header">
          <h2 className="store-preview-minimal-title">
            <span className="accent-text">Shinobi</span> Store
          </h2>
          <p className="store-preview-minimal-subtitle">Premium martial arts gear and more</p>
        </div>

        <div className="coming-soon">
          <div className="coming-soon-text" aria-live="polite" aria-label="Coming soon">
            Coming soon
            <span className="coming-soon-ellipsis">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
          <p className="coming-soon-note">Our online store launches here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default StorePreviewMinimal;
