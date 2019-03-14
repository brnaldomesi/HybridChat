import React from 'react'
import { StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { LoginManager, LoginButton, AccessToken } from "react-native-fbsdk";
import Toast, { DURATION } from 'react-native-easy-toast'

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null, data: 'some data' }

    static navigationOptions = {
        header: null
    }

    handleLogin = () => {
        const { email, password } = this.state
        let re = new RegExp("^[A-Za-z0-9._%+-]+@purelogics.net|info$");
        if (this.state.email !== '' && this.state.password !== '') {
            if (re.test(this.state.email)) {
                this.setState({ data: null });
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        this.setState({ data: 'data fetched' });
                        this.setState({ data: 'data' });
                        this.props.navigation.navigate('Main');
                    })
                    .catch(error => {
                        this.setState({ data: 'data' });
                        this.refs.toast.show(error.message, DURATION.LENGTH_LONG)
                    })
            } else {
                this.refs.toast.show('Email Must Be From Pure Logics', DURATION.LENGTH_LONG);
            }
        } else {
            this.refs.toast.show('Please Enter Email and Password', DURATION.LENGTH_LONG);
        }
    }

    render() {
        if (!this.state.data) {
            return (
                <View style={styles.container}>
                    <Text>Please wait a moment</Text>

                    <ActivityIndicator
                        animating={true}
                        style={styles.indicator}
                        size="large"
                    />
                </View>
            );
        }

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
                    textStyle={{ color: 'white' }}
                    defaultCloseDelay={3000}
                />
                <Button
                    onPress={() => this.onLoginFacebook()}
                    title="Login With Facebook"
                    color="#FF0000"
                    type="outline"
                    style={styles.button}
                />
                <Text style={styles.text}>Or Login With Email</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                {/* <Button title="Login" onPress={this.handleLogin} /> */}
                <View style={styles.buttonLogin}>
                <Button
                    title="Login"
                    onPress={this.handleLogin}
                    type="solid"
                />
                </View>
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    type="solid"
                />
            </View>
        )
    }

    onLoginFacebook = () => {
        console.log('fb login called......')
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
            (result) => {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        const { accessToken } = data
                        const facebookCredential = firebase.auth.FacebookAuthProvider
                            .credential(accessToken);
                        firebase.auth().signInWithCredential(facebookCredential)
                            .then(success => {
                                console.log("Firebase success: ", success);
                                this.props.navigation.navigate('Main', { social: true, name: success.additionalUserInfo.profile.first_name + ' ' + success.additionalUserInfo.profile.last_name, pic: success.additionalUserInfo.profile.picture.data.url });
                            });
                    })
                }
            }
        ).then((data) => {
        });
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
    button: {
        marginBottom: 20
    },
    buttonLogin: {
        marginBottom: 20,
        marginTop: 20
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 5,
        fontSize: 15,
        color: '#0000ff'
    }
})