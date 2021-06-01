import 'react-native-gesture-handler';
import React,{useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {getCurrentDate} from '../boilerplate/helpers';
import {saveProduct, completeProduct, deleteProduct, deleteManyProducts, updateProduct, orderProducts} from '../reducers/products';
import {updateParam} from '../reducers/params';
import {View, StyleSheet, Alert, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import {Input, Item, Modal} from '../components';
import useForm from '../hooks/useForm';

//no edita y quitar la validacion de caracteres
const App = ({navigation, route, data, _save, _complete , _delete, _update, _order, _delete_many, params, _update_param}) => {
  const key_products = 'products';
  const key_params = 'params';
  const { listName, listId, createdDate } = route.params;
  let contador = null;
  let finalData = null;
  let newParam = null;

  const [cont, setCont] = useState(0);
  const [temp, setTemp] = useState({
    desc: '',
    id: '',
  });

  const [parameters, setParameters] = useState({});
  const [val, setVal] = useState({});
  const [render, setRender] = useState([]);

  const [selectedList, setSelectedList] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [visibilityOptions, setVisibilityOptions] = useState(false);
  const {values, handleInputChange, handleSubmitForm} = useForm({
    product: '',
    productModified: '',
  });

  const {product, productModified} = values;
  
  useEffect( () => {
    //Este es el valor del filtro de contador para poder borrar
    const vals = params.find(x => x.id === listId && x);
    setParameters(vals);
    const result = data.find(x => x.listId === listId && x.id === temp.id && x)
    setVal(result);

    if(parameters.filter === 'all'){
      finalData = data.map(x => x.listId === listId ? x : {});
      setRender(finalData);
    }
    
    else if(parameters.filter === 'completed') {
      finalData = data.map(x => x.listId === listId && x.completed ? x : {});
      setRender(finalData);
    }

    else {
      finalData = data.map(x => x.listId === listId && !x.completed ? x : {});
      setRender(finalData);
    }

  }, [data, cont, temp, parameters, params, visibilityOptions]);
  
  const handleLongPress = (desc, id) => {
    handleInputChange(desc, 'productModified');
    setTemp({
      desc,
      id,
    });
    setVisibility(!visibility);
  }

  const handleSubmit = () => {
    const newProduct = {
      id: Math.random().toString(),
      desc: product,
      date: getCurrentDate(),
      completed: false,
      listId: listId,
    }

    if(product !== ''){
      let exists = 0;
      data.map(x => x.id === newProduct.id && (exists = 1));
      
      if(exists === 0) {
        handleSubmitForm();
        _save(key_products, newProduct);
      }
      
      else alert('Intente guardar el producto nuevamente...');
    }
    else alert('No puede dejar el campo vacío...');
  }

  const handlePress = (id) => {
    // se necesita tener en tiempo real el estado, por lo que hacemos el efecto de completado, solo cuando se renderizan components
    const obj = data.find(x => x.id === id && x);
    const completedOrNot = obj.completed ? 1 : 0;
    const newState = data.map(x => x.id === id ? ({...x, completed: !x.completed}): x );
    const newList = newState.filter(x => !x.completed && x);
    setSelectedList(newList);
    contador = {
      contador: 0,
    };

    if(completedOrNot === 1) { 
      setCont(cont - 1);
      contador = {
        contador: parameters.contador - 1
      }
    }
    else {
      setCont(cont + 1);
      contador = {
        contador: parameters.contador + 1
      }
    }
    
    _complete(key_products, id);
    _update_param(key_params, listId, contador);
  }
  
  const handleEdit = () => {
    _update(key_products, temp.id, productModified);
    setVisibility(!visibility);
  }

  const handleChange = (e,boxName) => {
    handleInputChange(e,boxName);
  }

  const handleCancel = () => {
    handleSubmitForm();
    setVisibility(!visibility)
  }

  const handleDelete = () => {
    contador = {
      contador: 0,
    };
    
    
    if(val.completed){
      contador = {
        contador: parameters.contador - 1
      }
      _update_param(key_params, listId, contador);
    }
    _delete(key_products, temp.id);
    setVisibility(!visibility);
  }

  const handleDeleteMany = () => {
    setVisibilityOptions(!visibilityOptions);
    _delete_many(key_products, selectedList);
    newParam = {
      filter: 'all',
      contador: 0,
    }
    _update_param(key_params, listId, newParam);
    setCont(0);
  }

  const handleAlert = () => {
    {
      parameters.contador > 0 
        ?
          (
            Alert.alert(
              "Borrar articulos",
              "¿Estás seguro(a) que deseas borrar los articulos seleccionados?",
              [
                {
                  text: "Cancelar",
                  style: "cancel"
                },
                { text: "Sí, estoy seguro", onPress: handleDeleteMany }
              ]
            )
          )
        :
          (
            (
              Alert.alert(
                "Borrar varios",
                "No has seleccionado ningún producto aún...",
                [
                  {
                    text: "Aceptar",
                    style: "ok"
                  }
                ]
              )
            )
          )

    }
  }

  const handleAlertInfo = () => {
    Alert.alert(
      "Lista: " + listName,
      "Total de artículos: " + data.filter(x => x.listId === listId && x).length + "\n\n" +
      "Total de artículos completados: " + data.filter(x => x.listId === listId && x.completed && x).length + "\n\n" +
      "Total de artículos no completados: " + data.filter(x => x.listId === listId && !x.completed && x).length + "\n\n" + 
      "Fecha de creación: " + createdDate,
      [
        {
          text: "Aceptar",
          style: "ok"
        }
      ]
    )     
  }
  
  const handleOrder = () => {
    _order(key_products);
    setVisibilityOptions(!visibilityOptions);
  }

  const handleChangeFilter = () => {
    if(parameters.filter === 'all'){
      newParam = {
        filter: 'completed',
      }
    }

    else if(parameters.filter === 'completed'){
      newParam = {
        filter: 'no completed',
      }
    }

    else {
      newParam = {
        filter: 'all',
      }
    }
    _update_param(key_params, listId, newParam);
  }

  React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => setVisibilityOptions(!visibilityOptions)}> 
              <Image
                style={styles.deleteMany}
                source={require('../../assets/options.png')}
              />
            </TouchableOpacity>
          
        ),
      })  
  },[data, parameters, cont, visibilityOptions])

  return (
    <View style={styles.container}>
          
        <Input
            onChangeText={(e) => handleInputChange(e,'product')}
            onSubmitEditing={handleSubmit}
            value={product}
            placeholder='Ingresa el nombre del articulo'
        />
        <View style={styles.list}>
            <FlatList
            data={ render.filter(x => x.desc !== undefined && x) }
            renderItem={({item}) =>
            <Item desc={item.desc} completed={item.completed} type={2} onPress={() => handlePress(item.id)} onLongPress={() => handleLongPress(item.desc, item.id)} />
            }
            keyExtractor={item => String(item.id)}
            />
        </View>


        <Modal visibility={visibilityOptions}>
            <View>
            <TouchableOpacity style={styles.menuOptions} onPress={handleOrder}>
                <Image
                style={{width: 21, height: 21, marginHorizontal: 8,}}
                source={require('../../assets/orderBy.png')}
                />
                <Text style={styles.text}>Ordenar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOptions} onPress={handleChangeFilter}>
                <Image
                style={{width: 21, height: 21, marginHorizontal: 8,}}
                source={require('../../assets/filter.png')}
                />
                <Text style={styles.text}>Cambiar filtro - { parameters.filter === 'all' && 'Todos' || parameters.filter === 'completed' && 'Completados' || parameters.filter === 'no completed' && 'No completados' } </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOptions} onPress={handleAlert}>
                <Image
                style={{width: 21, height: 21, marginHorizontal: 8,}}
                source={require('../../assets/trash.png')}
                />
                <Text style={styles.text}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOptions} onPress={handleAlertInfo}>
                <Image
                style={{width: 21, height: 21, marginHorizontal: 8,}}
                source={require('../../assets/info.png')}
                />
                <Text style={styles.text}>Información</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF0000', height: 40, marginTop: 10, borderRadius: 5}} onPress={() => setVisibilityOptions(!visibilityOptions)}>
                <Text style={[styles.text, {color: '#fff', fontWeight: 'bold'}]}>Cerrar</Text>
            </TouchableOpacity>
            </View>
        </Modal>
        
        
        <Modal visibility={visibility}>
        <View>
            <Input
            value={productModified}
            placeholder="Nombre del producto"
            onChangeText={(e) => handleChange(e,'productModified')}
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
        </Modal>
      </View>
    );
  }

  const mapStateToProps = (state) => {
    return {
      data: state.products,
      params: state.params,
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    //already
    _save: (key, product) => dispatch(saveProduct(key, product)),
    _update: (key, id, desc) => dispatch(updateProduct(key, id, desc)),
    _delete: (key, id) => dispatch(deleteProduct(key, id)),
    _delete_many: (key, products) => dispatch(deleteManyProducts(key, products)),
    _complete: (key, id) => dispatch(completeProduct(key, id)),
    _order: (key) => dispatch(orderProducts(key)),
    _update_param: (key, id, param) => dispatch(updateParam(key, id, param)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(App);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 8,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    list:{
      flex: 1,
      alignSelf: 'stretch',
      marginHorizontal: 8,
    },
    panelButton: {
      flexDirection: 'row',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      width: 30,
      height: 30,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deleteMany: {
      width: 30,
      height: 30,
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 35,
      borderBottomColor: '#1d374b',
      borderWidth: .5,
      paddingHorizontal: 8,
      marginRight: 8,
      fontSize: 16,
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
    text: {
      fontSize: 18,
    },
  });
  