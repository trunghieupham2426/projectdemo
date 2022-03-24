import { useState } from 'react';
import axios from 'axios';

const CreateClass = () => {
  let iniState = {
    subject: '',
    maxStudent: '',
    startDate: '',
    endDate: '',
  };

  const [state, setState] = useState(iniState);
  const onChange = (e) => {
    const nameInput = e.target.name;
    const value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      [nameInput]: value,
    }));
  };

  const createClassHandler = async (e) => {
    e.preventDefault();
    try {
      const data = { ...state };
      const res = await axios.post(`http://127.0.0.1:5000/api/classes/`, data);
      if (res.data.status === 'success') {
        setState(iniState);
        alert('create class successfully');
      }
    } catch (err) {
      console.log(err.response);
      alert(err.response.data.message);
    }
  };

  return (
    <div className='createClass'>
      <div className='form'>
        <form onSubmit={createClassHandler}>
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
          <input type='submit' className='btn' value='Submit' />
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
