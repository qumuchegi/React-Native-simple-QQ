import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,Image,AsyncStorage} from 'react-native';
import {Card} from 'react-native-elements'
 


const users = [
    {
       name: 'brynn',
       avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    
   ]
class My extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'',
            userID:'',
            sex:'',
            job:'',
            avatarBase64:''

        }
    }
    async componentDidMount(){
        let username = await AsyncStorage.getItem('username')
        let userID = await AsyncStorage.getItem('userID')
        let sex = await AsyncStorage.getItem('sex')
        let job = await AsyncStorage.getItem('job')
        let avatarBase64 = await AsyncStorage.getItem('avatarBase64')
        // avatarURL  = `http://localhost:3003${ avatarURL.replace(/asset\/user_avatar/,'')}`
        this.setState({username, userID, sex, job, avatarBase64})

    }
    render(){
        let that = this
        return(
        <View>
            <Image    
                style = {{width:60,height:60}}
                source={{ uri: `data:image/png;base64,${this.state.avatarBase64}` || ''}}
            />
            <Button onPress = {()=>console.log(`data:image/png;base64,${this.state.avatarBase64}` || '')} title="打印URL"/>
            <Button
                title="Go to 注册"
                onPress={() => this.props.navigation.navigate('注册')}
                />
                <Button
                title="Go to 登录"
                onPress={() => this.props.navigation.navigate('登录')}
                />
                {
                    this.state.username ?
                    <Text>{this.state.username}</Text>
                    :
                    null
                }
        </View>
        )
    }
}
export default My