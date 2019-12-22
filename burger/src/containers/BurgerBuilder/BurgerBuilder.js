import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false, //base price
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://burgerapp-reactudemy.firebaseio.com/ingredients.json').then(res => {
            this.setState({ingredients: res.data})
            this.setState({error: false})
        }).catch(err => {
            this.setState({error: true})
        })
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
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Kalin',
                address: {
                    street: 'Vitosha',
                    zipCode: 1000,
                    country: 'Bulgaria'
                },
                email: 'kalin@kalin.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders', order)
            .then(res => {
                this.setState({loading: false, purchasing: false})
            }).catch(err => {
                this.setState({loading: false, purchasing: false})
            })
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] == 0;
        }
        let orderSummary = null;
        
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if (this.state.ingredients) {
            burger = (<Aux>
                        <Burger ingredients={this.state.ingredients}/>
                        <BuildControls 
                            ingredientAdded={this.addIngredient}
                            ingredientRemoved={this.removeIngredient}
                            purchasable={this.state.purchasable}
                            disabled={disabledInfo}
                            totalPrice={this.state.totalPrice}
                            ordered={this.purchase} />
                    </Aux>)
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancel}
                purchaseContinued={this.purchaseContinue}/>
        }         
        if (this.state.loading) {
            orderSummary = <Spinner />
        }             

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancel}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);