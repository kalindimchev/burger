import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import { withRouter } from 'react-router-dom';


class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postCode: ''
        },
        totalPrice: 0,
        loading: false
    }

    orderHandler = (event) => {        
        event.preventDefault();
        this.setState({loading: true})
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
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
        console.log(order)
        axios.post('/orders.json', order)
            .then(res => {
                console.log(res, this.props)
                this.setState({loading: false})
                this.props.history.push('/')
            }).catch(err => {
                console.log(err)
                this.setState({loading: false})
            })
    }

    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postCode" placeholder="Post Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        )
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;
// export default withRouter(ContactData);
