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
    send('service_ye4tcqg', 'template_18njl6h', toSend, 'emPxvqPK_UFrRPnwB')
      .then((response) => {
        setTimeout(() => {
          setSending(false);
          setToSend({ from_name: '', reply_to: '', message: '' });
          setSubmitMessage('Message sent!');
        }, 1000);
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch((err) => {
        setSending(false);
        setSubmitMessage('Sending message failed!!!');
        console.log('FAILED...', err);
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
