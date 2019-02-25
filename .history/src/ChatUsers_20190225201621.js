import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem, Text } from 'react-native-elements'

export default class ChatUsers extends React.Component {

    state = { currentUsers: [] }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'One To One Chat',
        };
    };

    componentDidMount() {
        firebase.database().ref(`/profile`).on('value', (snapshot) => {
            let list = snapshot.val();
            console.log('Data', snapshot.val());
            const message_array = [];

            snapshot.forEach((childSnapshot) => {
                message_array.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
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