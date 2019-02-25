import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase'

export default class UserInfo extends React.Component {
    state = { fullName: '', address: '', phone: '', pic: '', data: 'some things', errorMessage: null }

 
    static navigationOptions = {
        headerTitle: 'User Info',
    };
    componentDidMount() {
        _this = this;
        this.setState({data: null});
        this.getUserData();
    }

    handleSignUp = () => {
        if(this.state.fullName && this.state.phone && this.state.phone) {
            this.setState({errorMessage: null});
            let credentials = {
                fullName: this.state.fullName,
                address: this.state.address,
                phone: this.state.phone,
                pic: ''
            };
            firebase.database().ref('Users/').set({
                credentials
            }).then((data) => {
                //success callback
                console.log('data ', data);
                this.props.navigation.navigate('Main')
            }).catch((error) => {
                //error callback
                console.log('error ', error)
            })
        } else {
            this.setState({errorMessage: "Please fill all fields"});
        }
        
    }
    render() {

        if (!this.state.data) {
            return (
                <View style={styles.container}>
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
                this.setState({data: 'data'});
                this.userInfo = snapshot.val();
                console.log('userData....', snapshot.val());
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