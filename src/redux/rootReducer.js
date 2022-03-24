import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import clientReducer from './reducers';

const rootReducer = combineReducers({clientReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
