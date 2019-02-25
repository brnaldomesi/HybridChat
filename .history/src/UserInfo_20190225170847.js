import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'

export default class UserInfo extends React.Component {
    state = { fullName: '', address: '', phone: '', pic: '',errorMessage: null }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        _this = this;
        this.getUserData();
    }

    handleSignUp = () => {
        let credentials = {
            fullName: this.state.fullName,
            address: this.state.address,
            phone: this.state.phone,
            pic: ''
          };
        firebase.database().ref('Users/').set({
            credentials
        }).then((data)=>{
            //success callback
            console.log('data ' , data)
        }).catch((error)=>{
            //error callback
            console.log('error ' , error)
        })
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

    getUserData() {
        firebase.auth().onAuthStateChanged(user => {
            firebase.database().ref(`profile/${user._user.uid}`).on('value', (snapshot) => {
                this.userInfo = snapshot.val();
                console.log('value', snapshot.val());
                if (this.userInfo) {
                    this.props.navigation.navigate('Main')
                }
            });
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
    }
})