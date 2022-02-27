import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//82.28.33.223

// const getData = async (done) => {
//     try {
//         const jsonValue = await AsyncStorage.getItem('@spacebook_details')
//         const data = JSON.parse(jsonValue);
//         return done(data);
//     } catch (e) {
//         console.error(e);
//     }
// }

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login_info: {},
            photo: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        await this.get_profile_image();
        this.setState({
            isLoading: false
        });
        console.log(this.state.photo);
    }

    get_profile_image = async () => {
        // Get these from AsyncStorage
        //let id = this.state.login_info.id;
        //let token = this.state.login_info.token; 
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details);
        let id = parsed_details.id;
        let token = parsed_details.token;

        console.log("here", id, token);

        // let id = 8;
        // let token = '7395cf6377fa0233063098a075bf2483';
        fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
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
                this.setState({photo: data});
            })
            .catch((err) => {
                console.log("error, something went wrong", err)
            });
    }



    /* componentDidMount() {
        this.get_profile_image();
    } */


    render() {
        if (!this.state.isLoading) {
            return (
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
                            title="Update Profile"
                            onPress={() => (this.props.navigation.navigate("UpdateProfile"))}
                        />
                    </View>
                    
                </View>
                
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
});

export default HomeScreen;

