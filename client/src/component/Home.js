import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [course, setCourse] = useState([]);
  const data = localStorage.getItem('appState');
  let accessToken;
  if (data) {
    const { token } = JSON.parse(data);
    accessToken = token;
  }
  let config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          'http://127.0.0.1:5000/api/classes/',
          config
        );
        setCourse(res.data.data);
      } catch (err) {
        console.log(err.response);
      }
    }
    fetchData();
  }, []);

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
    <div className='home'>
      <table className='course'>
        {course.length === 0 ? (
          <p style={{ color: 'red', fontSize: '50px' }}>
            Please Login To See Class
          </p>
        ) : (
          <tr>
            <th>Subject</th>
            <th>Start date</th>
            <th>End Date</th>
            <th>Max Student</th>
            <th>Current Student</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        )}
        {showClass}
      </table>
    </div>
  );
};

export default Home;
