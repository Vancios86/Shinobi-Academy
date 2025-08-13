import './ContactFormComponent.css';
import { useState } from 'react';
import { send } from 'emailjs-com';

const ContactFormComponent = () => {
  const [submitMessage, setSubmitMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [toSend, setToSend] = useState({
    from_name: '',
    reply_to: '',
    message: '',
  });

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    send('service_mtav7vb', 'template_okhram8', toSend, 'YLAsSYEnWm66148GH')
      .then((response) => {
        setSubmitMessage('Message sent successfully!');
        setSending(false);
        setToSend({ name: '', email: '', message: '' });
      })
      .catch((err) => {
        setSubmitMessage('Failed to send message. Please try again.');
        setSending(false);
      });
  }

  return (
    <div className='contact-form'>
      <div className='contact-form-title flex'>Send us a message</div>

      <form className='shadowed-box' onSubmit={handleSubmit}>
        <input
          type='text'
          name='from_name'
          id='name'
          placeholder='your name'
          value={toSend.from_name}
          onChange={handleChange}
          required
        />

        <input
          type='email'
          name='reply_to'
          id='email'
          placeholder='email'
          value={toSend.reply_to}
          onChange={handleChange}
          required
        />

        <textarea
          type='text'
          name='message'
          id='message'
          placeholder='your message'
          rows={4}
          value={toSend.message}
          onChange={handleChange}
          required
        />
        <br />

        <button
          type='submit'
          name='send-message'
          id='send-message'
          className='button-large'
        >
          Send
        </button>

        <>{sending && <p>Sending...</p>}</>
        <>
          {submitMessage === 'Message sent!' ? (
            <p style={{ color: 'green' }}>{submitMessage}</p>
          ) : (
            <p style={{ color: 'red' }}>{submitMessage}</p>
          )}
        </>
      </form>
    </div>
  );
};

export default ContactFormComponent;
