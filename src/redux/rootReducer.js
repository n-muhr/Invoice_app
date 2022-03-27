import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {clientReducer, profileReducer, invoiceReducer} from './reducers';

const rootReducer = combineReducers({
  clientReducer,
  profileReducer,
  invoiceReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
