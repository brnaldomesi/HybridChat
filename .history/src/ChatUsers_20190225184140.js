import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'

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
        return (
            <View style={styles.container}>
               
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