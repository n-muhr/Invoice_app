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
  currProfile: {
    id: -1,
    name: '',
    email: '',
    address: '',
    description: '',
    ICO: '',
    DIC: '',
    pays_dph: false,
    descriptive_number: '',
    city: '',
  },
};

const initialStateInvoice = {
  currInvoice: {
    id: -1,
    date_of_issue: '',
    due_date: '',
    invoice_number: '',
    taxable_supply: '',
    total_cost: '',
    payment_method: '',
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
