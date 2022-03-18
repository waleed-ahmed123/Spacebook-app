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

class SignUpScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "joe",
            last_name: "joe",
            email: "joe@gmail.com",
            password: "joe123",
            firstNameMessage: "",
            lastNameMessage: "",
            emailMessage: "",
            passwordMessage: "",
            isValidFirstName: true,
            isValidLastName: true,
            isValidUser: true,
            isValidPassword: true
        }; 
    }

    // Sign up function - makes an API call to user with the inputted first name, last name, email, password
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

    // Validation for password - password must be greater than 4 characters
    handle_Valid_Password = () => {
        console.log("handlePassword")
        if (this.state.password.length > 4) {
            this.setState({
                isValidPassword: true
            })
            return true;
        } else {
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
        } else {
            this.setState({
                isValidUser: false,
                emailMessage: "Not a valid email format"
            })
            return false;
        }
    }

    // Validation for first name - it must be entered
    handle_Valid_First_Name = () => {
        console.log('handleValidFirstName')
        if (this.state.first_name.length > 0) {
            this.setState({
                isValidPassword: true
            })
            return true;
        } else {
            this.setState({
                isValidFirstName: false,
                firstNameMessage: "First Name Must Be Entered"
            })
            return false;
        }
    }

    // Validation for last name - it must be entered
    handle_Valid_Last_Name = () => {
        console.log('handleValidLastName')
        if (this.state.last_name.length > 0) {
            this.setState({
                isValidLastName: true
            })
            return true;
        } else {
            this.setState({
                isValidLastName: false,
                lastNameMessage: "Last Name Must Be Entered"
            })
            return false;
        }
    }

    // checks if all the validations return true and then executes the sign up function
    execute_signup_call = () => {
        if (this.handle_Valid_First_Name() === false || this.handle_Valid_Last_Name() === false || this.handle_Valid_User() === false || this.handle_Valid_Password() === false) {
            console.log("false")
            return false;
        } else {
            console.log("User Signed Up")
            this.SignUp();
        }
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
                {this.state.isValidFirstName ? null : // displays the error message if first name validation is false
                    <Text style={styles.errorMsg}>{this.state.firstNameMessage}</Text>
                }
                <TextInput
                    placeholder="Enter Last Name"
                    onChangeText={(last_name) => this.setState({ last_name })}
                    value={this.state.last_name}
                />
                {this.state.isValidLastName ? null : // displays the error message if last name validation is false
                    <Text style={styles.errorMsg}>{this.state.lastNameMessage}</Text>
                }
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
                    title="Sign Up"
                    onPress={() => this.execute_signup_call()}
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

export default SignUpScreen;