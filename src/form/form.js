import { Button, InputLabel, Select, TextField } from '@mui/material';
import React from 'react';

export const Form = () => {
  return (
    <>
      <h1>Create product</h1>
      <form>
          <TextField  label="name" id="name"/>
          <TextField  label="size" id="size"/>
          <InputLabel htmlFor='type'>Type</InputLabel>
          <Select
            native
            value=""
            inputProps={{
                name: 'type',
                id: 'type'
            }}
          >
            <option aria-label='None' value='' />
            <option value='electronic'>Electronic</option>
            <option value='furniture'>Furniture</option>
            <option value='clothing'>Clothing</option>
          </Select>

          <Button>Submit</Button>
      </form>
    </>
  )
}

export default Form;