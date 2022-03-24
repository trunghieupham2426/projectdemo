import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateClass = (props) => {
  // console.log(props);
  let iniState = {
    subject: '',
    maxStudent: '',
    startDate: '',
    endDate: '',
    status: '',
  };

  const [state, setState] = useState(iniState);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/classes/${props.id}`
      );
      // console.log(res);
      setState((prevState) => ({
        ...prevState,
        subject: res.data.data.subject,
        maxStudent: res.data.data.maxStudent,
        startDate: res.data.data.startDate,
        endDate: res.data.data.endDate,
        status: res.data.data.status,
      }));
    }
    fetchData();
  }, [props.id]);

  const onChange = (e) => {
    const nameInput = e.target.name;
    const value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      [nameInput]: value,
    }));
  };

  const updateClassHandler = async (e) => {
    e.preventDefault();
    try {
      const data = { ...state };
      const res = await axios.patch(
        `http://127.0.0.1:5000/api/classes/${props.id}`,
        data
      );
      if (res.data.status === 'success') {
        window.location.reload();
        alert('update class successfully');
      }
    } catch (err) {
      // console.log(err.response);
      alert(err.response.data.message);
    }
  };

  return (
    <div className='updateClass'>
      <div className='form'>
        <form onSubmit={updateClassHandler}>
          <label>Subject</label>
          <br />
          <input
            type='text'
            placeholder='Subject'
            name='subject'
            onChange={onChange}
            value={state.subject}
          />
          <br />
          <label>Max Student</label>
          <br />
          <input
            type='text'
            placeholder='Max student'
            name='maxStudent'
            onChange={onChange}
            value={state.maxStudent}
          />
          <br />
          <label>Start Date</label>
          <br />
          <input
            type='date'
            name='startDate'
            onChange={onChange}
            value={state.startDate}
          />
          <br />
          <label>End Date</label>
          <br />
          <input
            type='date'
            name='endDate'
            onChange={onChange}
            value={state.endDate}
          />
          <br />
          <label>Status</label>
          <br />
          <input
            type='text'
            name='status'
            onChange={onChange}
            value={state.status}
          />
          <br />
          <input type='submit' className='btn' value='Update Class' />
        </form>
      </div>
    </div>
  );
};

export default UpdateClass;
