import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'react-native-firebase'
import Fire from './Fire';
import Lightbox from 'react-native-lightbox';
import { StyleSheet } from 'react-native'

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
  };

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      avatar: this.props.navigation.state.params.pic,
      _id: this.uid,
    };
  }

  showUserInfo(userInfo) {
    console.log('userInfo', userInfo);
  }

  render() {
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
    return (
      <View style={styles.container}>
        <Lightbox>
          <Image
            style={{ height: 300, width: 300 }}
            source={{
              uri: 'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg',
            }}
          />
        </Lightbox>
      </View>
    );
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
});

export default Chat;
