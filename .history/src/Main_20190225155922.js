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
        console.log('current User-------', this.currentUser);
    }

    static navigationOptions = {
        headerTitle: 'Home',
        headerRight: (
            <Button
                onPress={() => _this.logout()}
                title="Log out"
                color="#FF0000"
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

    logout() {
        firebase.auth().signOut();
        this.props.navigation.navigate('Login');
    }

    getUserData() {
        firebase.authState.take(1).subscribe(data => {
            console.log('UserId.........', firebase.database().ref(`profile/${data.uid}`));
            //   this.uid = data.uid;
            //   firebase.database().ref(`profile/${data.uid}`).on('value', (snapshot) => {
            //     this.userInfo = snapshot.val();
            //     console.log('value', snapshot.val());
            //     if (this.userInfo) {
            //       this.storage.set('userInfo', this.userInfo);
            //       this.events.publish('user:created', this.userInfo);
            //       if (this.navParams.get('data')) {
            //         this.setUserData();
            //       } else {
            //         this.navCtrl.setRoot(HomePage);
            //       }
            //     }
            //   });
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})