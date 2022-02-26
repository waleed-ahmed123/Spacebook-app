import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import OtherScreens from './components/otherscreens';


const Stack = createNativeStackNavigator();



class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={OtherScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}
export default App;