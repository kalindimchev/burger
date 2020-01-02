import React, { Component } from 'react';
import Order from '../../components/Order/Order'
import axios from '../../axios-orders';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'; 

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }
    componentDidMount() {
        axios.get('/orders.json').then(res => {
            const fetchedOrders = [];
            for (let key in res.data ) {                
                fetchedOrders.push({
                    ...res.data[key], 
                    id: key
                })
            }
            this.setState({orders: fetchedOrders, loading: false})
        }).catch(err => {
            this.setState({loading: false})
        })
    }

    render () {
        let orders = []
        console.log(this.state.orders)
        if (this.state.orders) {
            for (let order of this.state.orders) {
                console.log(order)
                orders.push(<Order totalPrice={order.price} key={order.id}/>)
            }
        }
        return (
            <div>
                {/*{orders}*/}
                {this.state.orders.map(order => {
                    return (
                        <Order 
                            key={order.id}
                            totalPrice={+order.price}
                            ingredients={order.ingredients}/>
                    )
                })}
            </div>
        );
    }
}

export default WithErrorHandler(Orders, axios);