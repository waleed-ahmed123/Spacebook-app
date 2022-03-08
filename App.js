import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import OtherScreens from './components/otherscreens';
import PostScreens from './components/postscreen';
import ViewPosts from './components/posts';
import AddNewPostScreen from './components/addnewpost';
import UpdatePostScreen from './components/updatepost';
import ViewPostScreen from './components/viewpost';
import AddNewFriendPostScreen from './components/addtofriendspost';


const Stack = createNativeStackNavigator();



class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={OtherScreens} />
          <Stack.Screen name="Post" component={ViewPosts} />
          <Stack.Screen name="AddNewPost" component={AddNewPostScreen} />
          <Stack.Screen name="UpdatePost" component={UpdatePostScreen} />
          <Stack.Screen name="ViewPost" component={ViewPostScreen} />
          <Stack.Screen name="AddNewFriendPost" component={AddNewFriendPostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}
export default App;