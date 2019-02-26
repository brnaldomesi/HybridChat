import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import Fire from './Fire';

type Props = {
  name?: string,
};
var userName;
class Chat extends React.Component<Props> {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name', 'Group Chat'),
  });

  state = {
    messages: [],
  };

  get user() {
    return {
      name: userName,
      _id: Fire.uid,
    };
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    new Fire(uid);
    Fire.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    userName = navigation.getParam('userName');
  }
  componentWillUnmount() {
    Fire.off();
  }
}

export default Chat;
