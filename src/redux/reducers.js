import {SET_CLIENT} from './actions';

const initialState = {
  client: {
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
    case SET_CLIENT:
      return {...state, client: action.payload};
    default:
      return state;
  }
}

export default clientReducer;
