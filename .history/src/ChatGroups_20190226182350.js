import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import DialogInput from 'react-native-dialog-input';

let _this = null;
export default class ChatGroups extends React.Component {
    state = { isDialogVisible: false }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Chat Groups',
            headerRight: (
                <Button
                    onPress={() => _this.showGroupDialog()}
                    title="Create New Group"
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