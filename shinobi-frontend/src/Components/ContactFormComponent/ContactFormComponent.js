import './ContactFormComponent.css';

const ContactFormComponent = () => {
  return (
    <div className='contact-form'>
      <div className='contact-form-title flex'>Send us a message</div>
      <form className='shadowed-box' action=''>
        <input type='text' name='name' id='name' placeholder='your name' />
        <br />
        <input type='email' name='email' id='email' placeholder='email' />
        <br />
        <textarea
          type='text'
          name='message'
          id='message'
          placeholder='your message'
        />
        <br />
        <input
          type='button'
          name='send-message'
          id='send-message'
          value='send'
          className='button-large'
        />
      </form>
    </div>
  );
};

export default ContactFormComponent;
