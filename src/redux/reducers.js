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
    descriptive_number: '',
    description: '',
    ICO: '',
    DIC: '',
    pays_dph: false,
    city: '',
  },
};

const initialStateInvoice = {
  invoiceClient: -1,
  invoiceProfile: -1,
  currInvoice: {
    id: -1,
    date_of_issue: '',
    due_date: '',
    invoice_number: '',
    taxable_supply: '',
    total_cost: '',
    payment_method: '',
  },
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
      return {...state, invoiceClient: action.payload};
    case SET_INVOICE_PROFILE:
      return {...state, invoiceProfile: action.payload};
    default:
      return state;
  }
};
