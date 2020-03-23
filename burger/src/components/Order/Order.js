import React from 'react';
import classes from './Order.css'

const order = props => {
    const ingredients = [];
    for (let i in props.ingredients) {
        if (props.ingredients[i] > 0) {
            ingredients.push({
                name: i,
                amount: props.ingredients[i]
            })
        }
    }
    const ingredientsOutput = ingredients.map(i => {
        return <span
            style={{
                textTransofm: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}>{i.name} ({i.amount})
        </span>
    })
    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>USD {props.totalPrice}</strong></p>
        </div>
    );
}

export default order;