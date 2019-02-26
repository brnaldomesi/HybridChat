import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import DialogInput from 'react-native-dialog-input';
import { Button } from 'react-native-elements';

let _this = null;
export default class ChatGroups extends React.Component {
    state = { isDialogVisible: false }

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
        firebase.database().ref(`groups/${this.state.uid}`).set({
            groupName
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