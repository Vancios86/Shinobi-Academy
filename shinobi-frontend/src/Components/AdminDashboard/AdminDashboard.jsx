import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import logo from '../../assets/logos/logo.png';
import { useScrollToTopOnMount } from '../../hooks/useScrollToTop';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Scroll to top when component mounts
  useScrollToTopOnMount();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleUpdateGallery = () => {
    navigate('/admin/gallery-manager');
  };

  const handleUpdateCoaches = () => {
    navigate('/admin/coaches-manager');
  };

  const handleUpdateContact = () => {
    navigate('/admin/contact-manager');
  };

  const handleUpdateContent = () => {
    navigate('/admin/content-manager');
  };

  const handleUpdateTestimonials = () => {
    navigate('/admin/testimonials-manager');
  };

  const handleUpdateClasses = () => {
    navigate('/admin/classes-manager');
  };

  const handleUpdateSchedule = () => {
    navigate('/admin/schedule-manager');
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
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
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
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.99 2.5V8c0-.55-.45-1-1-1s-1 .45-1 1v8c0 .55.45 1 1 1h1v-2.5l1.99-2.5c.47-.63 1.21-1 2.01-1h1.54c.8 0 1.54.37 2.01 1L22.5 16H20v6h2z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Coaches</h3>
              <p className='action-description text-dark'>
                Manage coach profiles, information, and team details.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateContact}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Contact</h3>
              <p className='action-description text-dark'>
                Manage contact details, address, and social media links.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateContent}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Content</h3>
              <p className='action-description text-dark'>
                Edit website text content, descriptions, and information.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateTestimonials}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h2a4 4 0 0 1 8 0h2c0-3.31-2.69-6-6-6z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Manage Testimonials</h3>
              <p className='action-description text-dark'>
                Create, edit, reorder and remove testimonials.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateClasses}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Update Classes</h3>
              <p className='action-description text-dark'>
                Add, edit, delete, and reorder martial arts classes.
              </p>
            </div>

            <div className='action-card shadowed-box' onClick={handleUpdateSchedule}>
              <div className='action-icon'>
                <svg viewBox="0 0 24 24" fill="currentColor" className='icon-svg'>
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <h3 className='action-title text-dark'>Manage Schedule</h3>
              <p className='action-description text-dark'>
                Create and manage weekly class schedules and timings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
