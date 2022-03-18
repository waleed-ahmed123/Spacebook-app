import { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This screen is to show the user a post that they have created.
//Does this by getting the parameters passed through the route. 
class ViewPost extends Component{
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            text: "",
            isLoading: true,
            //post: this.props.route.params.item
        }
    }

    render() {
        return (
            <View>
                <Text style={styles.titleText}>Update Post</Text>
                <Text style={styles.titleText}>Post ID: {this.props.route.params.item.post_id}</Text>
                <Text style={styles.titleText}>Text: {this.props.route.params.item.text}</Text>
                <Text style={styles.titleText}>Author ID: {(this.props.route.params.item.author.user_id)}</Text>
                <Text style={styles.titleText}>Author First Name: {(this.props.route.params.item.author.first_name)}</Text>
                <Text style={styles.titleText}>Author Last Name: {(this.props.route.params.item.author.last_name)}</Text>
                <Text style={styles.titleText}>Author Email: {(this.props.route.params.item.author.email)}</Text>
                <Text style={styles.titleText}>Number Of Likes: {(this.props.route.params.item.numLikes)}</Text>
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

export default ViewPost;