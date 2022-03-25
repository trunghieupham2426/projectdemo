import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchData } from '../utils/helperFn';

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [changePwd, setChangePwd] = useState({});

  useEffect(() => {
    fetchData('/users/getme', setProfile);
  }, []);

  const handleInput = (e) => {
    const nameInput = e.target.name;
    const value = e.target.value;
    const data = { ...profile };
    data[nameInput] = value;
    if (e.target.files) {
      data.avatar = e.target.files[0];
    }
    setProfile((preState) => ({
      ...preState,
      ...data,
    }));
  };
  const passwordOnchange = (e) => {
    setChangePwd((preState) => ({
      ...preState,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    let url = '/users/updateMe';
    const formData = new FormData();
    formData.append('age', profile.age);
    formData.append('phone', profile.phone);
    if (profile.avatar) {
      formData.append('avatar', profile.avatar);
    }
    try {
      await axios.patch(url, formData);
      window.location.reload();
      alert('update successfully');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    let url = '/users/updateMyPassword';
    try {
      await axios.patch(url, changePwd);
      window.location.reload();
      alert('update successfully');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <div className='form'>
        <form onSubmit={updateProfile}>
          <label>Email</label>
          <br />
          <input type='text' name='email' value={profile.email} disabled />
          <br />
          <label>User Name</label>
          <br />
          <input
            type='text'
            name='username'
            value={profile.username}
            disabled
          />
          <br />
          <label>AGE</label>
          <br />
          <input
            type='text'
            name='age'
            placeholder='Your age ...'
            value={profile.age}
            onChange={handleInput}
          />
          <br />
          <label>PHONE</label>
          <br />
          <input
            type='text'
            name='phone'
            placeholder='Your phone ...'
            value={profile.phone}
            onChange={handleInput}
          />
          <br />

          <label>Select a photo :</label>
          <br />
          <input type='file' name='avatar' onChange={handleInput} />
          <br />

          <input type='submit' value='Update Profile' />
        </form>
      </div>
      <div className='form'>
        <form className='updatePassword' onSubmit={updatePassword}>
          <label>Old Password</label>
          <br />
          <input
            type='password'
            name='oldPwd'
            onChange={passwordOnchange}
            value={changePwd.oldPwd}
          />
          <br />
          <label>New Password</label>
          <br />
          <input
            type='password'
            name='newPwd'
            onChange={passwordOnchange}
            value={changePwd.newPwd}
          />
          <br />
          <input type='submit' value='Update Password' />
        </form>
      </div>
    </>
  );
};

export default MyProfile;
