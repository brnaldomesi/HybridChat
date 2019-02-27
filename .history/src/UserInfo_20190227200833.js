import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { Button, Avatar } from 'react-native-elements';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
let _this = null;

export default class UserInfo extends React.Component {
    state = { fullName: '', address: '', phone: '', pic: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg', data: 'some things', uid: '', errorMessage: null }


    static navigationOptions = {
        headerTitle: 'User Profile',
    };

    componentDidMount() {
        _this = this;
        this.setState({ data: null });
        this.getUserData();
    }

    handleSignUp = () => {
        if (this.state.fullName && this.state.phone && this.state.phone) {
            this.setState({ errorMessage: null });
            this.setState({ data: null });
            let credentials = {
                fullName: this.state.fullName,
                address: this.state.address,
                phone: this.state.phone,
                pic: this.state.pic
            };
            console.log('credentials', credentials);
            firebase.database().ref(`profile/${this.state.uid}`).set({
                credentials
            }).then((data) => {
                this.setState({ data: 'data' });
                //success callback
                console.log('data ', data);
                this.props.navigation.navigate('Main', { name: 'Sir' });
            }).catch((error) => {
                //error callback
                console.log('error ', error)
            })
        } else {
            this.setState({ errorMessage: "Please fill all fields" });
        }

    }
    render() {

        if (!this.state.data) {
            return (
                <View style={styles.container}>
                    <Text>Please wait</Text>
                    <ActivityIndicator
                        animating={true}
                        style={styles.indicator}
                        size="large"
                    />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Avatar
                    source={{
                        uri:
                            this.state.pic ? this.state.pic : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded
                    size="xlarge"
                    title="profileImg"
                    onPress={() => _this.getImage()}
                    activeOpacity={0.7}
                    containerStyle={{ marginBottom: 20, marginTop: 25 }}
                    showEditButton
                />
                <Text>User Profile</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    placeholder="fullName"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={fullName => this.setState({ fullName })}
                    value={this.state.fullName}
                />
                <TextInput
                    placeholder="Address"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={address => this.setState({ address })}
                    value={this.state.address}
                />
                <TextInput
                    placeholder="Phone"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={phone => this.setState({ phone })}
                    value={this.state.phone}
                />
                <Button title="Save" onPress={this.handleSignUp} />
            </View>
        )
    }

    getUserData() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ uid: user._user.uid });
            firebase.database().ref(`profile/${user._user.uid}`).once('value', (snapshot) => {
                this.setState({ data: 'data' });
                let userInfo = snapshot.val();
                console.log('userData....', userInfo);
                if (userInfo !== null) {
                    this.props.navigation.navigate('Main', { name: userInfo.credentials.fullName });
                }
            });
        });
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
            console.log('Response = ', response, response.uri);
            this.setState({ data: null });
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
                    pic: source,
                });
            }
        });
    }

    uploadImage(uri, mime = 'image/jpeg', name) {
        return new Promise((resolve, reject) => {
            let imgUri = uri; let uploadBlob = null;
            const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
            const { currentUser } = firebase.auth();
            const imageRef = firebase.storage().ref('userProfile').child(`${currentUser.uid}`)

            fs.readFile(uploadUri, 'base64')
                .then(data => {
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                .then(blob => {
                    uploadBlob = blob;
                    // return imageRef.put(blob, { contentType: mime, name: name });
                    return imageRef.put(uri, { contentType: mime });
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL();
                })
                .then(url => {
                    this.setState({ data: 'data' });
                    resolve(url);
                })
                .catch(error => {
                    this.setState({ data: 'data' });
                    reject(error)
                })
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
})