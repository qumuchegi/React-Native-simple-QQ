import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View ,
        Image, 
        AsyncStorage,
        Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Input, Divider, Button } from 'react-native-elements';
import api from '../../axios/api';
import {login_style} from './login_style'

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
    
    
    onChangeState = (inputKey, value)=> {
        this.setState({[inputKey]:value})
    }
    async saveUser(user){
        
        
        try{
            await AsyncStorage.setItem('username',user.username)
            await AsyncStorage.setItem('userID',user._id)
            await AsyncStorage.setItem('sex',user.sex)
            await AsyncStorage.setItem('job',user.job)
            await AsyncStorage.setItem('avatarBase64',user.avatarBase64)
           // await AsyncStorage.setItem('mySendedMsgs',user.mySendedMsgs)
            //await AsyncStorage.setItem('messageNotRead',user.messageNotRead)
          
            this.props.navigation.navigate('hadLogined')
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
            <View style = {login_style.loginBody}>
                <View style = {{marginBottom:30}}>
                    <Text style = {{color:'rgb(28,115,212)',fontSize: 40,textAlign:'center'}}>简易QQ</Text>
                </View>
                <Input  placeholder = '用户名' 
                        leftIcon = {()=><Icon name='user' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('username',text)}
                        />
                 <Input placeholder = '密码' 
                        type = 'password'
                        leftIcon = {()=><Icon name='key' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('password',text)}
                        />
                <Button title = '登录' 
                        onPress = {() => this.login()}
                        style = {login_style.button}
                        />
                <Button title = '注册' 
                        style = {{marginTop:7}}
                        onPress = {() => this.props.navigation.navigate('Register')}/>
            </View>
        )
    }
}
export default Login