import React, { useEffect, useState } from 'react';

const foodList = ['hamburger', 'pizza', 'tamal'];

const fakeApiCall = () => new Promise( (resolve) => setTimeout(resolve (foodList), 2000) );

export default function AsyncList() {

    const [ foodData, setFoodData ] = useState( [] );

    useEffect( () => {
        fakeApiCall()
            // .then( (data) => setFoodData(data) );
            .then( setFoodData );
    }, []);

  return foodData.map( (name) => <p key={name}>{ name }</p>)
};
