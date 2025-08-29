import './ContactFormComponent.css';
import { useState, useEffect } from 'react';
import { send } from 'emailjs-com';

const ContactFormComponent = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'from_name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'reply_to':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
        return '';
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle field blur (mark as touched and validate)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ from_name: true, reply_to: true, message: true });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await send('service_mtav7vb', 'template_okhram8', formData, 'YLAsSYEnWm66148GH');
      setSubmitStatus('success');
      setFormData({ from_name: '', reply_to: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitStatus('error');
      console.error('Email send error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => setSubmitStatus(null), 5001);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className='contact-form'>
      <div className='contact-form-title'>
        <h3>Send us a message</h3>
        <p>We'd love to hear from you!</p>
      </div>

      <form className='contact-form-container shadowed-box rounded-sm' onSubmit={handleSubmit}>
        <div className='form-field'>
          <div className='input-wrapper'>
            <input
              type='text'
              name='from_name'
              id='name'
              placeholder=' '
              value={formData.from_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.from_name && errors.from_name ? 'error' : ''}
              required
            />
            <label htmlFor='name'>Your Name</label>
            <div className='input-icon'>👤</div>
          </div>
          {touched.from_name && errors.from_name && (
            <span className='error-message'>{errors.from_name}</span>
          )}
        </div>

        <div className='form-field'>
          <div className='input-wrapper'>
            <input
              type='email'
              name='reply_to'
              id='email'
              placeholder=' '
              value={formData.reply_to}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.reply_to && errors.reply_to ? 'error' : ''}
              required
            />
            <label htmlFor='email'>Email Address</label>
            <div className='input-icon'>📧</div>
          </div>
          {touched.reply_to && errors.reply_to && (
            <span className='error-message'>{errors.reply_to}</span>
          )}
        </div>

        <div className='form-field'>
          <div className='input-wrapper'>
            <textarea
              name='message'
              id='message'
              placeholder=' '
              rows={4}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.message && errors.message ? 'error' : ''}
              required
            />
            <label htmlFor='message'>Your Message</label>
            <div className='input-icon'>💬</div>
            <div className='character-count'>
              {formData.message.length}/1000
            </div>
          </div>
          {touched.message && errors.message && (
            <span className='error-message'>{errors.message}</span>
          )}
        </div>

        <button
          type='submit'
          className='button-large submit-button'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className='spinner'></span>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className='status-message success'>
            <span className='status-icon'>✅</span>
            <span>Message sent successfully! We'll get back to you soon.</span>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className='status-message error'>
            <span className='status-icon'>❌</span>
            <span>Failed to send message. Please try again or contact us directly.</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactFormComponent;
