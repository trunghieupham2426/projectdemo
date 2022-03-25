import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateClass from './UpdateClass';
import { fetchData } from '../../../utils/helperFn';
const AllClass = () => {
  const [course, setCourse] = useState([]);
  const [status, setStatus] = useState('open');
  const [id, setId] = useState('');
  const getId = (val) => {
    setId(val);
  };
  useEffect(() => {
    fetchData('/classes/?status=open,close,pending', setCourse);
  }, []);

  const filterHandler = (e) => {
    const value = e.target.value;
    setStatus(value);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    fetchData(`/classes/?status=${status}`, setCourse);
  };

  const deleteClass = async (id) => {
    try {
      await axios.delete(`/classes/${id}`);
      window.location.reload();
      alert('delete class successfully');
    } catch (err) {
      console.log(err.response);
      alert(err.response.data.message);
    }
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
          <td onClick={() => getId(el.id)} style={{ cursor: 'pointer' }}>
            Edit
          </td>
          <td onClick={() => deleteClass(el.id)} style={{ cursor: 'pointer' }}>
            Delete
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      <div className='viewClass'>
        <div className='choose'>
          <form>
            <label>Choose a status:</label>
            <select name='status' onChange={filterHandler}>
              <option value='open'>open</option>
              <option value='pending'>pending</option>
              <option value='close'>close</option>
              <option value='open,close,pending'>all</option>
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
            </tr>
            {showClass}
          </table>
        </div>
      </div>
      <UpdateClass id={id} />
    </>
  );
};

export default AllClass;
