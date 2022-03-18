import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// function to store the user id and token once the user has logged in successfully.
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
            emailMessage: "",
            passwordMessage: "",
            isValidUser: true,
            isValidPassword: true
        };
    }

    // login function - takes in the inputted email and password and makes an api call to login
    //if successful, stores the user id and token in async storage, navigates to home page
    login = () => {
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

    // Validation for password - password must be greater than 4 characters
    handle_Valid_Password = () => {
        console.log("handlePassword")
        if(this.state.password.length > 4){
            this.setState({
                isValidPassword: true
            })
            return true;
        } else{
            this.setState({
                isValidPassword: false,
                passwordMessage: "Password must be greater than 4 characters"
            })
            return false;
        }
    }

    // Validation for email - it must be entered and in a valid email format
    handle_Valid_User = () => {
        console.log("handleUser")
        const regex = /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$)$/;
        if (!this.state.email.length > 0) {
            this.setState({
                isValidUser: false,
                emailMessage: "Email field Must be entered",
            })
            return false;
        } else if (regex.test(this.state.email)) {
            this.setState({
                isValidUser: true
            })
            return true;
        }else {
            this.setState({
                isValidUser: false,
                emailMessage: "Not a valid email format"
            })
            return false;
        }
    }

    // checks if the email and password validations return true, then executes the login function
    // otherwise return false
    execute_login_call= () => {
        console.log(this.handle_Valid_Password())
        if (this.handle_Valid_User() === false || this.handle_Valid_Password() === false) {
            console.log("false")
            return false;
        }else {
            console.log("now login")
            this.login();
        }
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
                {this.state.isValidUser ? null : // displays the error message if email validation is false
                    <Text style={styles.errorMsg}>{this.state.emailMessage}</Text>
                } 
                <TextInput
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                {this.state.isValidPassword ? null : // displays the error message if password validation is false
                    <Text style={styles.errorMsg}>{this.state.passwordMessage}</Text>
                }
                <Button
                    title="Login"
                    onPress={() => this.execute_login_call()}
                />
                <Button
                    title="Sign Up"
                    onPress={() => this.props.navigation.navigate("SignUp")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errorMsg: {
        color: 'red'
    }
})

export default LoginScreen;