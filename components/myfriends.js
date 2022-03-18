import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostScreen from './posts.js';

const Stack = createNativeStackNavigator();

class MyFriendsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            details: [],
            isLoading: true,
            photo: null
        }
    }

    async componentDidMount() {
        // gets friend list each time user loads this screen
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_friends_list();
        });
        this.setState({
            photo: null
        })
    }

    // gets the friends list and stores the results in details array
    get_friends_list = async () => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + id + '/friends', {
            method: 'GET',
            headers: {
                'X-Authorization': token,
                //'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                        .then(async (json) => {
                            console.log("Here Are Your Friends...")
                            console.log(json);
                            this.setState({
                                details: json,
                                isLoading: false
                            });
                        })
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                    //this.error = true;
                }
                if (response.status === 403) {
                    console.log("Can only view the friends of yourself or your friends")
                    //this.error = true;
                }
                if (response.status === 404) {
                    console.log("Not found")
                    //this.error = true;
                }
                if (response.status === 500) {
                    console.log("server error");
                }
            })

            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (<View><Text>loading </Text></View>)
        }
        else{
            return (
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // FlatList Container
                        data={this.state.details}
                        renderItem={({ item }) =>
                            <View style={styles.userContainer}>
                                <Text style={styles.titleText}>User ID: {JSON.stringify(item.user_id)}</Text>
                                <Text style={styles.titleText}>First Name: {JSON.stringify(item.user_givenname)}</Text>
                                <Text style={styles.titleText}>Last Name: {JSON.stringify(item.user_familyname)}</Text>
                                <Text style={styles.titleText}>Email: {JSON.stringify(item.user_email)}</Text>
                                <Button
                                    // when user clicks on the button, it navigates to the post screen, and passes the details of the user as well as the friend id in the route
                                    title="View Post"
                                    onPress={() => this.props.navigation.navigate('Post', item = { item, user_id: JSON.stringify(item.user_id) })}
                                />
                                <Button
                                    // when user clicks on the button, it navigates to the add new post to friend screen, and passes the details of the user in the route
                                    title="Add New Post"
                                    onPress={() => this.props.navigation.navigate('AddNewFriendPost', item = {item})}
                                />
                                <Button
                                     // when user clciks on the button, it navigates to the users friends screen, and passes the details of the user as well as the friend id in the route
                                    title="Friends"
                                    onPress={() => this.props.navigation.navigate('UsersFriends', item = { item, user_id: JSON.stringify(item.user_id)  })}
                                />
                            </View>
                        }
                    />
                    
                </ScrollView>
            )
         }
    }

}


const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        padding: 20,
    },
    FLContainer: {
        backgroundColor: '#red',
        padding: 15,
        marginTop: 15,
        borderRadius: 15
    },
    titleText: {
        fontSize: 20,
    },
    button: {
        
    }
});
export default MyFriendsScreen;