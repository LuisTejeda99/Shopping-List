import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from '../src/reducers';


export default createStore(combineReducers({
    ...reducers
}), applyMiddleware(thunk));