import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers';
import thunkMiddleware from 'redux-thunk';

//glue
interface WindowExt extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
}

//only use if chrome redux devtools is installed
let w = window as WindowExt & typeof globalThis;
const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);
