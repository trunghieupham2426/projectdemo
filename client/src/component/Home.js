import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  //For fun 🤣
  const [joke, setJoke] = useState('');
  // 😂
  const [course, setCourse] = useState([]);
  const [status, setStatus] = useState('open');
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/classes/');
        setCourse(res.data.data);
      } catch (err) {
        console.log(err.response);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      const chuck = await axios.get('https://api.chucknorris.io/jokes/random');
      setJoke(chuck.data.value);
    }
    fetchData();
  }, []);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setStatus(value);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `http://127.0.0.1:5000/api/classes/?status=${status}`
    );
    setCourse(res.data.data);
  };

  const showClass = course.map((el) => {
    return (
      <>
        <tr>
          <td>{el.subject}</td>
          <td>{el.startDate}</td>
          <td>{el.endDate}</td>
          <td>{el.maxStudent}</td>
          <td>{el.currentStudent}</td>
          <td>{el.status}</td>
          <td>
            <Link to={`/classes/${el.id}`}>Detail</Link>
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      {isLoggedIn ? (
        <div>
          <form>
            <label>Choose a status:</label>
            <select name='status' onChange={onChangeHandler}>
              <option value='open'>open</option>
              <option value='pending'>pending</option>
              <option value='close'>close</option>
            </select>
            <button onClick={searchHandler}>Search</button>
          </form>
          <div className='home'>
            <table className='course'>
              <tr>
                <th>Subject</th>
                <th>Start date</th>
                <th>End Date</th>
                <th>Max Student</th>
                <th>Current Student</th>
                <th>Status</th>
                <th>View</th>
              </tr>
              {showClass}
            </table>
          </div>
        </div>
      ) : (
        <div className='fun'>
          <p
            style={{
              textAlign: 'center',
              fontSize: '18px',
              color: 'cornflowerblue',
              width: '50%',
              margin: 'auto',
            }}
          >
            🤣 {joke} 😉
          </p>
          <br />
          <Link to='/signin' className='joke'>
            Read More
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
