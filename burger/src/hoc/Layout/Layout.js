import React, { Component} from 'react';
import { connect } from 'react-redux';
import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    
    sideDrawerClosed = () => {
        this.setState({
            showSideDrawer: false
        })
    }

    sideDrawerToggle = () => {
        this.setState(prevState => {
            return {showSideDrawer: !prevState.showSideDrawer}            
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar isAuthenticated={this.props.isAuth} drawerToggleClicked={this.sideDrawerToggle}/>
                <SideDrawer isAuthenticated={this.props.isAuth} open={this.state.showSideDrawer} closed={this.sideDrawerClosed}/>
                <div>Toolbar, SideDrawer, Backdrop</div>
                <main className={classes.Content}>{this.props.children}</main>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);