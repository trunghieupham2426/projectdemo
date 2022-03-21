import './App.css';
import { withRouter } from 'react-router-dom';
import Header from './component/Header';

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default withRouter(App);
