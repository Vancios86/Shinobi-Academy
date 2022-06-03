import Header from '../../Header/Header';
import './PageLayout.css';

const PageLayout = () => {
  return (
    <div className='page-layout'>
      <Header />
      <div className='page-content'></div>
    </div>
  );
};

export default PageLayout;
