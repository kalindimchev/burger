import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Burger Builder</NavigationItem>
            <NavigationItem link="/orders" >Orders</NavigationItem>
            {props.isAuthenticated ? <NavigationItem link="/logout" >Log Out</NavigationItem>
                : <NavigationItem link="/auth" >Auth</NavigationItem>}            
        </ul>
    );
}

export default navigationItems;