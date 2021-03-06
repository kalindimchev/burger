import React from 'react';
// import { withRouter } from 'react-router-dom';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
            .map(igKey => {
                return [...Array(props.ingredients[igKey])]
                            .map((_, ind) => {
                    return <BurgerIngredient key={igKey + ind} type={igKey} />
                })
            })
            .reduce((arr, el) => {   //.filter(el => el.length > 0)
                return arr.concat(el);
            }, [])
            

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
            
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    )
}

export default burger;
// export default withRouter(burger);