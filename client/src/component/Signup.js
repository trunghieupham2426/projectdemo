import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='signup'>
      <form>
        <input type='email' placeholder='Email' name='email' />
        <input type='username' placeholder='Username' name='username' />
        <input type='password' placeholder='Password' name='password' />
        <button type='submit' className='btn'>
          Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
