
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,Image,AsyncStorage,	TouchableHightlight,FlatList} from 'react-native';
import {Header,Input,Divider} from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign';
import api from '../axios/api';
import uuid from 'uuid'
 

class ChatList extends Component{
    constructor(props){
        super(props)
        this.state = {
            avatarBase64:'',
            myname:'',
            chatlist:[],
        }
    }
    async componentDidMount(){
        let avatarBase64 = await AsyncStorage.getItem('avatarBase64')
        this.setState({avatarBase64})
        this.fetchChatlist()

    }
    async fetchChatlist(){
        let myname = await AsyncStorage.getItem('username')
        let res = await api.get('/user/chatlist',{myname})
        if(res.code === 0){
            console.log(res)
            this.setState({chatlist:res.data,myname})
           
        }

    }
    async logout(){
        AsyncStorage.clear()
        //this.props.navigation.goBack()
        this.props.navigation.navigate('Login')
    }
    toChatO2O(friendName){
        console.log('121')
        this.props.navigation.navigate('ChatO2O',{friendName,myname:this.state.myname})
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
                rightComponent={ 
                                    
                                    <Icon name = 'logout' 
                                      size = {24} 
                                      onPress = {()=>this.logout()}
                                      color = 'white'/>
                                      
                              
                }
            />
            <FlatList data = {this.state.chatlist}
                      ItemSeparatorComponent={()=><Divider style={{ backgroundColor: 'blue' }}/>}
                      renderItem = {({item})=><View key = {uuid()} style = {{flexDirection:'row', justifyContent:'space-between'}}>
                          <View style = {{justifyContent:'flex-start',flexDirection:'row',padding:7,marginTop:3,marginBottom:3}}>
                                <Image style = {{width:40,height:40,borderRadius:20}}
                                       source = {{ uri:`data:image/png;base64,${ item.avatar}`}}
                                    />
                                <View style = {{marginLeft:7}}>
                                    <Text style={{ fontWeight:'bold',fontSize:17}}>{item.name}</Text>
                                    <Text style = {{color:'#888', }}>{item.lastMsg.length > 20 ? item.lastMsg.slice(0.20) : item.lastMsg}</Text> 
                                </View>
                          </View>
                          <Icon    onPress={()=>this.toChatO2O(item.name)}
                                   style = {{marginTop:10,marginRight:10}}
                                   size = {25}
                                   name = 'arrowright'/>
                          
                      </View>}
            />
             
            
                
        </View>
        ) 
    }
}
export default ChatList