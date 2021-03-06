import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddNewFriendPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            text: "",
            isLoading: true,
            posts: []
        }
    }

    //function to add a post to a friends user. sends a POST request by adding the text inputted by the user, in the header 
    //then redirects back to the myfriends screen 
    addFriendsPost = async (friend_id) => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + friend_id + '/post', {
            method: 'POST',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: this.state.text
            })
        })
            .then((response) => {
                if (response.status === 201) {
                    console.log("Created new post...")
                    console.log("Now go to my friends page...")
                    this.props.navigation.navigate("MyFriends");
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
        //console.log(this.props.route)
        //console.log(this.props.route.params.item.user_id)
        return (
            <View>
                <Text style={styles.titleText}>Add New Post</Text>
                <View style={styles.postContainer}>
                    <TextInput
                        // text input to allow user to enter text to post
                        placeholder="Enter Text"
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                    <View>
                        <Button
                            // button to add a post to a friends feed. It passes the user id from the route as a parameter
                            title="Submit"
                            onPress={() => this.addFriendsPost(JSON.stringify(this.props.route.params.item.user_id))}
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

export default AddNewFriendPost;