import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import Toast, { DURATION } from 'react-native-easy-toast'
export default class SignUp extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    static navigationOptions = {
        header: null
    }

    handleSignUp = () => {
        let re = new RegExp("^[A-Za-z0-9._%+-]+@purelogics.net$");
        if (this.state.email !== '' && this.state.password !== '') {
            if (re.test(this.state.email)) {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(() => this.props.navigation.navigate('Main'))
                    .catch(error => this.setState({ errorMessage: error.message }))
            } else {
                this.refs.toast.show('Email Must Be From Pure Logics', DURATION.LENGTH_LONG);
            }
        } else {
            this.refs.toast.show('Please Enter Email and Password', DURATION.LENGTH_LONG);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'red' }}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'red' }}
                    defaultCloseDelay={3000}
                />
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <View style={styles.buttonLogin}>
                    <Button title="Sign Up" onPress={this.handleSignUp} />
                </View>
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    buttonLogin: {
        marginBottom: 20,
        marginTop: 20
    }
})