import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem } from 'react-native-elements'

export default class ChatUsers extends React.Component {


    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'One To One Chat',
        };
    };

    componentDidMount() {

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
                    list.map((l, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={{ source: { uri: l.avatar_url } }}
                            title={l.name}
                            subtitle={l.subtitle}
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