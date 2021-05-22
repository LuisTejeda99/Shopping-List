import {useState} from 'react';

export default (initialState = {}) => {
    const [values,setValues] = useState(initialState);
    const [modifiedValues,setModifiedValues] = useState(initialState);

    const handleInputChange = (value, boxName) => {
        if(value.length <= 30) {
            setValues({
                ...values,
                [boxName]: value,
            });
        }
    }

    const handleSubmitForm = () => {
        setValues(initialState);
    }

    return {handleInputChange, values, handleSubmitForm};
}