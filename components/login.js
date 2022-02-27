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


class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "waleed.ahmed2@mmu.ac.uk",
            password: "waleed123",
            error: false,
            message: ""
        };
    }

    login = () => {

        // 1. Check email is valid from this.state or state ... can use email validator libraries
        // 2. Check the password is valid from this.state or state ... can use passord validator libraries

        // 3. if email and password are both valid... do the function

        //4. Else, display some error to the user
        

        fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then((response) => {
                if (response.status === 200){
                    return response.json()
                    .then(async (json) => {
                        console.log(json);
                        await storeData(json);
                        console.log("Now go home...")
                        this.props.navigation.navigate("Main");
                    })
                }
                if (response.status === 400) {
                    console.log("Invalid email or password")
                    this.error = true;
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
                <Text>Login</Text>
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
                    title="Login"
                    onPress={() => this.login()}
                />
                <Button
                    title="Sign Up"
                    onPress={() => this.props.navigation.navigate("SignUp")}
                />
            </View>
        );
    }
}

export default LoginScreen;