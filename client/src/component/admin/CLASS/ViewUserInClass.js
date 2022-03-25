import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchData } from '../../../utils/helperFn';
const ViewUserInClass = () => {
  const [course, setCourse] = useState([]);
  const [id, setId] = useState('');
  const getId = (val) => {
    setId(val);
  };
  useEffect(() => {
    fetchData('/classes/?status=open,close', setCourse);
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
          <td onClick={() => getId(el.id)} style={{ cursor: 'pointer' }}>
            View
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      <div className='viewClass' style={{ flex: '1.3' }}>
        <div className='home'>
          <table
            className='course'
            style={{ width: '100%', marginLeft: 0, marginTop: '50px' }}
          >
            <tr>
              <th>Subject</th>
              <th>Start date</th>
              <th>End Date</th>
              <th>Max Student</th>
              <th>Current Student</th>
              <th>Status</th>
              <th>View Student</th>
            </tr>
            {showClass}
          </table>
        </div>
      </div>
      <ViewUser id={id} />
    </>
  );
};

const ViewUser = (props) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchData(`/classes/viewUser/${props.id}`, setUsers, 'Users');
  }, [props.id]);

  const showUser = users.map((el) => {
    return (
      <>
        <tr>
          <td>{el.email}</td>
          <td>{el.username}</td>
          <td>{el.age}</td>
          <td>{el.phone}</td>
          <td>{el.Regis.status}</td>
        </tr>
      </>
    );
  });

  return (
    <>
      <div className='viewClass'>
        <div className='home'>
          <table
            className='course'
            style={{ width: '76%', marginRight: '50px', marginTop: '50px' }}
          >
            <tr>
              <th>Email</th>
              <th>Student Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Regis Status</th>
            </tr>
            {showUser}
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewUserInClass;
