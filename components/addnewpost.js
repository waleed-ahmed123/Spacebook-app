import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddNewPost extends Component{
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            text: "",
            isLoading: true,
            posts: []
        }
    }

    //function to add a new post. Makes a POST request by taking the text inputted by the user 
    //then navigates back to the home screen.
    addPost = async () => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details)
        let id = parsed_details.id
        let token = parsed_details.token
        fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
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
                    console.log("Now go home...")
                    this.props.navigation.navigate("Home");
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
       return(
           <View>
               <Text style = {styles.titleText}>Add New Post</Text>
               <View style = {styles.postContainer}>
                    <TextInput
                        // text input to allow user to post something
                        placeholder="Enter Text"
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                    <View>
                        <Button
                            title = "Submit"
                            onPress = {() => this.addPost()} // add post button
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

export default AddNewPost;