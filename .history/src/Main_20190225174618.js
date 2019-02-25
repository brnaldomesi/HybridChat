import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';

let _this = null;

export default class Main extends React.Component {
    state = { currentUser: null }
    componentDidMount() {
        _this = this;
        const { currentUser } = firebase.auth()
        this.setState({ currentUser });
    }
    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Home ',
            headerRight: (
                <Button
                    onPress={() => _this.logout()}
                    title="Log out"
                    color="#FF0000"
                />
            ),
        };
    };

    render() {
        const { navigation } = this.props;
        const name = navigation.getParam('name', 'NO-Name');
        return (

            <View style={styles.container}>

                <Text >
                    Hi {name}!
        </Text>
            </View>
        )
    }

    logout() {
        firebase.auth().signOut();
        this.props.navigation.navigate('Login');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})