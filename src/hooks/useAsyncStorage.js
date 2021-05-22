import { AsyncStorage } from '@react-native-community/async-storage';

export default () => {
    const _storeData = async (key, value) => {
        try{
            await AsyncStorage.setItem(key,value);
            alert('se guardó correctamente')
        }catch(e){
            console.log(e)
        }
    }

    const _fetchData = async (key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            console.log(value);
        }catch(e){
            console.log(e);
        }
    }
}

//key: lists => []
//key: products => []
//key: params => [] 
