import React from 'react';
import { ListScreen, ProductsScreen } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet,StatusBar, AsyncStorage } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

const Stack = createStackNavigator();

export default () => {
    return (
      <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Listas'}
          //StatusBar={{backgroundColor: 'red'}}
          screenOptions={
            {
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#2169F3',
                elevation: 0
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }
          }
        >
          <Stack.Screen name={"Listas"} component={ListScreen} options={{ title: 'Mis listas'}}/>
          <Stack.Screen name={'Articulos'} component={ProductsScreen} options={{title:'Artículos'}}/>
                
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar barStyle='light-content' backgroundColor='#2169F3'/>
      </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });