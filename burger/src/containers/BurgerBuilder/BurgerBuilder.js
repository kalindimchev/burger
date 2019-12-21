import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}
class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false, //base price
        purchasing: false
    }

    updatePurchaseState = (updatedIngredients) => {
        const sum = Object.keys(updatedIngredients)
                .map(igKey => {
                    return updatedIngredients[igKey]
                }).reduce((sum, el) => {
                    return sum + el;
                } , 0); 
        console.log(sum)
        this.setState({purchasable: sum > 0})                                
    }

    addIngredient = type => {
        const oldCount = this.state.ingredients[type];
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldCount + 1;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        })
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredient = type => {
        const oldCount = this.state.ingredients[type];
        if (oldCount == 0) {
            return;
        }
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldCount - 1;
        const priceDeduciton = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduciton;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        })
        this.updatePurchaseState(updatedIngredients)
    }

    purchase = () => {
        this.setState({purchasing: true});
    }

    purchaseCancel = () => {
        this.setState({purchasing: false});
    }

    purchaseContinue = () => {
        alert('You Continue!');
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] == 0;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancel}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancel}
                        purchaseContinued={this.purchaseContinue}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredient}
                    ingredientRemoved={this.removeIngredient}
                    purchasable={this.state.purchasable}
                    disabled={disabledInfo}
                    totalPrice={this.state.totalPrice}
                    ordered={this.purchase} />
            </Aux>
        )
    }
}

export default BurgerBuilder;