import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';

export default class Main extends React.Component {
    state = { currentUser: null }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser });
        console.log('current User-------', this.currentUser);
    }
    static navigationOptions = {
        headerTitle: 'Home',
        headerRight: (
            <Button
                onPress={() => alert('This is a button!')}
                title="Log out"
                color="#ff1"
            />
        ),
    };

    render() {
        const { currentUser } = this.state
        return (

            <View style={styles.container}>

                <Text >
                    Hi {currentUser && currentUser.email}!
        </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})