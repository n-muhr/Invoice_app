import {SET_CURR_CLIENT} from './actions';

const initialState = {
  currClient: {
    id: -1,
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  },
};

function clientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURR_CLIENT:
      return {...state, currClient: action.payload};
    default:
      return state;
  }
}

export default clientReducer;
