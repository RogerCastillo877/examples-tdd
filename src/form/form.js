import { Button, Container, CssBaseline, Grid, InputLabel, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from '../const/httpStatus';

import { saveProduct } from '../services/productServices';

export const Form = () => {
    
    const [ isSaving, SetIsSaving ] = useState(false);
    const [ isSuccess, setIsSuccess ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [formErrors, setFormErrors] = useState({
        name: '',
        size: '',
        type: ''
    })

    const handleFecthErrors = async ( err ) => {
        if( err.status === ERROR_SERVER_STATUS ) {
            setErrorMessage('Unexpected error, please try again')
            return;
        };
    
        if( err.status === INVALID_REQUEST_STATUS ) {
            
            const data = await err.json();
    
            setErrorMessage( data.message );
            return;
        }
        
        setErrorMessage('Connection error, please try again')
    }
    
    const validateField = ({ name, value }) => {
        setFormErrors( ( prevState ) => ({ ...prevState, [name]: value.length ? '' : `The ${ name } is required` }))
    }

    const validateForm = ({ name, size, type }) => {
        
        // if( !name.value ) {
        //     // setFormErrors({ ...formErrors, name: 'The name is required' })
        //     setFormErrors( ( prevState ) => ({ ...prevState, name: 'The name is required' }))
        // }

        // if( !size.value ) {
        //     setFormErrors( ( prevState ) => ({ ...prevState, size: 'The size is required' }))
        // }

        // if( !type.value ) {
        //     setFormErrors( ( prevState ) => ({ ...prevState, type: 'The type is required' }))
        // }

        validateField({ name: 'name', value: name })
        validateField({ name: 'size', value: size })
        validateField({ name: 'type', value: type })
    }

    const getFormValues = ({ name, size, type }) => (
        {
            name: name.value,
            size: size.value,
            type: type.value
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault()

        SetIsSaving(true);

        const { name, size, type } = e.target.elements

        validateForm( getFormValues({ name, size, type }) );

        try {
            const response = await saveProduct( getFormValues({ name, size, type }) );

            if( !response.ok ) {
                throw response
            }

            if( response.status === CREATED_STATUS ) {
                e.target.reset();
                setIsSuccess(true);
            };
            
        } catch ( err ) {
            handleFecthErrors( err );
        }

        SetIsSaving(false);
    }

    const handleBlur = e => {
        const { name, value } = e.target;

        // setFormErrors({
        //     ...formErrors,
        //     [name]: value.length ? '' : `The ${ name } is required`
        // });
        validateField({ name, value })
    }

  return (
    <Container maxWidth="xs">
        <CssBaseline />
        <Typography component="h1" variant="h5" align="center">Create product</Typography>
        { isSuccess && <p>Product Stored</p> }
        <p>{ errorMessage }</p>
        <form onSubmit={ handleSubmit }>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="name"
                        id="name"
                        name="name"
                        helperText={ formErrors.name }
                        onBlur={ handleBlur }
                        error={ !!formErrors.name.length }
                        />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="size"
                        id="size"
                        name="size"
                        helperText={ formErrors.size }
                        onBlur={ handleBlur }
                        error={ !!formErrors.size.length }
                        />
                </Grid>
                <Grid item xs={12}>
                    <InputLabel htmlFor='type'>Type</InputLabel>
                    <Select
                        fullWidth
                        native
                        inputProps={{
                            name: 'type',
                            id: 'type'
                        }}
                        error={ !!formErrors.type.length }
                    >
                        <option aria-label='None' value='' />
                        <option value='electronic'>Electronic</option>
                        <option value='furniture'>Furniture</option>
                        <option value='clothing'>Clothing</option>
                    </Select>

                    { !!formErrors.type.length && <p>{ formErrors.type }</p> }
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        disabled={ isSaving }
                        type='submit'
                    >Submit</Button>
                </Grid>
            </Grid>
        </form>
    </Container>
  )
}

export default Form;