import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@spacebook_details', jsonValue)
    } catch (e) {
        console.error(e);
    }
} 

class SignUpScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "harry",
            last_name: "harry",
            email: "harry@gmail.com",
            password: "harry123"
        }; 
    }

    SignUp = () => {
        fetch('http://localhost:3333/api/1.0.0/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response) => {
                if (response.status === 201){
                    return response.json()
                    .then(async (json) => {
                        console.log(json);
                        await storeData(json);
                        console.log("Now go login...")
                        this.props.navigation.navigate("Login");
                    })
                }
                if (response.status === 400) {
                    console.log("Invalid email or password")
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
        return (
            <View>
                <Text>Sign Up</Text>
                <TextInput
                    placeholder="Enter First Name"
                    onChangeText={(first_name) => this.setState({ first_name })}
                    value={this.state.first_name}
                />
                <TextInput
                    placeholder="Enter Last Name"
                    onChangeText={(last_name) => this.setState({ last_name })}
                    value={this.state.last_name}
                />
                <TextInput
                    placeholder="Enter email"
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button
                    title="Sign Up"
                    onPress={() => this.SignUp()}
                />
            </View>
        );
    }
}

export default SignUpScreen;