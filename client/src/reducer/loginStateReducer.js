const isLoggedIn = false;

const loginStateReducer = (state = isLoggedIn, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return (state = !state);
    case 'LOGGED_OUT':
      return (state = !state);

    default:
      return state;
  }
};

export default loginStateReducer;
