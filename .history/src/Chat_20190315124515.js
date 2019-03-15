import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { Icon } from 'react-native-elements'

import {
  Dimensions,
  Image,
  StyleSheet,
  Modal, Text, TouchableHighlight, View, Alert,Platform,
  TouchableOpacity,
} from 'react-native'

type Props = {
  name?: string,
};
var gid;

class Chat extends React.Component<Props> {

  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    return {
      title: (navigation.state.params || {}).name || 'Chat!',
      headerRight: (
        <Icon
        raised
        name='image'
        type='font-awesome'
        color='#f50'
        onPress={() => this.getImage} />
      ),
    };
  };

  state = {
    messages: [],
    img: false,
    userInfo: '',
    pic: '',
    data: 'some things'
  };

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      avatar: this.props.navigation.state.params.pic,
      _id: this.uid,
      designation: this.props.navigation.state.params.designation
    };
  }

  showUserInfo(userInfo) {
    console.log('userINfo', userInfo);
    this.setState({ userInfo: userInfo });
    this.setState({ img: true });
    Alert.alert(
      userInfo.name,
      userInfo.designation,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: true },
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        onPressAvatar={user => this.showUserInfo(user)}
      />
    );
  }

  setModalVisible() {
    this.setState({ img: false });
  }
  componentDidMount() {
    const { navigation } = this.props;
    gid = navigation.getParam('gid', '');
    this.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    this.off();
    this.setState({ img: false });
  }


  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref(`chatgroups/${gid}`);
  }

  showLightBox() {
    this.setState({ img: true });
  }

  parse = snapshot => {
    console.log('pars called', snapshot);
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback => {
    console.log('on called', this.state.gid);
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
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
       // this.uploadImage(response.uri, 'image/jpeg', 'Profile Image');
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
                this.setState({ pic: url });
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
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  }
})
export default Chat;
