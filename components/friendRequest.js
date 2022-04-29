import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        // gets the friend requests each time the user loads this page. 
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_friend_request_list();
        });
    }

    // friend request function. stores the results returned in details array
    get_friend_request_list = async () => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/friendrequests', {
            method: 'GET',
            headers: {
                'X-Authorization': token,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                        .then(async (json) => {
                            console.log("Here Are Your Friend requests...")
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
                if (response.status === 500) {
                    console.log("server error");
                }
            })

            .catch((error) => {
                console.error(error);
            });
    }

    // Accepting a friend request. if successful, it reloads the friend request list to update it on the screen
    acceptFriendRequest = async (friend_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/friendrequests/' + friend_id, {
            method: 'POST',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Friend Request Accepted...")
                    this.get_friend_request_list()
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
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

    // rejecting a friend request. if successful, it reloads the friend request list to update it on the screen
    deleteFriendRequest = async (friend_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/friendrequests/' + friend_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Friend Request Accepted...")
                    this.get_friend_request_list()
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
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
            return(<View><Text>Loading...</Text></View>)
        }
        else{
            return (
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // FlatList Container
                        data={this.state.details}
                        renderItem={({ item }) =>
                            <View style={styles.userContainer}>
                                <View >
                                    <Text style={styles.titleText}>User ID: {JSON.stringify(item.user_id)}</Text>
                                    <Text style={styles.titleText}>First Name: {JSON.stringify(item.first_name)}</Text>
                                    <Text style={styles.titleText}>Last Name: {JSON.stringify(item.last_name)}</Text>
                                    <Text style={styles.titleText}>Email: {JSON.stringify(item.email)}</Text>
                                </View>
                                <Button
                                    title = "Accept"
                                    onPress = { () => this.acceptFriendRequest(JSON.stringify(item.user_id))} // button to accept a friend request
                                />
                                <Button
                                    title="Reject"
                                    onPress={() => this.deleteFriendRequest(JSON.stringify(item.user_id))} // button to reject a friend request
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
});
export default FriendRequestScreen;