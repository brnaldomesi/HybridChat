import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';

let _this = null;
var user;
export default class Main extends React.Component {
    state = { currentUser: null }
    componentDidMount() {
        _this = this;
        user = firebase.auth().currentUser;
    }
    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Welcome ' + navigation.getParam('name', 'NO-Name'),
            headerRight: (
                <Button
                    onPress={() => _this.logout()}
                    title="Log out"
                    color="#FF0000"
                    type="clear"
                />
            ),
        };
    };

    render() {
        const { navigation } = this.props;
        const name = navigation.getParam('name', 'NO-Name');
        return (

            <View style={styles.container}>
                <Text  style={styles.text}> Please go ahead and joind one the below Chat</Text>
                <Button
                    onPress={() => _this.gotoChatUsersPage()}
                    title="One to One Chat"
                    color="#FF0000"
                    type="outline"
                    style={styles.button}
                />
                <Button
                    onPress={() => _this.gotoGroupUsersPage()}
                    title="Group Chat"
                    color="#FF0000"
                    type="outline"
                />
            </View>
        )
    }

    logout() {
        firebase.auth().signOut();
        this.props.navigation.navigate('Login');
    }

    gotoChatUsersPage() {
        console.log('userId.....in..main', user.uid);
        this.props.navigation.navigate('ChatUsers', {uid: user.uid});
    }

    gotoGroupUsersPage() {
        this.props.navigation.navigate('Chat');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        marginBottom: 20
    },
    text: {
        marginBottom: 20,
        fontSize: 15,
        color: '#0000ff'
    }
})