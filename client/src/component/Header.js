import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const Header = (props) => {
  const [avatar, setAvatar] = useState(
    'https://res.cloudinary.com/dyw35assc/image/upload/v1644906261/DEV/default_gphmz1.png'
  );
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const logOutHandler = () => {
    window.location.reload();
    dispatch({ type: 'LOGGED_OUT' });
    localStorage.clear();
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://127.0.0.1:5000/api/users/getme');
      console.log(res);
      setAvatar(res.data.data.avatarPath);
    }
    fetchData();
  }, []);
  const renderNav = () => {
    if (isLoggedIn) {
      return (
        <>
          <li>
            <Link to='/myprofile'>Profile</Link>
          </li>
          <li>
            <Link to='/myclass'>My Class</Link>
          </li>
          <li onClick={logOutHandler}>
            <img
              src={avatar}
              alt='err'
              style={{ width: '20px', heigh: '20px' }}
            />
            <Link to='/'>Log Out</Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to='/signin'>Sign In</Link>
          </li>
          <li>
            <Link to='/signup'>Sign Up</Link>
          </li>
        </>
      );
    }
  };
  return (
    <div className='header'>
      <ul className='header-right'>
        <li>
          {' '}
          <Link className='active' to='/'>
            Home
          </Link>
        </li>
        {renderNav()}
      </ul>
    </div>
  );
};

export default Header;
