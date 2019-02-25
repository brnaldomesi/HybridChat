import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';

let _this = null;

export default class Main extends React.Component {
    state = { currentUser: null }
    componentDidMount() {
        _this = this;
    }
    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: navigation.getParam('name', 'NO-Name'),
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

                <Button
                    onPress={() => _this.logout()}
                    title="One to One Chat"
                    color="#FF0000"
                    type="Solid"
                />
                 <Button
                    onPress={() => _this.logout()}
                    title="Group Chat"
                    color="#FF0000"
                    type="Solid"
                />
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
        alignItems: 'center',
        flexDirection: 'column'
    }
})