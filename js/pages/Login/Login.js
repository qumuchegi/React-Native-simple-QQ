import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Image, AsyncStorage,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Input, Divider, Button } from 'react-native-elements';
import api from '../../axios/api';


class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:''

        }
        this.usernameInput = React.createRef()
        this.passwordInput = React.createRef()
    }
    static navigationOptions = {
        title: '登录',
    };
     

    
    onChangeState = (inputKey, value)=> {
        this.setState({[inputKey]:value})
    }
    async saveUser(user){
        
        
        try{
            await AsyncStorage.setItem('username',user.username)
            await AsyncStorage.setItem('userID',user._id)
            await AsyncStorage.setItem('sex',user.sex)
            await AsyncStorage.setItem('job',user.job)
            await AsyncStorage.setItem('avatar',user.avatarURL)
    
            const avatar = await AsyncStorage.getItem('avatar');
            console.log(avatar)
            this.props.navigation.goBack()
            // asset/user_avatar/1553688802632IMG_0002.JP
        }catch(err){
            console.log(err)
        }
        
        
    }
    async login(){
        let res = await api.get('/user/login',
            { username: this.state.username,
              password: this.state.password
            })
        if(res.code === 0){
           this.saveUser(res.data)
          
        }else if(res.code === 1){
            Alert.alert('密码不正确',
                        '',
                        [{text:'ok',onPress:()=>{
                            this.passwordInput.current.value = null
                            this.usernameInput.current.value = null
                        }}])
        }else if(res.code === 2){
            Alert.alert(' 用户名不存在',
                        '',
                        [{text:'ok',onPress:()=>{
                            
                        }}])
        }

    }
    render(){
        return(
            <View>
                <Input  placeholder = '用户名' 
                        leftIcon = {()=><Icon name='user' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('username',text)}
                        />
                 <Input placeholder = '密码' 
                        type = 'password'
                        leftIcon = {()=><Icon name='key' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('password',text)}
                        />
                <Button title = '登录' onPress = {() => this.login()}/>
            </View>
        )
    }
}
export default Login