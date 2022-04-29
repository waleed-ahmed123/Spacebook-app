import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './home';
import FriendRequestScreen from './friendRequest';
import MyFriendsScreen from './myfriends';
import UpdateProfileScreen from './updateProfile';

const Tab = createBottomTabNavigator();



class OtherScreens extends Component{

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.checkLoggedIn();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@spacebook_details');
        console.log("value", value)
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };


    render(){
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="FriendRequest" component={FriendRequestScreen} />
                <Tab.Screen name="MyFriends" component={MyFriendsScreen} />
                <Tab.Screen name="UpdateProfile" component={UpdateProfileScreen} />
            </Tab.Navigator>
            
        );
    }
    
}

export default OtherScreens;