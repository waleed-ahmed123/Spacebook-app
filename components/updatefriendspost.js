import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateFriendsPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            text: "",
            isLoading: true,
            //post: this.props.route.params.item
        }
    }

    componentDidMount() {
        console.log(this.props.route.params.user_id)
    }

    //function for updating a post on your friends feed. takes in the text inputted and makes a call to update
    //then navigates back to the myfriends screen
    updatePost = async (author_id, post_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + author_id + '/post/' + post_id, {
            method: 'PATCH',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: this.state.text
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Updated post...")
                    console.log("Now go to myfriends...")
                    this.props.navigation.navigate("MyFriends");
                }
                if (response.status === 400) {
                    console.log("Bad Request")
                }
                if (response.status === 401) {
                    console.log("Unauthorised")
                }
                if (response.status === 403) {
                    console.log("Forbidden - you can only update your own posts")
                }
                if (response.status === 404) {
                    console.log("Not found")
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
        console.log(this.props.route.params.user_id)
        return (
            <View>
                <Text style={styles.titleText}>Update Post</Text>
                <Text style={styles.titleText}>Post ID: {this.props.route.params.item.item.post_id}</Text>
                <Text style={styles.titleText}>Text: {this.props.route.params.item.item.text}</Text>
                <Text style={styles.titleText}>Author ID: {(this.props.route.params.item.item.author.user_id)}</Text>
                <Text style={styles.titleText}>Author First Name: {(this.props.route.params.item.item.author.first_name)}</Text>
                <Text style={styles.titleText}>Author Last Name: {(this.props.route.params.item.item.author.last_name)}</Text>
                <Text style={styles.titleText}>Author Email: {(this.props.route.params.item.item.author.email)}</Text>
                <Text style={styles.titleText}>Number Of Likes: {(this.props.route.params.item.item.numLikes)}</Text>
                <View style={styles.postContainer}>
                    <TextInput
                        placeholder="Enter Text"
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                    <View>
                        <Button
                            //Button to update a post. Sends a call to the function by passing the user id and post id, from the route
                            title="Submit"
                            onPress={() => this.updatePost(JSON.stringify(this.props.route.params.user_id), JSON.stringify(this.props.route.params.item.item.post_id))}
                        />
                    </View>
                </View>

            </View>
        )
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

export default UpdateFriendsPost;