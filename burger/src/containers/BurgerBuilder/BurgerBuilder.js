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
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
        purchasable: false, //base price
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log(this.props)

        axios.get('https://burgerapp-reactudemy.firebaseio.com/ingredients.json').then(res => {
            console.log(res)
            this.setState({ingredients: res.data})
            this.setState({error: false})
        }).catch(err => {
            console.log(err)
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
        this.setState({purchasing: true});
    }

    purchaseCancel = () => {
        this.setState({purchasing: false});
    }

    purchaseContinue = () => {
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
        
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if (this.props.ings) {
            burger = (<Aux>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls 
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
 