import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetail = (props) => {
  const [joke, setJoke] = useState('');
  const [course, setCourse] = useState({});
  const [calendar, setCalendar] = useState([]);
  const { id } = useParams();

  const registerClass = async () => {
    try {
      const res = await axios.post('/classes/register', { classId: id });
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const chuck = await axios.get('https://api.chucknorris.io/jokes/random');
      setJoke(chuck.data.value);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/classes/calendar/?class=${id}`);
      setCourse(res.data.data);
      setCalendar(res.data.data.Calendars);
    }
    fetchData();
  }, []);

  const showCalendar = calendar.map((el) => {
    return (
      <>
        <tr>
          <td>{el.dayOfWeek}</td>
          <td>{el.openTime}</td>
          <td>{el.closeTime}</td>
        </tr>
      </>
    );
  });

  return (
    <div className='container' style={{ margin: 'auto', width: '80%' }}>
      <div className='class_detail'>
        <h2>
          Welcome to : <span style={{ color: 'red' }}>{course.subject}</span>{' '}
          course
        </h2>
        <p className='description'>{joke} 🤷‍♀️🤷‍♀️🤷‍♂️🤷‍♂️</p>
        <h2>What you'll learn</h2>
        <ul className='custom-li'>
          <li>Hack Nasa</li>
          <li>Make America Great Again - Donal Trump ❤</li>
          <li>Build Back Better - Joe Biden 😒😒</li>
          <li>I can do this all day - Captain America 🐱‍🐉</li>
        </ul>
        <p>
          Start date : <span style={{ color: 'red' }}>{course.startDate}</span>
        </p>
        <p>
          End date : <span style={{ color: 'red' }}>{course.endDate}</span>
        </p>
        <table className='course' style={{ marginLeft: '0' }}>
          <tr>
            <th>DAY OF WEEK</th>
            <th>OPEN TIME</th>
            <th>CLOSE TIME</th>
          </tr>
          {showCalendar}
        </table>
        <button
          className='joke'
          onClick={registerClass}
          style={{ marginTop: '20px', cursor: 'pointer' }}
        >
          REGISTER CLASS
        </button>
      </div>
    </div>
  );
};

export default ClassDetail;
