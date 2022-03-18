import React, { Component } from 'react';
import { SearchBar, ThemeConsumer } from 'react-native-elements';
//import {SearchBar} from 'react-native-dynamic-search-bar';
import { View, Text, StyleSheet, Image, Button, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostScreen from './postscreen';
import AddNewPost from './addnewpost';
import UpdatePost from './updatepost';
import { TextInput } from 'react-native-gesture-handler';

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            photo: [],
            isLoading: true,
            search:"",
            posts: [], 
            disable: false,
            n : 1,
            deletePostMessage: "", 
            updatePostMessage: "",
            isValidUserDelete: true,
            isValidUserUpdate: true,
        }
    }

    async componentDidMount() {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        
        // each time user loads this page, get the profile image and posts
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_profile_image(id);
            await this.get_posts();
        });
        this.setState({
            search:'',
            isLoading: false,
            disable: false,
            isValidUserDelete: true,
            isValidUserUpdate: true,
            n : 1
        });
        console.log(this.state.photo);
    }

    // profile image function - makes a call to the API, then sets the profile image to the photo state
    get_profile_image = async (user_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token

        console.log("here", id, token)

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

    // makes a call to the logout functtion when user clicks on the button.
    // directs the user to the login page
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

    // gets the posts of the logged in user and stores them in the posts array state
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

    // deletes a post the logged in the user has created. 
    // once deleted, calls the get posts function to update the posts on the screen
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

    // Validation for deleting a post. Checks if the user deleting the post is the same as the author of the post
    // if true, returns true. if false, sets an error message for the user. 
    handle_delete = async (author_id) => {
        console.log('handleDelete')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        if(author_id == id){
            this.setState({
                isValidUserDelete: true,
            })
            console.log('isValidUserDelete ' + this.state.isValidUserDelete)
            return true
        }else{
            this.setState({
                isValidUserDelete: false,
                deletePostMessage: 'cannot delete a post you dont own',
            })
            console.log('isValidUserDelete ' + this.state.isValidUserDelete)
            return false
        }
    }

    // if the user is valid to delete, execute the delete post function
    execute_delete_call = (post_id, author_id) => {
        console.log('execute delete call')
        this.handle_delete(author_id)
            .then((response) => {
                //console.log(response)
                if (response == false) {
                    console.log('isValidUserDelete ' + this.state.isValidUserDelete)
                    return false;
                } else {
                    this.delete_post(post_id, author_id)
                }
            })
    }

    // Validation for updating a post. Checks if the user updating the post is the same as the author of the post
    // if true, returns true. if false, sets an error message for the user.
    handle_update = async (author_id) => {
        console.log('handleDelete')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        if (author_id == id) {
            this.setState({
                isValidUserUpdate: true,
            })
            console.log('isValidUserUpdate ' + this.state.isValidUserUpdate)
            return true
        } else {
            this.setState({
                isValidUserUpdate: false,
                updatePostMessage: 'Can only update posts you have created',
            })
            console.log('isValidUserUpdate ' + this.state.isValidUserUpdate)
            return false
        }
    }

    // if the user is valid to update, navigate to the update post screen and pass the post information in the route as well
    execute_update_call = (author_id, item) => {
        console.log('execute update call')
        this.handle_update(author_id)
            .then((response) => {
                //console.log(response)
                if (response == false) {
                    console.log('isValidUserUpdate ' + this.state.isValidUserUpdate)
                    return false;
                } else {
                    //this.delete_post(post_id, author_id)
                    this.props.navigation.navigate('UpdatePost', item = { item })
                }
            })
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <ScrollView>
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder='Search here...'
                            onChangeText={(text) => this.setState({ search: text })}
                            value={this.state.search}
                            style={styles.search}
                        />
                        <Button
                            title='Search'
                            style={styles.searchButton}
                            // when user clicks the search button, it navigates to the search screen and passes search state in the route.
                            onPress={() => (this.props.navigation.navigate("SearchScreen", this.state.search=this.state.search))}
                        />
                    </View>
                    <View style={styles.container}>
                        <Image
                            source={{
                                uri: this.state.photo,
                            }}
                            style={{
                                flex: 1,
                                width: 250,
                                height: 250,
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
                        <FlatList // use a flatlist to display information about posts
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
                                        title="Delete Post"
                                        onPress={() => (this.execute_delete_call(JSON.stringify(item.post_id), JSON.stringify(item.author.user_id)))}
                                    />
                                    {this.state.isValidUserDelete ? null : // error message if user isnt allowed to delete
                                        <Text style={styles.errorMsg}>{this.state.deletePostMessage}</Text>
                                    }
                                    <Button
                                        title="Update Post"
                                        //onPress={() => this.props.navigation.navigate('UpdatePost', item = { item })}
                                        onPress={() => this.execute_update_call(JSON.stringify(item.author.user_id), item = { item })}
                                    />
                                    {this.state.isValidUserUpdate ? null : // error message if user isnt allowed to update
                                        <Text style={styles.errorMsg}>{this.state.updatePostMessage}</Text>
                                    }
                                    <Button
                                        title="View Post"
                                        onPress={() => this.props.navigation.navigate('ViewPost', item = { item })} // passes the posts info to the route as it directs to the view post screen
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
    searchContainer: {
        flex: 1,
        margin: 5,
        marginLeft:5,
        backgroundColor: '#fff',
    },
    search: {
        flex: 0.5,
        //width: 100,
        height: 100
    },
    searchButton: {
        flex: 0.5,
        //width: 100,
    },
    errorMsg: {
        color: 'red'
    }
});

export default HomeScreen;

