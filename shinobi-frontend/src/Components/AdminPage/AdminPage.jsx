import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import { useAuth } from '../../contexts/AuthContext';

const AdminPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Security configuration
  const MAX_LOGIN_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const CORRECT_USERNAME = 'Colin';
  const CORRECT_PASSWORD = 'IamBack2025';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateCredentials = (username, password) => {
    // Case-sensitive comparison
    return username === CORRECT_USERNAME && password === CORRECT_PASSWORD;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (validateCredentials(formData.username, formData.password)) {
        // Successful login
        setLoginAttempts(0);
        setError('');
        // Set authentication and navigate to dashboard
        login();
        navigate('/admin/dashboard');
      } else {
        // Failed login
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setError('Too many failed attempts. Account locked for 5 minutes.');
          
          // Auto-unlock after lockout duration
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
            setError('');
          }, LOCKOUT_DURATION);
        } else {
          setError(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
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
                  disabled={isLoading || isLocked}
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
                  disabled={isLoading || isLocked}
                  autoComplete='current-password'
                />
              </div>
              
              <button 
                type='submit' 
                className='admin-login-btn'
                disabled={isLoading || isLocked}
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
