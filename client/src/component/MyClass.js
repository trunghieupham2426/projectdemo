import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchData } from '../utils/helperFn';

const MyClass = () => {
  const [myClass, setMyClass] = useState([]);
  useEffect(() => {
    fetchData('/classes/myClass', setMyClass);
  }, []);

  const cancelClass = async (id) => {
    try {
      const res = await axios.patch(`/classes/${id}/cancel`);
      window.location.reload();
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const showMyClass = myClass.map((el) => {
    return (
      <tr>
        <td>{el.Class.subject}</td>
        <td>{el.Class.startDate}</td>
        <td>{el.Class.endDate}</td>
        <td>{el.status}</td>
        <td>{el.regisDate}</td>
        <td>
          <button
            disabled={el.status === 'cancel'}
            onClick={() => cancelClass(el.Class.id)}
          >
            cancel
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <table className='myclass'>
        <tr>
          <th>Subject</th>
          <th>Start date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Registered Date</th>
          <th>Action</th>
        </tr>
        {showMyClass}
      </table>
    </div>
  );
};

export default MyClass;
