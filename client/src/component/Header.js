import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='header'>
      <div className='header-right'>
        <Link className='active' to='/'>
          Home
        </Link>
        <Link to='/myprofile'>Profile</Link>
        <Link to='/myclass'>My Class</Link>
        <Link to='/signin'>Sign In</Link>
      </div>
    </div>
  );
};

export default Header;
