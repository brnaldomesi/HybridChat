import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ActivityIndicator, Alert } from 'react-native'
import { Button, Avatar } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { Header } from 'react-native-elements';

let _this = null;
var user;
var name;
export default class Main extends React.Component {
    state = { currentUser: null, avatar: null, data: 'some things' }

    async componentDidMount() {
        _this = this;
        this.checkPermission();
        user = firebase.auth().currentUser;
        this.createNotificationListeners(); //add this line
    }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Welcome ' + navigation.getParam('name', 'NO-Name'),
            headerRight: (
                <Button
                    onPress={() => _this.logout()}
                    title="Log out"
                    color="#FF0000"
                    type="clear"
                />
            ),
        };
    };

    render() {
        const { navigation } = this.props;
        name = navigation.getParam('name', 'NO-Name');
        return (
            <View style={styles.container}>
                <Avatar
                    source={{
                        uri:
                            navigation.getParam('pic', null) ? navigation.getParam('pic') : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded
                    size="xlarge"
                    title="profileImg"
                    activeOpacity={0.7}
                    containerStyle={{ marginBottom: 20, marginTop: 25 }}
                />
                <Text style={styles.text}> Please Join Chats!</Text>
                <Button
                    onPress={() => _this.gotoChatUsersPage()}
                    title="One to One Chat"
                    color="#FF0000"
                    type="outline"
                    style={styles.button}
                />
                <Button
                    onPress={() => _this.gotoGroupUsersPage()}
                    title="Group Chat"
                    color="#FF0000"
                    type="outline"
                />
            </View>
        )
    }

    logout() {
        firebase.auth().signOut();
        this.props.navigation.navigate('Login');
    }

    gotoChatUsersPage() {
        console.log('userId.....in..main', user.uid);
        this.props.navigation.navigate('ChatUsers', { uid: user.uid });
    }

    gotoGroupUsersPage() {
        this.props.navigation.navigate('ChatGroups', { uid: user.uid, name: name });
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }


    //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        marginBottom: 20
    },
    text: {
        marginBottom: 20,
        fontSize: 15,
        color: '#0000ff'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
})