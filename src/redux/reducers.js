import {
  SET_CURR_CLIENT,
  SET_CURR_PROFILE,
  SET_CURR_INVOICE,
  SET_INVOICE_CLIENT,
  SET_INVOICE_PROFILE,
  SET_INVOICES,
  SET_PRODUCTS,
  SET_COPY_INV,
  SET_USER,
} from './actions';

const initialStateClient = {
  currClient: {
    id: -1,
    name: '',
    email: '',
    address: '',
    descriptive_number: '',
    city: '',
    ico: '',
    dic: '',
    description: '',
    user_id: -1,
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
    account: '',
    court: '',
    section: '',
    part: '',
    user_id: -1,
  },
};

const initialStateInvoice = {
  invoiceClient: -1,
  invoiceProfile: -1,
  currInvoice: {
    id: -1,
    date_of_issue: '',
    due_date: '',
    taxable_supply: '',
    payed: 0,
    payment_method: '',
    paid: false,
    client_id: -1,
    profile_id: -1,
    note: '',
    is_storno: false,
    invoice_number: '',
    user_id: -1,
  },
  invoiceList: [],
  invoiceCopy: -1,
  currUser: {id: -1, name: '', email: ''},
};

const initialStateProduct = {
  id: -1,
  invoice_id: -1,
  description: '',
  price: '',
  quantity: '',
  dph: '',
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

export const productReducer = (state = initialStateProduct, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {...state, products: action.payload};
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
    case SET_INVOICES:
      return {...state, invoiceList: action.payload};
    case SET_COPY_INV:
      return {...state, invoiceCopy: action.payload};
    case SET_USER:
      return {...state, currUser: action.payload};
    default:
      return state;
  }
};
