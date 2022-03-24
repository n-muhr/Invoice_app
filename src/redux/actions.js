export const SET_CLIENT = 'SET_CLIENT';

export const setCurrentClient = client => dispatch => {
  dispatch({
    type: SET_CLIENT,
    payload: client,
  });
};
