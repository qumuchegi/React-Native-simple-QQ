import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,Image,AsyncStorage} from 'react-native';
import {Card} from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign';
 


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
    toMyMessage(){
        this.props.navigation.navigate('MyMessage')
    }
    toMyFriends(){
        this.props.navigation.navigate('MyFriends')
    }
    render(){
        let that = this
        return(
        <View>
            <View style = {My_style.userInfo}>
                <Image    
                    style = {{width:60,height:60,borderRadius:30}}
                    source={{ uri: `data:image/png;base64,${this.state.avatarBase64}` || ''}}
                />
                
                    
                    {
                        this.state.username ?
                        <Text style = {{fontSize:30,alignItems:'center',marginTop:10,marginLeft:10,color:'white'}}>{this.state.username}</Text>
                        :
                        null
                    }
            </View>
            <View style = {{backgroundColor:'#eee'}}>
                <View style = {My_style.Item}  >
                    <Text style = {{ fontSize:17,alignItems:'center',alignContent:'center'}}  >我的消息</Text>
                    <Icon name = 'right' 
                          style = {{ fontSize:17,}} 
                          color = 'rgb(28,115,211)'
                          onPress = {()=>this.toMyMessage()}
                          />
                </View>
                <View style = {My_style.Item}>
                    <Text style = {{ fontSize:17,}}>我的好友</Text>
                    <Icon name = 'right' 
                          style = {{ fontSize:17,}} 
                          color = 'rgb(28,115,211)'
                          onPress = {()=>this.toMyFriends()}
                          />
                </View>
                 

            </View>
            
        </View>
        )
    }
}
export default My
const My_style = StyleSheet.create({
    userInfo:{
        marginLeft: 10,
        padding:7,
        marginRight: 10,
        backgroundColor:'rgb(63,171,249)',
        borderRadius:8,
        marginTop: 50,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    Item:{
        backgroundColor:'white',
        flexDirection:'row',
        padding:8,
        marginTop:5,
        marginBottom: 5,
        justifyContent:'space-between'
    }
})
/*
<Button title = '>'
                            onPress = {()=>this.toMyMessage()}
                             
                            icon={
                                  <Icon name = 'right' style = {{ fontSize:17,}} />
                            }
                    />
*/