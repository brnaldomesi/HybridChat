import React from 'react'
// import the different screens
import Loading from './Loading'
import SignUp from './SignUp'
import Login from './Login'
import Main from './Main'
import UserInfo from './UserInfo'
import ChatGroup from './ChatGroup'
import ChatUsers from './ChatUsers'

// create our app's navigation stack

import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
  Loading: { screen: Loading },
  SignUp: { screen: SignUp },
  Login: { screen: Login },
  UserInfo: { screen: UserInfo },
  Main: { screen: Main },
  ChatUsers: { screen: ChatUsers },
  ChatGroup: { screen: ChatGroup },
}
);

const App = createAppContainer(MainNavigator);

export default App