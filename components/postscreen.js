import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Post from './posts';
import AddNewPost from './addnewpost';
import UpdatePost from './updatepost';
import ViewPost from './viewpost';
import AddNewFriendPost from './addtofriendspost';



const Stack = createNativeStackNavigator();



class PostScreen extends Component {

    render() {
        return (
            <NavigationContainer independent={true}>
                <Stack.Navigator independent={true}>
                    <Stack.Screen name="Post" component={Post}/>
                    <Stack.Screen name="AddNewPost" component={AddNewPost}/> 
                    <Stack.Screen name="UpdatePost" component={UpdatePost}/>
                    <Stack.Screen name="ViewPost" component={ViewPost} />
                    <Stack.Screen name="AddNewFriendPost" component={AddNewFriendPost} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

}
export default PostScreen;