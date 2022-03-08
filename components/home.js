import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
//import {SearchBar} from 'react-native-dynamic-search-bar';
import { View, Text, StyleSheet, Image, Button, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostScreen from './postscreen';
import AddNewPost from './addnewpost';
import UpdatePost from './updatepost';

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            photo: [],
            isLoading: true,
            search:"",
            posts: []
        }
    }

    async componentDidMount() {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        
        //await this.get_posts();
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_profile_image(id);
            await this.get_posts();
        });
        this.setState({
            search: this.search,
            isLoading: false
        });
        console.log(this.state.photo);
    }

    get_profile_image = async (user_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token

        console.log("here", id, token)

        // let id = 8;
        // let token = '7395cf6377fa0233063098a075bf2483';
        fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
            method: 'GET',
            headers: {
                "X-Authorization": token,
                "Content-Type": "image/jpeg"
            }
        })
            .then((res) => {
                return res.blob();
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                this.setState({
                    photo: data
                });
            })
            .catch((err) => {
                console.log("error, something went wrong", err)
            });
    }

    logout = async () =>{
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Now go to Login...")
                    this.props.navigation.navigate("Login");
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                }
                if (response.status === 500) {
                    console.log("server error");
                }
            })

            .catch((error) => {
                console.error(error);
            });
    }

    updateSearch = (text) => {
        this.setState({
            search: text
        })
    };

    get_posts = async () => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
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
                            console.log("Here Are Your Posts...")
                            console.log(json);
                            this.setState({
                                posts: json,
                                isLoading: false
                            });
                        })
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                    //this.error = true;
                }
                if (response.status === 403) {
                    console.log("Can only view posts of yourself or your friends")
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


    delete_post = async(post_id, author_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post/' + post_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Post deleted...")
                    this.get_posts()
                    //this.props.navigation.navigate("Login");
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                }
                if (response.status === 403) {
                    console.log("Forbidden - you can only delete your own posts")
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
        if (!this.state.isLoading) {
            return (
                <ScrollView>
                    <View>
                        <SearchBar
                            placeholder="Search here"
                            onChangeText={(text) => {
                                this.updateSearch(text);
                            }}
                            value={this.search}
                        />
                    </View>
                    <View style={styles.container}>
                        <Image
                            source={{
                                uri: this.state.photo,
                            }}
                            style={{
                                width: 400,
                                height: 400,
                                borderWidth: 5
                            }}
                        />

                        <View style={styles.friendRequestButton}>
                            <Button
                                title="Friend Requests"
                                onPress={() => (this.props.navigation.navigate("FriendRequest"))}
                            />
                            <Button
                                title="My Friend"
                                onPress={() => (this.props.navigation.navigate("MyFriends"))}
                            />
                            <Button
                                title="Update Profile"
                                onPress={() => (this.props.navigation.navigate("UpdateProfile"))}
                            />
                            
                        </View>
                        <Button
                            title="Logout"
                            onPress={() => (this.logout())}
                        />
                        <Button
                            title="Add New Post"
                            onPress={() => (this.props.navigation.navigate('AddNewPost'))}
                        />
                        
                    </View>
                    <View>
                        <FlatList
                            style = {styles.FLContainer} // FlatList Container
                            data={this.state.posts}
                            renderItem={({ item }) =>
                                <View style={styles.postContainer}>
                                    <View>
                                        <Text style={styles.titleText}>Post ID: {JSON.stringify(item.post_id)}</Text>
                                        <Text style={styles.titleText}>Text: {JSON.stringify(item.text)}</Text>
                                        <Text style={styles.titleText}>Author ID: {JSON.stringify(item.author.user_id)}</Text>
                                        <Text style={styles.titleText}>Author First Name: {JSON.stringify(item.author.first_name)}</Text>
                                        <Text style={styles.titleText}>Author Last Name: {JSON.stringify(item.author.last_name)}</Text>
                                        <Text style={styles.titleText}>Author Email: {JSON.stringify(item.author.email)}</Text>
                                        <Text style={styles.titleText}>Number Of Likes: {JSON.stringify(item.numLikes)}</Text>
                                    </View>
                                    <Button 
                                        title = "Delete Post"
                                        onPress={() => (this.delete_post(JSON.stringify(item.post_id), JSON.stringify(item.author.user_id)))}
                                    />
                                    <Button
                                        title="Update Post"
                                        onPress={() => this.props.navigation.navigate('UpdatePost', item = { item })}
                                    />
                                    <Button
                                        title="View Post"
                                        onPress={() => this.props.navigation.navigate('ViewPost', item = { item })}
                                        //onPress={() => (this.delete_post(JSON.stringify(item.post_id), JSON.stringify(item.author.user_id)))}
                                    />
                                </View>
                            }
                        />
                    </View>
                </ScrollView>
                
            );
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendRequestButton: {
        flexDirection: 'row',
        textAlign: "center"
    },
    view: {
        margin: 10,
    },
    postContainer: {
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

export default HomeScreen;

