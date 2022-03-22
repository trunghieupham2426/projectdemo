import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Header = (props) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const logOutHandler = () => {
    window.location.reload();
    dispatch({ type: 'LOGGED_OUT' });
    localStorage.clear();
  };
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
