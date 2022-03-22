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
      // console.log(res);
      if (res.data.status === 'success') {
        let auth = {
          token: res.data.token,
          user: res.data.data.user,
        };
        dispatch({ type: 'LOGGED_IN' });
        localStorage.setItem('appState', JSON.stringify(auth));
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
    <div className='signin'>
      <div>LOGIN</div>
      <form>
        <input
          type='email'
          placeholder='Email'
          name='email'
          onChange={onChange}
          value={state.email}
        />
        <input
          type='password'
          placeholder='Password'
          name='password'
          onChange={onChange}
          value={state.password}
        />
        <button type='submit' className='btn' onClick={signinHandler}>
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
