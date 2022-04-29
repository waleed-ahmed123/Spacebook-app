import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UsersFriends extends Component{
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            details: [],
            isLoading: true,
            photo: null,
            user_id: this.props.route.params.item.user_id
        }
    }

    async componentDidMount() {
        this.setState({
            //sets the user_id to the id passed through the route
            user_id: this.props.route.params.item.user_id
        })
        //each time this page loads, is gets the friends of the friend 
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_users_friends(this.state.user_id);
        });
    }

    //gets a users friends by passing their user id, then sets the returned data to the friends array
    get_users_friends = async (user_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/friends', {
            method: 'GET',
            headers: {
                'X-Authorization': token,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                        .then(async (json) => {
                            console.log("Here Are Your Friends friends...")
                            console.log(json);
                            console.log(this.details)
                            this.setState({
                                friends: json,
                                isLoading: false
                            });
                        })
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                    //this.error = true;
                }
                if (response.status === 403) {
                    console.log("Can only view friends of yourself or your friends")
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
        else {
            return (
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // display the friends as a flatlist
                        data={this.state.friends}
                        renderItem={({ item }) =>
                            <View style={styles.userContainer}>
                                <Text style={styles.titleText}>User ID: {JSON.stringify(item.user_id)}</Text>
                                <Text style={styles.titleText}>First Name: {JSON.stringify(item.user_givenname)}</Text>
                                <Text style={styles.titleText}>Last Name: {JSON.stringify(item.user_familyname)}</Text>
                                <Text style={styles.titleText}>Email: {JSON.stringify(item.user_email)}</Text>
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
export default UsersFriends;