export const SET_CURR_CLIENT = 'SET_CURR_CLIENT';

export const setCurrentClient = currClient => dispatch => {
  dispatch({
    type: SET_CURR_CLIENT,
    payload: currClient,
  });
};
