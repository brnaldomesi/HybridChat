import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ActivityIndicator } from 'react-native'
import { Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';

let _this = null;
var user;
var name;
export default class Main extends React.Component {
    state = { currentUser: null, avatar: null, data: 'some things' }
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
        name = navigation.getParam('name', 'NO-Name');
        return (
            <View style={styles.container}>
                <Avatar
                    source={{
                        uri:
                            navigation.getParam('pic', null) ? navigation.getParam('pic') : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded
                    size="xlarge"
                    title="profileImg"
                    activeOpacity={0.7}
                    containerStyle={{ marginBottom: 20, marginTop: 25 }}
                />
                <Text style={styles.text}> Please Join Below Chats!</Text>
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
        this.props.navigation.navigate('ChatUsers', { uid: user.uid });
    }

    gotoGroupUsersPage() {
        this.props.navigation.navigate('ChatGroups', { uid: user.uid, name: name });
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        marginTop: 20
    },
    text: {
        marginBottom: 20,
        fontSize: 15,
        color: '#0000ff'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
})