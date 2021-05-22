import React from "react";
import { Provider } from "react-redux";
import App from "./src";
import store from "./src/store";
import {fetchLists} from './src/reducers/todos';
import {fetchParams} from './src/reducers/params';
import {fetchProducts} from './src/reducers/products';

store.dispatch(fetchLists('lists'));
store.dispatch(fetchParams('params'));
store.dispatch(fetchProducts('products'));

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};