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
      _id: Fire.shared.uid,
    };
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    userName = navigation.getParam('userName');
    new Fire(uid);
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
