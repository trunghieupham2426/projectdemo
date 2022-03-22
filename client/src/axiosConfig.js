import axios from 'axios';

const data = localStorage.getItem('appState');
let accessToken;
if (data) {
  const { token } = JSON.parse(data);
  accessToken = token;
}
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axiosInstance;
