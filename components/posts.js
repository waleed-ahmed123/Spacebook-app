import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Post extends Component{
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            details: [],
            isLoading: true,
            like: false, 
            user_id: this.props.route.params.item.user_id,
            show: true,
            photo: null,
            deletePostMessage: "",
            updatePostMessage: "",
            likePostMessage: "",
            unlikePostMessage: "",
            isValidUserDelete: true,
            isValidUserUpdate: true,
            isValidUserLike: true,
            isValidUserUnlike: true,
        }
    }

    async componentDidMount() {
        // get posts of the friend by using the id in the route 
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_posts(JSON.stringify(this.props.route.params.item.user_id));
        });
        this.setState({
            user_id: this.props.route.params.item.user_id,
            show: true,
            photo: this.get_profile_image(this.props.route.params.item.user_id),
            isValidUserDelete: true,
            isValidUserUpdate: true,
            isValidUserLike: true,
            isValidUserUnlike: true,
        })
        console.log(this.state.posts)
    }

    // get the posts of the friend and store the result in posts array
    get_posts = async (friend_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        //let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + friend_id + '/post', {
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
                            console.log("Here Are Your Friends Posts...")
                            console.log('User_id ' + this.state.user_id)
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

    // get the profile image of the friend and store it in the photo variable 
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

    // function to like a post, then reload the posts to update the likes on the screen 
    like_Post = async (friend_id, post_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + friend_id + '/post/' + post_id + "/like", {
            method: 'POST',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Post liked...")
                    this.get_posts(friend_id)
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                }
                if (response.status === 403) {
                    console.log("Forbidden - you have already liked this post")
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

    // function to unlike a post, then reload the posts to update the likes on the screen 
    unlike_Post = async (friend_id, post_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + friend_id + '/post/' + post_id + "/like", {
            method: 'DELETE',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Post unliked...")
                    this.get_posts(friend_id)
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                }
                if (response.status === 403) {
                    console.log("Forbidden - you have not liked this post")
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

    // function to delete a post, then reload the posts to update the posts on the screen
    delete_post = async (post_id, user_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Post deleted...")
                    this.get_posts(this.props.route.params.item.user_id)
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

    // Validtion to check if the user trying to delete the post is the user who created the post
    // if it is return true, else set an error message and return false
    handle_delete = async (author_id) => {
        console.log('handleDelete')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        if (author_id == id) {
            this.setState({
                isValidUserDelete: true,
            })
            console.log('isValidUserDelete ' + this.state.isValidUserDelete)
            return true
        } else {
            this.setState({
                isValidUserDelete: false,
                deletePostMessage: 'cannot delete a post you dont own',
            })
            console.log('isValidUserDelete ' + this.state.isValidUserDelete)
            return false
        }
    }

    // if the user is valid, delete the post, otherwise return false 
    execute_delete_call = (post_id, author_id) => {
        console.log('execute delete call')
        this.handle_delete(author_id)
            .then((response) => {
                //console.log(response)
                //return response
                if (response == false) {
                    console.log('isValidUserDelete ' + this.state.isValidUserDelete)
                    return false;
                } else {
                    this.delete_post(post_id, this.props.route.params.item.user_id)
                }
            })
    }

    // Validtion to check if the user trying to update the post is the user who created the post
    // if it is return true, else set an error message and return false
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

    // if the user is valid, navigate to the update friends post, and pass the post info and user id in the route
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
                    this.props.navigation.navigate('UpdateFriendsPost', item = { item, user_id: this.props.route.params.item.user_id })
                }
            })
    }

    // Validtion to check if the user trying to like the post isnt the user who created the post
    // if it isnt return true, else set an error message and return false
    handle_like = async (friend_id) => {
        console.log('handleDelete')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        if (friend_id == id) {
            this.setState({
                isValidUserLike: false,
                likePostMessage: 'Can only like posts of your friends',
            })
            console.log('isValidUserLike ' + this.state.isValidUserLike)
            return false
        } else {
            this.setState({
                isValidUserLike: true,
            })
            console.log('isValidUserLike ' + this.state.isValidUserLike)
            return true
        }
    }

    // if the user is valid, like the post, else return false
    execute_like_call = (friend_id, post_id) => {
        console.log('execute like call')
        this.handle_like(friend_id)
            .then((response) => {
                //console.log(response)
                if (response == false) {
                    console.log('isValidUserLike ' + this.state.isValidUserLike)
                    return false;
                } else {
                    this.like_Post(friend_id, post_id)
                }
            })
    }

    // Validtion to check if the user trying to unlike the post isnt the user who created the post
    // if it isnt return true, else set an error message and return false
    handle_unlike = async (friend_id) => {
        console.log('handleDelete')
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        if (friend_id == id) {
            this.setState({
                isValidUserUnlike: false,
                unlikePostMessage: 'Can only unlike posts of your friends',
            })
            console.log('isValidUserUnlike ' + this.state.isValidUserUnlike)
            return false
        } else {
            this.setState({
                isValidUserUnlike: true,
            })
            console.log('isValidUserUnlike ' + this.state.isValidUserUnlike)
            return true
        }
    }

    // if the user is valid, unlike the post, else return false
    execute_unlike_call = (friend_id, post_id) => {
        console.log('execute Unlike call')
        this.handle_unlike(friend_id)
            .then((response) => {
                //console.log(response)
                if (response == false) {
                    console.log('isValidUserUnlike ' + this.state.isValidUserUnlike)
                    return false;
                } else {
                    this.unlike_Post(friend_id, post_id)
                }
            })
    }

    render() {
        if (this.state.isLoading) {
            return (<View><Text>loading </Text></View>)
        }
        else{
            console.log(this.props.route)
            console.log(this.props.route.params.item.user_id)
            console.log(this.state.posts)
            return(
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // FlatList Container
                        data={this.state.posts}
                        renderItem={({ item }) =>
                        
                            <View style={styles.postContainer}>
                                <Image
                                    source={{
                                        uri: this.state.photo
                                    }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderWidth: 5
                                    }}
                                />
                                <View style={styles.postContainer}>
                                    <Text style={styles.titleText}>Post ID: {JSON.stringify(item.post_id)}</Text>
                                    <Text style={styles.titleText}>Text: {JSON.stringify(item.text)}</Text>
                                    <Text style={styles.titleText}>Author ID: {JSON.stringify(item.author.user_id)}</Text>
                                    <Text style={styles.titleText}>Author First Name: {JSON.stringify(item.author.first_name)}</Text>
                                    <Text style={styles.titleText}>Author Last Name: {JSON.stringify(item.author.last_name)}</Text>
                                    <Text style={styles.titleText}>Author Email: {JSON.stringify(item.author.email)}</Text>
                                    <Text style={styles.titleText}>Number Of Likes: {JSON.stringify(item.numLikes)}</Text>
                                </View>
                                <Button 
                                    title = "Like"
                                    onPress={() => this.execute_like_call(JSON.stringify(item.author.user_id), JSON.stringify(item.post_id))} // button to like a post
                                />
                                {this.state.isValidUserLike ? null : // display error message for liking a post
                                    <Text style={styles.errorMsg}>{this.state.likePostMessage}</Text>
                                }
                                <Button
                                    title="Unlike"
                                    onPress={() => this.execute_unlike_call(JSON.stringify(item.author.user_id), JSON.stringify(item.post_id))} // button to unlike a post
                                />
                                {this.state.isValidUserUnlike ? null : // display error message for unliking a post
                                    <Text style={styles.errorMsg}>{this.state.unlikePostMessage}</Text>
                                }
                                <Button
                                    title="Delete Post"
                                    onPress={() => (this.execute_delete_call(JSON.stringify(item.post_id), JSON.stringify(item.author.user_id)))} // button to delete a post
                                />
                                {this.state.isValidUserDelete ? null : //display error message for unliking a post
                                    <Text style={styles.errorMsg}>{this.state.deletePostMessage}</Text>
                                }
                                <Button
                                    title="Update Post"
                                    onPress={() => this.execute_update_call(JSON.stringify(item.author.user_id), item = { item,  })} // button to update a post
                                />
                                {this.state.isValidUserUpdate ? null : // display error message for updating a post
                                    <Text style={styles.errorMsg}>{this.state.updatePostMessage}</Text>
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
    errorMsg: {
        color: 'red'
    }
});

export default Post;