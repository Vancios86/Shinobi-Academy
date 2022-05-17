import "./Footer.css";

const Footer = () => {
  return (
    <div className='footer container flex bg-red text-light'>
      <div className='contact flex fs-300'>
        <ul>
          <li>Phone: 077777777</li>
          <li>Email: colinbyrne@mail.com</li>
          <li>Address: Rua xxxxx nr15</li>
        </ul>
      </div>
      <div className='map text-dark'>map</div>
    </div>
  );
};

export default Footer;