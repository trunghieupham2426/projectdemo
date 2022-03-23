import { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const initState = {
    user: {
      avatar: null,
      oldPwd: '',
      newPwd: '',
    },
  };
  const [profile, setProfile] = useState(initState);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://127.0.0.1:5000/api/users/getme');

      setProfile((preState) => ({
        ...preState,
        user: {
          age: res.data.data.age,
          phone: res.data.data.phone,
          email: res.data.data.email,
          username: res.data.data.username,
        },
      }));
    }
    fetchData();
  }, []);
  const handleInput = (e) => {
    // console.log(e.target.files[0]);
    const nameInput = e.target.name;
    const value = e.target.value;
    let userProfile = { ...profile.user };
    userProfile[nameInput] = value;
    if (e.target.files) {
      userProfile.avatar = e.target.files[0];
    }
    setProfile((preState) => ({
      ...preState,
      user: userProfile,
    }));
  };
  const updateProfile = (e) => {
    e.preventDefault();
    let url = 'http://127.0.0.1:5000/api/users/updateMe';
    const formData = new FormData();
    const avatar = profile.user.avatar;
    formData.append('age', profile.user.age);
    formData.append('phone', profile.user.phone);
    if (avatar) {
      formData.append('avatar', profile.user.avatar);
    }
    axios
      .patch(url, formData)
      .then((res) => {
        window.location.reload();
        alert('update successfully');
      })
      .catch((err) => {
        // console.log(err.response);

        alert(err.response.data.message);
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    let url = 'http://127.0.0.1:5000/api/users/updateMyPassword';
    const data = {
      oldPwd: profile.user.oldPwd,
      newPwd: profile.user.newPwd,
    };
    axios
      .patch(url, data)
      .then((res) => {
        window.location.reload();
        alert('update successfully');
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <>
      <div className='form'>
        <form onSubmit={updateProfile}>
          <label>Email</label>
          <br />
          <input type='text' name='email' value={profile.user.email} disabled />
          <br />
          <label>User Name</label>
          <br />
          <input
            type='text'
            name='username'
            value={profile.user.username}
            disabled
          />
          <br />
          <label>AGE</label>
          <br />
          <input
            type='text'
            name='age'
            placeholder='Your age ...'
            value={profile.user.age}
            onChange={handleInput}
          />
          <br />
          <label>PHONE</label>
          <br />
          <input
            type='text'
            name='phone'
            placeholder='Your phone ...'
            value={profile.user.phone}
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
            onChange={handleInput}
            value={profile.user.oldPwd}
          />
          <br />
          <label>New Password</label>
          <br />
          <input
            type='password'
            name='newPwd'
            onChange={handleInput}
            value={profile.user.newPwd}
          />
          <br />
          <input type='submit' value='Update Password' />
        </form>
      </div>
    </>
  );
};

export default MyProfile;
