import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ActivityIndicator } from 'react-native'
import { Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { Header } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
let _this = null;
var user;
var name;
export default class Main extends React.Component {
    state = { currentUser: null, avatar: null, data: 'some things' }
    componentDidMount() {
        _this = this;
        user = firebase.auth().currentUser;
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

        if (!this.state.data) {
            return (
                <View style={styles.container}>
                    <Text>Please wait while image is uploading</Text>
                    <ActivityIndicator
                        animating={true}
                        style={styles.indicator}
                        size="large"
                    />
                </View>
            );
        }

        const { navigation } = this.props;
        name = navigation.getParam('name', 'NO-Name');
        return (


            <View style={styles.container}>
                <Avatar
                    source={{
                        uri:
                            this.state.avatar ? this.state.avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded
                    size="xlarge"
                    title="profileImg"
                    onPress={() => _this.getImage()}
                    activeOpacity={0.7}
                    containerStyle={{ marginBottom: 20, marginTop: 25 }}
                    showEditButton
                />
                <Text style={styles.text}> Please go ahead and joind one of the below Chat</Text>
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

    getImage() {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            this.setState({data: null});
            this.uploadImage(response.uri, 'image/jpeg', 'Profile Image');
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                //const source = { uri: response.uri };

                // You can also display the image using data:
                const source = 'data:image/jpeg;base64,' + response.data;

                this.setState({
                    avatar: source,
                });
            }
        });
    }

    uploadImage(uri, mime = 'image/jpeg', name) {
        return new Promise((resolve, reject) => {
            let imgUri = uri; let uploadBlob = null;
            const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
            const { currentUser } = firebase.auth();
            const imageRef = firebase.storage().ref(`/userProfile/${currentUser.uid}`)

            fs.readFile(uploadUri, 'base64')
                .then(data => {
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                .then(blob => {
                    uploadBlob = blob;
                    return imageRef.put(blob, { contentType: mime, name: name });
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL();
                })
                .then(url => {
                    this.setState({data: 'data'});
                    resolve(url);
                })
                .catch(error => {
                    this.setState({data: 'data'});
                    reject(error)
                })
        })
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
    }
})