import React from 'react';
import {TextInput,StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    input: {
        alignSelf: 'stretch',
        height: 35,
        borderBottomColor: '#1d374b',
        borderWidth: .5,
        paddingHorizontal: 8,
        marginHorizontal: 8,
        marginBottom: 8,
        fontSize: 16,
    }
})

export default ({...rest}) => {
    return (
        <TextInput
            style={styles.input}
            {...rest}
        />
    );
}