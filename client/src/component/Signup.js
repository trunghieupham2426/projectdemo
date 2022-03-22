import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  let iniState = {
    email: '',
    password: '',
    username: '',
  };
  const [state, setState] = useState(iniState);
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      let data = {
        email: state.email,
        password: state.password,
        username: state.username,
      };
      const res = await axios.post(
        'http://127.0.0.1:5000/api/users/signup',
        data
      );
      if (res.data.status === 'success') {
        setState((prevState) => ({
          ...prevState,
          email: '',
          password: '',
          username: '',
        }));
        alert('please check your email to verify account');
      }
    } catch (err) {
      console.log(err.response);
      alert(err.response.data.message);
    }
  };
  const onChange = (e) => {
    const nameInput = e.target.name;
    const value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      [nameInput]: value,
    }));
  };

  return (
    <div className='signup'>
      <div>Register</div>
      <form>
        <input
          type='email'
          placeholder='Email'
          name='email'
          onChange={onChange}
          value={state.email}
        />
        <input
          type='username'
          placeholder='Username'
          name='username'
          onChange={onChange}
          value={state.username}
        />
        <input
          type='password'
          placeholder='Password'
          name='password'
          onChange={onChange}
          value={state.password}
        />
        <button type='submit' className='btn' onClick={signupHandler}>
          Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
