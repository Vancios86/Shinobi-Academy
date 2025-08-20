import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import { useAuth } from '../../contexts/AuthContext';

const AdminPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Successful login - navigation will happen via useEffect
        setError('');
      } else {
        // Failed login
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='admin-page'>
      <main className='admin-main'>
        <div className='admin-container'>
          <div className='admin-login-card shadowed-box'>
            <h1 className='admin-title text-red'>Admin Login</h1>
            
            <form onSubmit={handleSubmit} className='admin-form'>
              {error && (
                <div className='error-message'>
                  {error}
                </div>
              )}
              
              <div className='form-group'>
                <label htmlFor='username' className='form-label text-dark'>
                  Username
                </label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  className='form-input'
                  required
                  disabled={isLoading}
                  autoComplete='username'
                />
              </div>
              
              <div className='form-group'>
                <label htmlFor='password' className='form-label text-dark'>
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='form-input'
                  required
                  disabled={isLoading}
                  autoComplete='current-password'
                />
              </div>
              
              <button 
                type='submit' 
                className='admin-login-btn'
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
