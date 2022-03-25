import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchData } from '../../../utils/helperFn';

const ListRegistration = () => {
  const [action, setAction] = useState('');
  const [filter, setFilter] = useState('accept');
  const [listRegis, setListRegis] = useState([]);

  useEffect(() => {
    fetchData('/classes/listRegistered', setListRegis);
  }, [action]);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setAction(value);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const url = `/classes/listRegistered?action=${filter}`;
    fetchData(url, setListRegis);
  };

  const submitActionHandler = async (classId, userId, action) => {
    try {
      await axios.put('/classes/admin/submit', {
        classId,
        userId,
        action,
      });
      setAction('');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const showListRegis = listRegis.map((el) => {
    return (
      <>
        <tr>
          <td>{el.classId}</td>
          <td>{el.userId}</td>
          <td>{el.status}</td>
          <td>{el.regisDate}</td>
          <td>{el.admAction}</td>
          <td>
            <form>
              <select
                name='action'
                onChange={onChangeHandler}
                disabled={el.admAction || el.status === 'cancel'}
              >
                <option value=''>Choose Action</option>
                <option value='accept'>Accept</option>
                <option value='reject'>Reject</option>
              </select>
            </form>
          </td>
          <td>
            <button
              disabled={el.admAction || el.status === 'cancel'}
              onClick={() => submitActionHandler(el.classId, el.userId, action)}
            >
              Submit
            </button>
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
            <select name='action' onChange={(e) => setFilter(e.target.value)}>
              <option value='accept'>Accept</option>
              <option value='reject'>Reject</option>
            </select>
            <button onClick={searchHandler}>Search</button>
          </form>
        </div>
        <div className='home'>
          <table className='course'>
            <tr>
              <th>Class Id</th>
              <th>User Id</th>
              <th>Status</th>
              <th>Regis Date</th>
              <th>Action</th>
              <th>Choose Action</th>
            </tr>
            {showListRegis}
          </table>
        </div>
      </div>
    </>
  );
};

export default ListRegistration;
