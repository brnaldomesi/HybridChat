import React from 'react'
// import the different screens
import Loading from './Loading'
import SignUp from './SignUp'
import Login from './Login'
import Main from './Main'
// create our app's navigation stack

import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
  SignUp: { screen: SignUp },
  Login: { screen: Login },
  Main: { screen: Main },
},
  {
    initialRouteName: "Loading"
  }
);

const App = createAppContainer(MainNavigator);

export default App