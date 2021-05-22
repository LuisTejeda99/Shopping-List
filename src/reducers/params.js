import {makeType,mac,createReducer} from '../boilerplate/helpers';
import {AsyncStorage} from 'react-native';

const initialState = [];

const t = makeType('params');

const FETCH = t('fetch');
const SAVE = t('save');
const UPDATE = t('update');
const DELETE = t('delete');

const fetchParamAction = mac(FETCH,'payload')
const saveParamAction = mac(SAVE, 'payload');
const updateParamAction = mac(UPDATE, 'payload', 'id');
const deleteParamAction = mac(DELETE, 'payload');

export const fetchParams = (key) => {
    return async dispatch => {
        try {
            let data = null;
            data = await AsyncStorage.getItem(key) || '[]';
            data = JSON.parse(data);
            dispatch(fetchParamAction(data));
            // AsyncStorage.removeItem(key);
        }
        catch(e){
            console.log(e)
        }
    }
}

export const saveParam = (key, param) => {
    return async dispatch => {
        try{
            let current = null;
            let data = await AsyncStorage.getItem(key) || '[]';
            data = JSON.parse(data);
            current = [param, ...data];
            AsyncStorage.setItem(key, JSON.stringify(current));
            dispatch(saveParamAction(param));
        }catch(e){
            console.log(e)
        }
    }
}

export const updateParam = (key, id, param) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.map(x => x.id === id ? ({...x, ...param}) : x);
            AsyncStorage.removeItem(key).then(() => AsyncStorage.setItem(key, JSON.stringify(result)));
            dispatch(updateParamAction(param, id));
        }catch(e){
            console.log(e)
        }
    }
}

export const deleteParam = (key, id) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.filter(x => x.id !== id && x);
            AsyncStorage.removeItem(key);
            AsyncStorage.setItem(key, JSON.stringify(result));
            dispatch(deleteParamAction(id));
        }catch(e){
            console.log(e)
        }
    }
}

const fetchParamReducer = (state, action) => action.payload;
const saveParamReducer = (state, action) => ([action.payload, ...state]);
const updateParamReducer = (state, action) => state.map(x => x.id === action.id ? ({...x, ...action.payload}) : x);
const deleteParamReducer = (state, action) => state.filter(x => x.id !== action.payload && x);

export default createReducer(initialState, {
    [FETCH]: fetchParamReducer,
    [UPDATE]: updateParamReducer,
    [SAVE]: saveParamReducer,
    [DELETE]: deleteParamReducer,
})