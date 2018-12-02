import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";


import Login from '../modules/login/Login';
import Home from '../modules/home/Home';
import Ficha from '../modules/ficha/Ficha';

const Navigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Login: {
    screen: Login
  },
  Ficha: {
    screen: Ficha
  }
});

const prevGetStateForAction = Navigator.router.getStateForAction;

Navigator.router.getStateForAction = (action, state) => {
  // Do not allow to go back from Home
  if (action.type === 'Navigation/BACK' && state && state.routes[state.index].routeName === 'Home') {
    return null;
  }

  // Do not allow to go back to Login
  if (action.type === 'Navigation/BACK' && state) {
    const newRoutes = state.routes.filter(r => r.routeName !== 'Login');
    const newIndex = newRoutes.length - 1;
    return prevGetStateForAction(action, {
      index: newIndex,
      routes: newRoutes
    });
  }
  return prevGetStateForAction(action, state);
};

export default createAppContainer(Navigator);
