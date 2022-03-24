import { useState } from 'react';
import AllClass from './CLASS/AllClass';
import CreateClass from './CLASS/CreateClass';
const SideBar = () => {
  const [status, setStatus] = useState('viewClass');

  const setStatusHandler = (val) => {
    setStatus(val);
  };

  return (
    <div className='sidebar'>
      <ul>
        <li onClick={() => setStatusHandler('createClass')}>Create Class</li>
        <li onClick={() => setStatusHandler('viewClass')}>View All Class</li>
        <li onClick={() => setStatusHandler('viewUser')}>View User in Class</li>
        <li onClick={() => setStatusHandler('listRegis')}>List Registration</li>
      </ul>
      {
        {
          createClass: <CreateClass />,
          viewClass: <AllClass />,
        }[status]
      }
    </div>
  );
};

export default SideBar;
