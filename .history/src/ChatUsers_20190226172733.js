import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem, Text } from 'react-native-elements'
var user;

export default class ChatUsers extends React.Component {
    state = { currentUsers: [] }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'One To One Chat',
        };
    };

    componentDidMount() {
        user = firebase.auth().currentUser;
        const uid = navigation.getParam('uid');
        console.log('uid---', uid);
        firebase.database().ref(`/profile`).on('value', (snapshot) => {
            let list = snapshot.val();
            console.log('Data', snapshot.val());
            const message_array = [];

            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().id != uid) {
                    message_array.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                }
                console.log('userList', message_array);
            });
            this.setState({ currentUsers: message_array });
        });
    }

    render() {
        return (
            <View>
                {
                    this.state.currentUsers.map((list) => (
                        <ListItem
                            key={list.id}
                            leftAvatar={{ source: { uri: list.credentials.pic } }}
                            title={list.credentials.fullName}
                            chevronColor="black"
                            chevron
                            onPress={() => this.props.navigation.navigate('OneToOneChat', {
                                name: list.credentials.fullName,
                                email: user.email,
                                uid: list.uid
                            })}
                        />
                    ))
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})