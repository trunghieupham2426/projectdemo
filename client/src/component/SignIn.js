import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const SignIn = (props) => {
  let iniState = {
    email: '',
    password: '',
  };
  const [state, setState] = useState(iniState);
  const dispatch = useDispatch();

  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      let data = {
        email: state.email,
        password: state.password,
      };
      const res = await axios.post(
        'http://127.0.0.1:5000/api/users/login',
        data
      );
      console.log(res);
      if (res.data.status === 'success') {
        dispatch({ type: 'LOGGED_IN' });
        localStorage.setItem('token', JSON.stringify(res.data.token));
        localStorage.setItem('role', res.data.data.user.role);
        props.history.push('/');
      }
    } catch (err) {
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
    <>
      <div className='form'>
        <form onSubmit={signinHandler}>
          <label>Email</label>
          <br />
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={onChange}
            value={state.email}
          />
          <br />
          <label>Password</label>
          <br />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={onChange}
            value={state.password}
          />
          <br />
          <input type='submit' className='btn' value='Login' />
        </form>
      </div>
    </>
  );
};

export default SignIn;
