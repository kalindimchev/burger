import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { Route } from 'react-router-dom';



class Checkout extends Component {
     state = {
         ingredients: null,
         totalPrice: 0
     }
     
     componentWillMount() {
         console.log(this.props.match.path + '/contact-data')
         const query = new URLSearchParams(this.props.location.search)
         const ingredients = {};
         console.log(query)
         let price = 0;
         for (let param of query.entries()) {
             console.log(param[0] + ':' + param[1])
             if (param[0] === 'price') {
                 price = +param[1]
             } else {
                ingredients[param[0]] = +param[1];
             }
         }
         this.setState({ingredients: ingredients, totalPrice: price.toFixed(2)})
     }

     checkoutCancelcedHandler = () => {
         this.props.history.goBack();
     }

     checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
     }

     render() {
        console.log(this.state.totalPrice)
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients} 
                    checkoutCancelced={this.checkoutCancelcedHandler}
                    checkoutContinued={this.checkoutContinuedHandler}/>
                {/*<Route
                    path={this.props.match.path + '/contact-data'}
                    component={ContactData} />*/}
                    <Route
                    path={this.props.match.path + '/contact-data'}
                    render={(props) => (
                        <ContactData ingredients={this.state.ingredients} totalPrice={this.state.totalPrice} {...props}/>)} />
            </div>

        );
     }
}

export default Checkout