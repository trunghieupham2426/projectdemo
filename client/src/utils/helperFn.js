import axios from 'axios';

export const fetchData = async (url, cb, field) => {
  try {
    const res = await axios.get(url);
    if (field) {
      cb(res.data.data[field]);
    } else {
      cb(res.data.data);
    }

    return res;
  } catch (err) {
    console.log(err.response);
  }
};
