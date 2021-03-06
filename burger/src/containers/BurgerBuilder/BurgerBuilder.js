import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
        purchasable: false, //base price
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();        
    }


    
    updatePurchaseState = (updatedIngredients) => {
        const sum = Object.keys(updatedIngredients)
                .map(igKey => {
                    return updatedIngredients[igKey]
                }).reduce((sum, el) => {
                    return sum + el;
                } , 0); 
        return sum > 0;                                
    }

    // addIngredient = type => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = oldCount + 1;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice
    //     })
    //     this.updatePurchaseState(updatedIngredients)
    // }

    // removeIngredient = type => {
    //     const oldCount = this.props.ingredients[type];
    //     if (oldCount === 0) {
    //         return;
    //     }
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = oldCount - 1;
    //     const priceDeduciton = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduciton;
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice
    //     })
    //     this.updatePurchaseState(updatedIngredients)
    // }

    purchase = () => {
        if (this.props.isAuth) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth');
        }
    }

    purchaseCancel = () => {
        this.setState({purchasing: false});
    }

    purchaseContinue = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice)
        // const queryString = queryParams.join('&')
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });  
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }
        let orderSummary = null;
        
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if (this.props.ings) {
            burger = (<Aux>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls 
                            isAuth={this.props.isAuth}
                            ingredientAdded={(type) => this.props.onIngredientAdded(type)}
                            ingredientRemoved={(type) => this.props.onIngredientRemoved(type)}
                            purchasable={this.updatePurchaseState(this.props.ings)}
                            disabled={disabledInfo}
                            totalPrice={this.props.price}
                            ordered={this.purchase} />
                    </Aux>)
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancel}
                purchaseContinued={this.purchaseContinue}/>
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirctPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
 