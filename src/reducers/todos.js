import {makeType,mac,createReducer} from '../boilerplate/helpers';
import {AsyncStorage} from 'react-native';

const initialState = []

const t = makeType('todos');

//makeType

const FETCH = t('fetch')
const SAVE = t('insert');
const UPDATE = t('update');
const DELETE = t('delete');

//actionCreator
const saveAction = mac(SAVE,'payload');
const updateAction = mac(UPDATE,'payload','id');
const deleteAction = mac(DELETE,'payload');
const fetchAction = mac(FETCH, 'payload');

//Traer datos al estado
export const fetchLists = (key) => {
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

export const saveList = (key, list) => {
    return async dispatch => {
        try{
            let current = null;
            let data = await AsyncStorage.getItem(key) || '[]';
            data = JSON.parse(data);
            current = [list, ...data];
            AsyncStorage.setItem(key, JSON.stringify(current));
            dispatch(saveAction(list));
        }catch(e){
            console.log(e)
        }
    }
}

export const updateList = (key, id,todo) => {
    return async (dispatch) => {
        try{
            let data = await AsyncStorage.getItem(key);
            data = JSON.parse(data);
            const result = data.map(x => x.id === id ? ({...x, ...todo}) : x);
            AsyncStorage.removeItem(key).then( () => AsyncStorage.setItem(key, JSON.stringify(result)));
            
            dispatch(updateAction(todo, id));
        }catch(e){
            console.log(e)
        }
    }
}

export const deleteList = (key, id) => {
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

//pure actions
const fetchListReducer = (state, action) => action.payload;
const saveListReducer = (state, action) => [action.payload,...state];
const updateListReducer = (state, action) => state.map( x => x.id === action.id ? ({...state, ...action.payload}) : x );
const deleteListReducer = (state, action) => state.filter( x => x.id !== action.payload && x);

//reducer
export default createReducer(initialState,{
    [FETCH]: fetchListReducer,
    [SAVE]: saveListReducer,
    [UPDATE]: updateListReducer,
    [DELETE]: deleteListReducer,
});
  