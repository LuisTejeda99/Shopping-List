import { AsyncStorage } from 'react-native';
import {makeType, mac, createReducer} from '../boilerplate/helpers';

const initialState = [];

const t = makeType('products');

//makeType
const FETCH = t('fetch');
const SAVE = t('insert');
const UPDATE = t('update');
const DELETE = t('delete');
const DELETE_MANY = t('delete-many')
const DELETE_ALL = t('delete-all');
const COMPLETE = t('complete');
const ORDER = t('order');

//actionCreator
const fetchAction = mac(FETCH, 'payload');
const saveAction = mac(SAVE,'payload');
const updateAction = mac(UPDATE,'payload','desc');
const deleteAction = mac(DELETE,'payload');
const deleteManyAction = mac(DELETE_MANY,'payload');
const deleteAllAction = mac(DELETE_ALL, 'payload');
const completeAction = mac(COMPLETE,'payload');
const orderAction = mac(ORDER, 'payload');

export const fetchProducts = (key) => {
    return async dispatch => {
        try {
            let data = null;
            data = await AsyncStorage.getItem(key) || '[]';
            data = JSON.parse(data);
            dispatch(fetchAction(data));
            // AsyncStorage.removeItem(key);
        }
        catch(e){
            console.log(e)
        }
    }
}

export const saveProduct = (key, product) => {
    return async dispatch => {
        try{
            let data = null;
            let current = null;
            data = await AsyncStorage.getItem(key) || '[]';
            data = JSON.parse(data);
            current = [product, ...data];
            AsyncStorage.setItem(key, JSON.stringify(current));
            dispatch(saveAction(product));
            
        }catch(e){
            console.log(e)
        }
    }
}

export const updateProduct = (key, id, product) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.map(x => x.id === id ? ({...x, desc: product}) : x);
            AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(updateAction(id, product));
        }catch(e){
            console.log(e)
        }
    }
}

export const deleteProduct = (key, id) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.filter(x => x.id !== id && x);
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(deleteAction(id));
        }catch(e){
            console.log(e)
        }
    }
}

export const deleteManyProducts = (key, data) => {
    return async (dispatch) => {
        try{
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(data)));
            dispatch(deleteManyAction(data));
        }catch(e){
            console.log(e)
        }
    }
}

export const deleteAllProducts = (key, listId) => {
    return async (dispatch) => {
        try{
            let data = null;
            data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.filter(x => x.listId !== listId && x);
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(deleteAllAction(result));
        }catch(e){
            console.log(e)
        }
    }
}

export const completeProduct = (key, id) => {
    return async (dispatch) => {
        try{
            let data = null;
            data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.map(x => x.id === id ? ({...x, completed: !x.completed }) : x);
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(completeAction(id));
        }catch(e){
            console.log(e)
        }
    }
}

export const orderProducts = (key) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.sort((a, b) => a.desc.localeCompare(b.desc));
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(orderAction(result));
        }catch(e){
            console.log(e)
        }
    }
}

//pure actions
const fetchProductReduce = (state, action) => action.payload;
const saveProductReduce = (state, action) => ([action.payload,...state]);
const updateProductReduce = (state, action) => state.map(x => x.id === action.payload ? ({...x, desc: action.desc}) : x);
const deleteProductReduce = (state, action) => state.filter(x => x.id !== action.payload && x);
const completeProductReduce = (state, action) => state.map(x => x.id === action.payload ? ({...x, completed: !x.completed}) : x);
const orderProductReduce = (state, action) => action.payload;
const deleteManyProductReduce = (state, action) => action.payload;
const deleteAllReduce = (state, action) => action.payload;

//reducer
export default createReducer(initialState, {
    [FETCH]: fetchProductReduce,
    [SAVE]: saveProductReduce,
    [UPDATE]: updateProductReduce,
    [DELETE]: deleteProductReduce,
    [DELETE_MANY]: deleteManyProductReduce,
    [COMPLETE]: completeProductReduce,
    [ORDER]: orderProductReduce,
    [DELETE_ALL]: deleteAllReduce,
})