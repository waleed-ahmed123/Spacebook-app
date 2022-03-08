import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Post extends Component{
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            details: [],
            isLoading: true,
            like: false
        }
    }

    async componentDidMount() {
        //this.get_posts(JSON.stringify(this.props.route.params.item.user_id))
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_posts(JSON.stringify(this.props.route.params.item.user_id));
        });
    }


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

    likePost = async (friend_id, post_id) => {
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

    unLikePost = async (friend_id, post_id) => {
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
                    console.log("Post liked...")
                    this.get_posts(friend_id)
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
            return (<View><Text>loading </Text></View>)
        }
        else{
            console.log(this.props.route)
            console.log(this.props.route.params.item.user_id)
            return(
                <ScrollView>
                    <FlatList
                        style={styles.FLContainer} // FlatList Container
                        data={this.state.posts}
                        renderItem={({ item }) =>
                            <View style={styles.postContainer}>
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
                                    onPress={() => this.likePost(JSON.stringify(item.author.user_id), JSON.stringify(item.post_id))}
                                />
                                <Button
                                    title="Unlike"
                                    onPress={() => this.unLikePost(JSON.stringify(item.author.user_id), JSON.stringify(item.post_id))}
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
    button: {

    }
});

export default Post;