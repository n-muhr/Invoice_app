import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {
  clientReducer,
  profileReducer,
  invoiceReducer,
  productReducer,
} from './reducers';

const rootReducer = combineReducers({
  clientReducer,
  profileReducer,
  invoiceReducer,
  productReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
