import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component{
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            query: this.props.route.params,
            isLoading: true,
            users: [],
            myFriends: [],
            isFriend:false,
            isFriendMessage: "",
        }
    }

    async componentDidMount(){
        this.setState({
            query: this.props.route.params,
            isLoading: true,
        })
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_my_friends_list()
        });
        await this.search_friends(this.state.query)
        
    }

    search_friends = async (query) => {
    let details = await AsyncStorage.getItem('@spacebook_details')
    let parsed_details = JSON.parse(details)
    //let id = parsed_details.id
    let token = parsed_details.token
    fetch('http://localhost:3333/api/1.0.0/search?q=' + query, {
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
                        console.log("Here are the returned searches...")
                        console.log(json);
                        //console.log(this.details)
                        this.setState({
                            users: json,
                            isLoading: false
                        });
                    })
            }
            if (response.status === 400) {
                console.log("Bad Request")
                //this.error = true;
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

    add_new_friend = async (user_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        //let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/friends', {
            method: 'POST',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                        .then(async (json) => {
                            console.log("User Added")
                            console.log(json);
                        })
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                    //this.error = true;
                }
                if (response.status === 403) {
                    console.log("User Is Already Added As A Friend")
                    //this.error = true;
                }
                if (response.status === 404) {
                    console.log("Not Found")
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

    get_my_friends_list = async () => {
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
                                myFriends: json,
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

    handle_add_friend = async (user_id) => {
        console.log('handleAddFriend')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        //console.log(this.state.myFriends.includes(user_id))
        //console.log(this.state.myFriends.some(myfriend => myfriend.user_id == 10))
        if (this.state.myFriends.some(myfriend => myfriend.user_id == user_id)) {
            this.setState({
                isFriend: true,
                isFriendMessage: 'User already added as friend',
            })
            console.log('isFriend ' + this.state.isFriend)
            return true
        } else {
            this.setState({
                isFriend: false,
            })
            console.log('isFriend ' + this.state.isFriend)
            return false
        }
    }

    execute_add_friend_call = (user_id, post_id) => {
        console.log('execute add friend call')
        this.handle_add_friend(user_id)
            .then((response) => {
                //console.log(response)
                if (response == true) {
                    console.log('isFriend ' + this.state.isFriend)
                    return true;
                } else {
                    this.add_new_friend(user_id)
                }
            })
    }


    render() {
        if (this.state.isLoading) {
            return (<View><Text>loading </Text></View>)
        }
        else {
            return (
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // FlatList Container
                        data={this.state.users}
                        renderItem={({ item }) =>
                            <View style={styles.userContainer}>
                                <Text style={styles.titleText}>User ID: {JSON.stringify(item.user_id)}</Text>
                                <Text style={styles.titleText}>First Name: {JSON.stringify(item.user_givenname)}</Text>
                                <Text style={styles.titleText}>Last Name: {JSON.stringify(item.user_familyname)}</Text>
                                <Text style={styles.titleText}>Email: {JSON.stringify(item.user_email)}</Text>

                                <Button
                                    title="Add Friend"
                                    onPress={() => this.execute_add_friend_call(JSON.stringify(item.user_id))}
                                />
                                {!this.state.isFriend ? null :
                                    <Text style={styles.errorMsg}>{this.state.isFriendMessage}</Text>
                                }
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
    errorMsg: {
        color: 'red'
    }
});

export default SearchScreen;