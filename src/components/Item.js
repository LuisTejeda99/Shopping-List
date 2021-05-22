import React,{useState} from 'react';
import {View,Text,StyleSheet, CheckBox,Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default ({desc, completed, isSelected,handleSelected, type,...rest}) => {

    return (
        <TouchableOpacity style={styles.item} {...rest}>
        { 
            type === 1
            ?
                <Text style={[styles.title]}>{desc}</Text>
            :
                (
                    completed
                    ?
                        <Text style={[styles.titleP,styles.strike]}>{desc}</Text>
                    :
                        <Text style={[styles.titleP]}>{desc}</Text>
                )
        }
        </TouchableOpacity>
        
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight:'bold',
    },
    titleP:{
        fontSize: 24,
    },
    checkbox: {
        alignSelf: "center",
    },
    strike: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    text:{
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
    },
})