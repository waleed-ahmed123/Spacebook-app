import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


class UpdateProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "waleed",
            last_name: "ahmed",
            email: "waleed.ahmed2@mmu.ac.uk",
            password: "waleed123",
            photo: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details);
        let id = parsed_details.id;
        let token = parsed_details.token;
        //display the image of the user each time the screen loads
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.get_profile_image(id);
        });
        this.setState({
            // set the photo to the profile image of the user
            photo: this.get_profile_image(id),
            isLoading: false
        });
    }

    //Function to get the image of a user. 
    //sets the image to the returned data
    get_profile_image = async (user_id) => {
        // Get these from AsyncStorage
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details);
        let id = parsed_details.id;
        let token = parsed_details.token;
        //let id = 8;
        //let token = '7395cf6377fa0233063098a075bf2483';
        
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
                    //login_info: {},
                    photo: data,
                    isLoading: false
                });
            })
            .then((response) => {
                console.log("Picture Displayed", response);
            })
            .catch((err) => {
                console.log("error, something went wrong", err)
            });
    }

    //Function to update a users information. send a POST request, then navigates back the home screen
    updateInfo = async () => {
        let details = await AsyncStorage.getItem('@spacebook_details')
        let parsed_details = JSON.parse(details);
        let id = parsed_details.id;
        let token = parsed_details.token;
        fetch('http://localhost:3333/api/1.0.0/user/'+ id, {
            method: 'PATCH',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(async (response) => {
                if (response.status === 200) {
                    console.log("Now go Home...")
                    this.props.navigation.navigate("Home");
                }
                if (response.status === 400) {
                    console.log("Bad Request")
                    //this.error = true;
                }
                if (response.status === 401) {
                    console.log("Bad Request")
                    //this.error = true;
                }
                if (response.status === 402) {
                    console.log("Unauthorised")
                    //this.error = true;
                }
                if (response.status === 403) {
                    console.log("Forbidden")
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

    handleChoosePhoto = () => {
        const options = {};
        ImagePicker.launchImageLibrary(options, response =>{
            console.log("response ", response);
        })
    };

    

    render() {
        return (
            <View>
                <Text>Update Profile</Text>

                <Image
                    source={{
                        uri: this.state.photo,
                    }}
                    style={styles.imageContainer}
                />
                <View style={styles.uploadPhotoButton}>
                    <Button title = "Upload Profile Photo" />
                </View>
                <View style={styles.container}>
                    <View style={styles.emailContainer}>
                        <Text>Update First Name </Text>
                        <TextInput
                            //Sets the inputted text to the first name state 
                            placeholder="Enter First Name"
                            onChangeText={(first_name) => this.setState({ first_name })}
                            value={this.state.first_name}
                        />
                    </View>
                    <View style={styles.emailContainer}>
                        <Text>Update Last Name </Text>
                        <TextInput
                            //Sets the inputted text to the last name state 
                            placeholder="Enter Last Name"
                            onChangeText={(last_name) => this.setState({ last_name })}
                            value={this.state.last_name}
                        />
                    </View>
                    <View style={styles.emailContainer}>
                        <Text>Update Email </Text>
                        <TextInput
                            //Sets the inputted text to the email state 
                            placeholder="Enter email"
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>
                    <View style={styles.emailContainer}> 
                        <Text>Update Password </Text>
                        <TextInput
                            //Sets the inputted text to the password state 
                            placeholder="Enter password"
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry={true}
                         /> 
                    </View>
                </View>
                <Button
                    // button to allow a user to update a profile information
                    title="Update"
                    onPress={() => (this.updateInfo())}
                />
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 12,
        borderRadius: 25,
        marginLeft: 50,
        //alignSelf: 'flex-start',
        width: "75%"
    },
    emailContainer: {
        flex: 1,
        //width: '50%',
        //backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        textAlign: 'center',
        marginBottom: 6
    },
    imageContainer: {
        width: 350,
        height: 350,
        borderWidth: 5,
        borderRadius: 25
    },
    uploadPhotoButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default UpdateProfileScreen;