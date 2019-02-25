import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'

export default class UserInfo extends React.Component {
    state = { fullName: '', address: '', phone: '', errorMessage: null }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        _this = this;
        const { currentUser } = firebase.auth()
        this.setState({ currentUser });
        console.log('current User-------', this.currentUser);
        this.getUserData();
    }

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('Main'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    placeholder="fullName"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={fullName => this.setState({ fullName })}
                    value={this.state.fullName}
                />
                <TextInput
                    placeholder="Address"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={address => this.setState({ address })}
                    value={this.state.address}
                />
                <TextInput
                    placeholder="Phone"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={phone => this.setState({ phone })}
                    value={this.state.phone}
                />
                <Button title="Save" onPress={this.handleSignUp} />
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
    }
})