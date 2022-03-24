import './App.css';
import { withRouter } from 'react-router-dom';
import Header from './component/Header';
import SideBar from './component/admin/SideBar';

function App(props) {
  const pathName = props.location.pathname;

  return (
    <>
      <div>
        <div className='menu'>
          <Header />
        </div>
      </div>
      <div>{pathName.includes('/myadmin') ? <SideBar /> : ''}</div>
    </>
  );
}

export default withRouter(App);
