import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem } from 'react-native-elements'

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
        const list = [
            {
                name: 'Amy Farha',
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                subtitle: 'Vice President'
            },
            {
                name: 'Chris Jackson',
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                subtitle: 'Vice Chairman'
            },
        ]
        return (
            <View>
                {
                    this.state.currentUsers.map((list) => (
                        <ListItem
                            key={list.id}
                            leftAvatar={{ source: { uri: list.credentials.pic } }}
                            title={list.credentials.name}
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