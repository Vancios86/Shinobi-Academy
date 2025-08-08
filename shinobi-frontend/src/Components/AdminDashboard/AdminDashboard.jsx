import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import logo from '../../assets/logos/logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement proper logout logic
    navigate('/admin');
  };

  const handleUpdateGallery = () => {
    navigate('/gallery-manager');
  };

  const handleUpdateCoaches = () => {
    navigate('/coaches-manager');
  };

  return (
    <div className='admin-dashboard'>
      <header className='dashboard-header'>
        <div className='dashboard-header-content'>
          <div className='dashboard-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='dashboard-logo-img' />
            <h1 className='dashboard-title'>Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className='logout-btn'>
            Logout
          </button>
        </div>
      </header>

      <main className='dashboard-main'>
        <div className='dashboard-container'>
          <div className='welcome-section'>
            <h2 className='welcome-title text-red'>Welcome, Colin!</h2>
            <p className='welcome-subtitle text-dark'>
              Manage your Shinobi Academy content from here.
            </p>
          </div>

          <div className='dashboard-actions'>
            <div className='action-card shadowed-box' onClick={handleUpdateGallery}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Gallery</h3>
              <p className='action-description text-dark'>
                Add, remove, or modify gallery images and content.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateCoaches}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.99 2.5V8c0-.55-.45-1-1-1s-1 .45-1 1v8c0 .55.45 1 1 1h1v-2.5l1.99-2.5c.47-.63 1.21-1 2.01-1h1.54c.8 0 1.54.37 2.01 1L22.5 16H20v6h2z"/>
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Coaches</h3>
              <p className='action-description text-dark'>
                Manage coach profiles, information, and team details.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
