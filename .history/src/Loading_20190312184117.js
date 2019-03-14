import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'

export default class Loading extends React.Component {

    const renderScene = (route, navigator) => {
        const Component = route.component;
      
        return (
          <Component navigator={navigator} route={route} {...route.passProps} />
        );
      };
      
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'ChatGroups' : 'Login')
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
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