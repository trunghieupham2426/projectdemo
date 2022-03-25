import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchData } from '../utils/helperFn';

const Home = () => {
  //For fun 🤣
  const [joke, setJoke] = useState('');
  // 😂
  const [course, setCourse] = useState([]);
  const [status, setStatus] = useState('open');
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  useEffect(() => {
    fetchData('/classes/?status=open,close,pending', setCourse);
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
    fetchData(`/classes/?status=${status}`, setCourse);
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
        <div className='viewClass'>
          <div className='choose'>
            <form>
              <label>Choose a status:</label>
              <select name='status' onChange={onChangeHandler}>
                <option value='open'>open</option>
                <option value='pending'>pending</option>
                <option value='close'>close</option>
              </select>
              <button onClick={searchHandler}>Search</button>
            </form>
          </div>
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
