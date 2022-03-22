import { combineReducers } from 'redux';
import loginStateReducer from './loginStateReducer';

const rootReducer = combineReducers({
  isLoggedIn: loginStateReducer,
});

export default rootReducer;
