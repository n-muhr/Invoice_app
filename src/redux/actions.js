export const SET_CURR_CLIENT = 'SET_CURR_CLIENT';
export const SET_CURR_PROFILE = 'SET_CURR_PROFILE';
export const SET_INVOICE_CLIENT = 'SET_INVOICE_CLIENT';
export const SET_INVOICE_PROFILE = 'SET_INVOICE_PROFILE';
export const SET_CURR_INVOICE = 'SET_CURR_INVOICE';
export const SET__INVOICES = 'SET_INVOICES';
export const SET__PRODUKTS = 'SET_PRODUKTS';

export const setCurrentClient = currClient => dispatch => {
  dispatch({
    type: SET_CURR_CLIENT,
    payload: currClient,
  });
};

export const setCurrentProfile = currProfile => dispatch => {
  dispatch({
    type: SET_CURR_PROFILE,
    payload: currProfile,
  });
};

export const setCurrentInvoce = currInvoice => dispatch => {
  dispatch({
    type: SET_CURR_INVOICE,
    payload: currInvoice,
  });
};

export const setInvoces = InvoiceList => dispatch => {
  dispatch({
    type: SET__INVOICES,
    payload: InvoiceList,
  });
};

export const setInvoiceClient = invoiceClient => dispatch => {
  dispatch({
    type: SET_INVOICE_CLIENT,
    payload: invoiceClient,
  });
};

export const setInvoiceProfile = invoiceProfile => dispatch => {
  dispatch({
    type: SET_INVOICE_PROFILE,
    payload: invoiceProfile,
  });
};

export const setProducts = products => dispatch => {
  dispatch({
    type: SET_PRODUCTS,
    payload: products,
  });
};
