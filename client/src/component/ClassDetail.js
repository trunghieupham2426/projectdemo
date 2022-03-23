import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetail = (props) => {
  const [course, setCourse] = useState({});
  const [calendar, setCalendar] = useState([]);
  const { id } = useParams();

  const registerClass = async () => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:5000/api/classes/register',
        { classId: id }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/classes/calendar/?class=${id}`
        );
        setCourse(res.data.data);
        setCalendar(res.data.data.Calendars);
      } catch (err) {
        // console.log(err.response);
      }
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
    <div className='class_detail'>
      <h2>KHOA HOC {course.subject}</h2>
      <p>start date : {course.startDate}</p>
      <p>end date : {course.endDate}</p>
      <table className='calendar'>
        <tr>
          <th>DAY OF WEEK</th>
          <th>OPEN TIME</th>
          <th>CLOSE TIME</th>
        </tr>
        {showCalendar}
      </table>
      <button onClick={registerClass}>REGISTER CLASS</button>
    </div>
  );
};

export default ClassDetail;
