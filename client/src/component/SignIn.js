import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className='signin'>
      <form>
        <input type='email' placeholder='Email' name='email' />
        <input type='password' placeholder='Password' name='password' />
        <button type='submit' className='btn'>
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
