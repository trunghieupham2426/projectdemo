import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './component/Home';
import SignUp from './component/Signup';
import SignIn from './component/SignIn';
import ClassDetail from './component/ClassDetail';
import MyClass from './component/MyClass';
import MyProfile from './component/MyProfile';
import MyAdmin from './component/admin/MyAdmin';
import axios from 'axios';
// redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { saveToLocalStorage, loadFromLocalStorage } from './saveState';
import rootReducer from './reducer/rootReducer';
const persistedState = loadFromLocalStorage('stateInRedux');
const store = createStore(rootReducer, persistedState);
store.subscribe(() => saveToLocalStorage('stateInRedux', store.getState()));

axios.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = JSON.parse(localStorage.getItem('token'));

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/signup' component={SignUp} />
          <Route path='/signin' exact component={SignIn} />
          <Route path='/myclass' exact component={MyClass} />
          <Route path='/myprofile' exact component={MyProfile} />
          <Route path='/myadmin' exact component={MyAdmin} />
          <Route path='/classes/:id' exact component={ClassDetail} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
