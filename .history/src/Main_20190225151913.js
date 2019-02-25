import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import firebase from 'react-native-firebase'

export default class Main extends React.Component {
    state = { currentUser: null }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser });
        console.log('current User-------', this.currentUser);
    }

    render() {
        const { currentUser } = this.state
        return (
            <View >
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <Text style={styles.container}> 
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