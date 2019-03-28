
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,Image,AsyncStorage} from 'react-native';
import {Header,Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Entypo';

class ChatList extends Component{
    constructor(props){
        super(props)
        this.state = {
            avatarBase64:'',
            queryUserName:''
        }
    }
    async componentDidMount(){
        let avatarBase64 = await AsyncStorage.getItem('avatarBase64')
        this.setState({avatarBase64})

    }
    async wueryUser(){

    }

    render(){
        return(
        <View >
            <Header
            leftComponent={<Image    
                            style = {{width:40,height:40,borderRadius:20}}
                            source={{ uri: `data:image/png;base64,${this.state.avatarBase64}` || ''}}
                         />}
            centerComponent={{ text: '简易QQ', style: { color: '#fff' } }}
            rightComponent={<Icon name = 'add-to-list' size = {24} color = 'white'/>}
            />
            
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Text>聊天列表</Text>
            <Button
                title="Go to My"
                onPress={() => this.props.navigation.navigate('My')}
                />
        </View>
        ) 
    }
}
export default ChatList