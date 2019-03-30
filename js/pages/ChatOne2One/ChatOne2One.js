import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View ,
        Image, 
        AsyncStorage,
        KeyboardAvoidingView,
        Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Header,Input} from 'react-native-elements'
import {Chat_style} from './style'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
//import { KeyboardAvoidingView } from 'react-native-keyboard-aware-scroll-view'
import api from '../../axios/api'
import io from 'socket.io-client';
import uuid from 'uuid'
var socket =  io('ws://localhost:3004');

class ChatO2O extends Component{
    constructor(props){
        super(props)
        this.state = {
            myname:'',
            myAvatar:'',
            friendName:'',
            friendAvatar:'',
            myMsgWillSend:'',
         
            historyChat:[],
            merged_chats:[]

        }
       // this.FlatListRef = React.createRef()
    }
    async componentDidMount(){
        let friendName = this.props.navigation.getParam('friendName')
        let myAvatar = await AsyncStorage.getItem('avatarBase64')
        let myname = this.props.navigation.getParam('myname')//await AsyncStorage.getItem('username')
        let friendAvatar = await AsyncStorage.getItem('chatFriendAvatar')

        this.setState({myname,friendName,friendAvatar,myAvatar})

        this.fetchHitory()

        //this.FlatListRef.scrollToEnd();

        socket.on('recChatMsg',data=>{
            let {from,to,content} = data
            console.log({from,to,content} )

            if(myname===to){
                let historyChat = this.state.historyChat
                historyChat = historyChat.concat([{ from, to, content }])
                console.log( historyChat)
                this.setState({ historyChat })
            }
            
            //this.FlatListRef.scrollToEnd();
        }) 
    }
    async fetchHitory(){
        let res = await api.get('/user/chathistory',{myname: this.state.myname,friendname:this.state.friendName})
        if(res.code  ===  0){
            console.log(res.data.chats)
            this.setState({historyChat:res.data.chats})
        }
        
    }
    async sendMsg(){
         
        
        socket.emit('sendChatMsg',{
            from: this.state.myname,
            to:this.state.friendName,
            content:this.state.myMsgWillSend
        })
        let historyChat = this.state.historyChat
        historyChat = historyChat.concat([{ 
            from: this.state.myname,
            to:this.state.friendName,
            content:this.state.myMsgWillSend}])
        console.log( historyChat)
        this.setState({ historyChat })
         
       
    }
    id2time(id) {
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)
    }
    render(){
        
        return(
            <KeyboardAvoidingView style = {{flexDirection:'column'}} behavior="padding">
                <Header style = {Chat_style.header}
                        backgroundColor = 'white'
                        centerComponent={{ text: this.state.friendName, style: { color: '#333' ,fontSize:20} }}
                        leftComponent={<Icon name = 'left' size = {22} onPress={()=>this.props.navigation.goBack()}></Icon>}
                        rightComponent={<Image style = {{width:30,height:30,borderRadius:15}}
                                               source = {{ uri:`data:image/png;base64,${this.state.friendAvatar}`}}
                                    />}
                    />
                <View style ={Chat_style.chatMsgView}>
               
                {
                    this.state.historyChat ?
                        <FlatList data = {this.state.historyChat}
                                  ref = {(flatlist)=>this.FlatListRef=flatlist}
                                  renderItem = {({item})=><View key = {uuid()}>
                                  {
                                      item.from === this.state.myname ?
                                      <View >
                                        <View style =  {{flexDirection:'row',
                                                        justifyContent:'flex-end',
                                                        padding:7,
                                                        marginTop:10,

                                                    }}
                                        >
                                            <View style={{flexDirection:'row'}}>
                                            <View style = {{flexDirection:'column',marginRight:8}}>
                                                <Text style = {{fontSize:16,marginTop:0, marginRight:5,textAlign:'right',}}>{this.state.myname}</Text>
                                                <Text style = {{fontSize:14}}>
                                                    {
                                                        item._id ?
                                                        this.id2time(item._id)
                                                        : '现在'}
                                                    </Text>
                                            </View>
                                                
                                                <Image style = {{width:40,height:40,borderRadius:20}}
                                                        source = {{ uri:`data:image/png;base64,${this.state.myAvatar}`}}
                                                />
                                            </View>
                                        </View>
                                        <View style = {{
                                                      
                                                        flexDirection:'row',
                                                        justifyContent:'flex-end',
                                                        marginLeft:40,
                                                        marginBottom:30
                                                        }}>
                                            <Text  style = {{ 
                                                                paddingLeft:7,
                                                                paddingRight:20,
                                                                paddingTop:5,
                                                                paddingBottom:5,
                                                                marginRight:40,
                                                                
                                                                borderRadius:20,
                                                                textAlign:'right',
                                                                backgroundColor:'rgb(83,220,255)',
                                                                 
                                                            }}

                                            >{item.content}
                                           </Text>
                                        </View>
                                        
                                    </View>
                                      :
                                      <View>

                                            <View style = {{  flexDirection:'row',
                                                                justifyContent:'flex-start',
                                                                padding:7,
                                                                marginTop:10}}>
                                                <View style={{flexDirection:'row',}}>
                                                    <Image style = {{width:40,height:40,borderRadius:20}}
                                                            source = {{ uri:`data:image/png;base64,${this.state.friendAvatar}`}}
                                                    />
                                                    <View style = {{flexDirection:'column',marginLeft:8}}>
                                                        <Text style = {{fontSize:16,marginTop:0}}>{this.state.friendName}</Text>
                                                        <Text style = {{fontSize:14}}>
                                                        {
                                                            item._id ?
                                                            this.id2time(item._id)
                                                            : '现在'}
                                                        </Text>
                                                    </View>
                                                
                                                </View >
                                                
                                                
                                            </View>
                                            <View style = {{
                                                      
                                                      flexDirection:'row',
                                                      justifyContent:'flex-start',
                                                      marginLeft:40,
                                                      marginBottom:30
                                                      }}>
                                            <Text style = {{ 
                                                                paddingLeft:20,
                                                                paddingRight:7,
                                                                paddingTop:5,
                                                                paddingBottom:5,
                                                                marginRight:40,
                                                                
                                                                borderRadius:20,
                                                                textAlign:'left',
                                                                backgroundColor:'rgb(234,71,102)',
                                                                 
                                                            }}>
                                                {item.content}
                                                </Text>
                                            </View>
                                    </View>

                                  }

                                  </View>}
                        >

                        </FlatList>
                        :
                        null
                }
                 
                </View>
                
                <View style = {Chat_style.input}>
                    <Input
                       onChangeText = {text => this.setState({myMsgWillSend:text})}
                       rightIcon = {<Icon name = 'totop' 
                                          size = {21} 
                                          onPress = {()=>this.sendMsg()}
                                          style={{backgroundColor:'rgb(26,123,252)',margin:0,padding:6}}/>}
                    />
                </View>

            </KeyboardAvoidingView>
        )
    }
}
export default ChatO2O
// <Text style = {{fontSize:14}}>{this.id2time(item._id)||'现在'}</Text>