import {
  SET_CURR_CLIENT,
  SET_CURR_PROFILE,
  SET_CURR_INVOICE,
  SET_INVOICE_CLIENT,
  SET_INVOICE_PROFILE,
} from './actions';

const initialStateClient = {
  currClient: {
    id: -1,
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  },
};

const initialStateProfile = {
  currClient: {
    id: -1,
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  },
};

const initialStateInvoice = {
  currInvoice: {
    id: -1,
    client_id: '',
    profil_id: '',
    paid: false,
    pay_until: '',
  },
  invoceClient: -1,
  invoiceProfile: -1,
};

export const clientReducer = (state = initialStateClient, action) => {
  switch (action.type) {
    case SET_CURR_CLIENT:
      return {...state, currClient: action.payload};
    default:
      return state;
  }
};

export const profileReducer = (state = initialStateProfile, action) => {
  switch (action.type) {
    case SET_CURR_PROFILE:
      return {...state, currProfile: action.payload};
    default:
      return state;
  }
};

export const invoiceReducer = (state = initialStateInvoice, action) => {
  switch (action.type) {
    case SET_CURR_INVOICE:
      return {...state, currInvoice: action.payload};
    case SET_INVOICE_CLIENT:
      return {...state, invoceClient: action.payload};
    case SET_INVOICE_PROFILE:
      return {...state, invoceProfile: action.payload};
    default:
      return state;
  }
};
