import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import {getCurrentDate} from '../boilerplate/helpers';
import {saveList, deleteList, updateList} from '../reducers/todos';
import {deleteAllProducts} from '../reducers/products';
import { saveParam, deleteParam } from '../reducers/params';
import {View, StyleSheet, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import { Item,Input, Modal } from '../components';
import useForm from '../hooks/useForm';

const App = ({navigation, data, _save, _update, _delete, _save_param, _delete_param, _delete_products}) => {
  const key_list = 'lists';
  const key_products = 'products';
  const key_param = 'params';

  const [visibility, setVisibility] = useState(false);
  const [cont, setCont] = useState(1);
  const [temp, setTemp] = useState({
    id: '',
    desc: '',
  });
  const [type, setType] = useState(1);

  const {values, handleInputChange, handleSubmitForm} = useForm({
    nameList: '',
    nameListModified: '',
  });


  const {nameList, nameListModified} = values;

  const handlePress = (list, listId, createdDate) => {
    navigation.navigate('Articulos', {listName: list, listId: listId, createdDate: createdDate});
  }

  const handleSubmit = (desc) => {
    let id = Math.random().toString(32);
    if (desc !== '') {
      const newList = {
        id: id,
        desc,
        date: getCurrentDate(),
        completed: false,
      }

      let exists = 0;
      data.map(x => x.id === id && (exists = 1));
      
      if(exists === 0) {
        _save(key_list, newList);
        setVisibility(!visibility);
        handleSubmitForm();
        _save_param(key_param,{
          id,
          contador: 0,
          filter: 'all',
        });
      }
      else alert('Intentelo nuevamente...');  
    }
    else alert('No puede dejar el campo vacío...');
  }

  const handleLongPress = (desc, id) => {
    setCont(0);
    setType(2);
    setTemp({
      id,
      desc,
    });
    handleInputChange(desc, 'nameListModified')
    setVisibility(!visibility);
  }

  const handleChange = (e, boxName) => {
    handleInputChange(e,boxName);
  }
  
  const handleEdit = () => {
    const todo = {
      id: temp.id,
      desc: nameListModified,
      date: getCurrentDate(),
      completed: false,
    }

    setCont(1);
    _update(key_list, temp.id, todo);
    setVisibility(!visibility);
  }

  const handleDelete = () => {
    setCont(1);
    _delete(key_list, temp.id);
    _delete_products(key_products, temp.id);
    _delete_param(key_param,temp.id);
    setVisibility(!visibility);
  }

  const handleCancel = () => {
    setCont(1);
    setVisibility(!visibility);
    handleSubmitForm();
  }

  const handleHeader = () => {
    setType(1);
    setVisibility(!visibility);
  }

  React.useLayoutEffect(() => {
    cont > 0
    ?
      navigation.setOptions({
      headerRight: () => (
          <TouchableOpacity onPress={handleHeader}> 
            <Image 
              style={styles.listButton}
              source={require('../../assets/add.png')}
            />
          </TouchableOpacity>
        ),
      })
    : 
      navigation.setOptions({
        headerRight: null,
      }),[cont]})

  return (
    <View style={styles.container}>
        <FlatList
            style={styles.list}
            data={data}
            renderItem={({item}) => <Item desc={item.desc} type={1} onPress={() => handlePress(item.desc, item.id, item.date)} onLongPress={() => handleLongPress(item.desc, item.id)}/>}
            keyExtractor={item => String(item.id)}
        />

        <Modal visibility={visibility}>
          {
            type === 1
            ?
              (
                <View>
                  <Input
                    value={nameList}
                    placeholder={"Nombre de la lista"}
                    onChangeText={(e) => handleInputChange(e,'nameList')}
                  />
                  <View style={{flexDirection: 'row', height: 35}}>
                  <TouchableOpacity style={
                      {
                        flex: 1,
                        height: 35,
                        marginHorizontal: 5,
                        borderColor: '#f1f1f1',
                        borderWidth: .5,
                        backgroundColor: '#4ad395',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                      }} onPress={() => handleSubmit(nameList)}> 
                      <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold',}}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={
                      {
                        flex: 1,
                        height: 35,
                        marginHorizontal: 5,
                        borderColor: '#f1f1f1',
                        borderWidth: .5,
                        backgroundColor: '#FF0000',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                      }} onPress={handleCancel}> 
                      <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold',}}>Cancelar </Text>
                  </TouchableOpacity>
                  </View>
                </View>
              )
            :
              (
                <View>
                  <Input
                    value={nameListModified}
                    placeholder={"Nombre de la lista"}
                    onChangeText={(e) => handleChange(e,'nameListModified')}
                  />
                  <View style={styles.panelButton}>
                    <TouchableOpacity style={styles.button} onPress={handleEdit}> 
                      <Image 
                        style={styles.button}
                        source={require('../../assets/write.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={
                        {
                          width: 70,
                          height: 35,
                          flex: 1,
                          marginHorizontal: 5,
                          borderColor: '#f1f1f1',
                          borderWidth: .5,
                          backgroundColor: '#FF0000',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5
                        }} onPress={handleCancel}> 
                      <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold',}}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleDelete}> 
                      <Image 
                        style={styles.button}
                        source={require('../../assets/trash.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )
          }
        </Modal>
    </View>
  );
}
  
const mapStateToProps = (state) => {
    return {
      data: state.todos,
      language: state.language,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _save: (key,list) => dispatch(saveList(key,list)),
    _update: (key, id, todo) => dispatch(updateList(key, id, todo)),
    _delete: (key, id) => dispatch(deleteList(key, id)),
    _save_param: (key, param) => dispatch(saveParam(key, param)),
    _delete_param: (key, id) => dispatch(deleteParam(key, id)),
    _delete_products: (key, listId) => dispatch(deleteAllProducts(key,listId)),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list:{
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: 8,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listButton:{
    marginRight: 8,
    width: 25,
    height: 25,
  },
  panelButton: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptions: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 35,
    marginVertical: 8,
  },
});
