import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'react-native-firebase'
import Fire from './Fire';
import Lightbox from 'react-native-lightbox';
import { Button, Avatar } from 'react-native-elements';

import {
  Dimensions,
  Image,
  StyleSheet,
  Modal, Text, TouchableHighlight, View, Alert,
  TouchableOpacity,
} from 'react-native'

type Props = {
  name?: string,
};
var gid;

class Chat extends React.Component<Props> {

  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
    img: false,
    userInfo: ''
  };

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      avatar: this.props.navigation.state.params.pic,
      _id: this.uid,
    };
  }

  showUserInfo(userInfo) {
    this.setState({userInfo: userInfo});
    this.setState({img: true});
  }

  showModal() {
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.img}
          onRequestClose={() => {
            this.setState({img: false})
          }}>
          <Avatar
            source={{
              uri:
              this.state.userInfo.avatar ? this.state.userInfo.avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            }}
            rounded
            size="xlarge"
            title="profileImg"
            activeOpacity={0.7}
            containerStyle={{ marginBottom: 20, marginTop: 25 }}
          />
        </Modal>
      </View>
    );
  }

  render() {
    if (this.state.img) {
      this.showModal();
    }

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        onPressAvatar={user => this.showLightBox(user)}
      />
    );
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
  },
  closeButton: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 3,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
  },
  customHeaderBox: {
    height: 150,
    backgroundColor: '#6C7A89',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Chat;
