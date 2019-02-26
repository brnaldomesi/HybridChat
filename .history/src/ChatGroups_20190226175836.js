import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'

let _this = null;
export default class ChatGroups extends React.Component {

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
               
            </View>
        )
    }

    showGroupDialog() {
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})