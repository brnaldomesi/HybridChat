import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import DialogInput from 'react-native-dialog-input';
import { Button } from 'react-native-elements';

let _this = null;
var uid;
export default class ChatGroups extends React.Component {
    state = { isDialogVisible: false, currentGroups: [] }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Groups',
            headerRight: (
                <Button
                    onPress={() => _this.showGroupDialog()}
                    title="Create Group"
                    color="#FF0000"
                    type="clear"
                />
            ),
        };
    };

    componentDidMount() {
        _this = this;
        const { navigation } = this.props;
        uid = navigation.getParam('uid');
        firebase.database().ref(`/groups`).on('value', (snapshot) => {
            let list = snapshot.val();
            console.log('Data', snapshot.val());
            const message_array = [];

            snapshot.forEach((childSnapshot) => {
                message_array.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
                console.log('groupList', message_array);
            });
            this.setState({ currentGroups: message_array });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"New Group Creation"}
                    message={"Please Enter Your Group Name"}
                    hintInput={"Tech verx"}
                    submitInput={(inputText) => { this.sendInput(inputText) }}
                    closeDialog={() => { this.showDialog(false) }}>
                </DialogInput>
                {
                    this.state.currentGroups.map((list) => (
                        <ListItem
                            key={list.id}
                            leftAvatar={{ source: { uri: list.pic } }}
                            title={list.groupName}
                            chevronColor="black"
                            chevron
                            onPress={() => this.props.navigation.navigate('Chat', {
                                name: list.groupName,
                                uid: uid
                            })}
                        />
                    ))
                }
            </View>
        )
    }

    showGroupDialog() {
        this.setState({ isDialogVisible: true });
    }

    sendInput(groupName) {
        console.log('groupName', groupName);
        this.setState({ isDialogVisible: false });
        console.log('credentials', credentials);
        let pic = 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
        firebase.database().ref(`groups/${uid}`).set({
            groupName,
            pic
        }).then((data) => {
            //success callback
            console.log('Response.... ', data);
        }).catch((error) => {
            //error callback
            console.log('error ', error)
        })
    }

    showDialog(isDialogVisible) {
        this.setState({ isDialogVisible: false });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})