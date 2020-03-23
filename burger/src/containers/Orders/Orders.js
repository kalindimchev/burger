import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'; 

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }
    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    render () {
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = (
                this.props.orders.map(order => {
                    return (
                        <Order 
                            key={order.id}
                            totalPrice={+order.price}
                            ingredients={order.ingredients}/>
                    )
                })
            )
        }
        if (this.props.orders) {
            for (let order of this.state.orders) {
                orders.push(<Order totalPrice={order.price} key={order.id}/>)
            }
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}  

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(Orders, axios));