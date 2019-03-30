import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View ,
        Image, 
        ScrollView,
        AsyncStorage,
        Alert,
        FlatList,
        Button } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import api from '../../axios/api';
import { TouchableHighlight } from 'react-native-gesture-handler';
import uuid from 'uuid'
import {MyMessage_style} from './style'
 

class MyMessage extends Component{
    constructor(props){
        super(props)
        this.state = {
            friend_request:[],
            chat_msg_not_read:[],
            my_request_result:[]
        }
    }
    static navigationOptions = {
        title: '消息',
      };
    
    componentDidMount(){
        this.fetchMyNotReadMsg()
        console.log(this.state)

    }
    async fetchMyNotReadMsg(){
        let myname = await AsyncStorage.getItem('username')
        console.log(myname)
        let res = await api.get('/user/mymessagenotread',{username:myname})
        if(res.code === 0){
            console.log(res.data)
            this.setState({
                friend_request: res.data.friend_request_With_avatar,
                chat_msg_not_read: res.data.chat_msg_With_2avatar,
                my_request_result: res.data.my_request_result
            })
        }

    }
    async passFriendRequest(friendName,type){// type = yes / no
        console.log(friendName)
        let myname = await AsyncStorage.getItem('username')
        let myID = await AsyncStorage.getItem('userID')

        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`

        let res = await api.post('/user/passfriendrequest', {myname,myID,friendName,time:now,type}) 
        if(res.code === 0){
            console.log(res)
            Alert.alert('已发送！','',[{text:'好的',onPress:()=>{}}])
            this.setState({friend_request:this.state.friend_request.filter(e=>e.ele.requesterName!==friendName)})
        }
    }
    id2time(id) {
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)
    }
    
    render(){
        return(
            <View style = {{backgroundColor:'#eee'}}>
                {
                    this.state.friend_request.length !== 0 ?
                    <Text style = {{margin:10}}>好友请求</Text>
                    : null
                }
                <FlatList data = {this.state.friend_request}
                          style = {MyMessage_style.FQ}
                          renderItem = {({item}) => <View key = {uuid()} 
                                                          style = {MyMessage_style.FQItem}
                            >
                            <View >
                                <View style = {{flexDirection:'row'}}>
                                    <Image style = {{width:50,height:50,borderRadius:25}}
                                            source = {{ uri:`data:image/png;base64,${item.avatarBase64}`}}
                                                    />
                                    <View style = {{marginLeft:5}}>
                                        <Text style = {{fontSize:17,marginTop:4}}>{item.ele.requesterName}</Text>
                                        <Text style = {{fontSize:13,marginTop:2}}>
                                          {item.ele.time.replace(/(\d*)-(\d*)-(\d*)-(\d*)-(\d*)/,(match,p1,p2,p3,p4,p5)=>`${p1}/${p2}/${p3}  ${p4}:${p5}`)}
                                        </Text>
                                    </View>
                                    <Button title = "接收"
                                            disabled = {false}
                                            onPress = {()=>this.passFriendRequest(item.ele.requesterName,'yes')}
                                            style = {{width:70,backgroundColor:'white',marginLeft:13}}
                                    />
                                    <Button title = '拒绝'
                                            style = {{width:70,padding:2,marginLeft:5}}
                                            onPress = {()=>this.passFriendRequest(item.ele.requesterName,'no')}
                                             
                                    />
                                </View>
                                <View style = {{paddingTop:10,paddingLeft:60,paddingRight:10,paddingBottom:6}}>
                                    <Text>{item.ele.description}</Text>
                                </View>

                            </View>  
                        </View>}
                
                >

                </FlatList>
                {
                    this.state.my_request_result.length !== 0 ?
                    <Text style = {{margin:10}}>我的好友请求结果</Text>
                    : null
                }
                <FlatList data = {this.state.my_request_result}
                          style = {MyMessage_style.FQ}
                          renderItem = {({item}) => <View key = {uuid()} style = {MyMessage_style.FQItem}>
                                <View style = {{flexDirection:'row',backgroundColor:'white',justifyContent:'space-around'}}>
                                    <View style = {{flexDirection:'row'}}>
                                     <Image style = {{width:50,height:50,borderRadius:25}}
                                                    source = {{ uri:`data:image/png;base64,${item.avatar}`}}
                                                            />
                                        <View>
                                            <Text style = {{fontSize:23,marginTop:4}}>{item.ele.requestedName} </Text>
                                            <Text style = {{fontSize:12,marginTop:2}}>
                                            {item.ele.time.replace(/(\d*)-(\d*)-(\d*)-(\d*)-(\d*)/,(match,p1,p2,p3,p4,p5)=>`${p1}/${p2}/${p3}  ${p4}:${p5}`)}
                                            </Text>
                                        </View>
                                       
                                    </View>
                                    <View style = {{flex:10,marginTop:20}}>
                                       {
                                           item.ele.type === 'my-friend-request-success' ?
                                           <Text style = {{color:'green'}}> 通过了你的好友请求 </Text>
                                           : 
                                           <Text style = {{color:'red'}}>拒绝了你的好友请求</Text>
                                       }
                                      
                                    </View>
                                </View>

                          
                          </View>}
                
                >

                </FlatList>
                {
                    this.state.chat_msg_not_read.length ?
                    <Text>未读聊天消息</Text>
                    :null
                }
                <FlatList data = {this.state.chat_msg_not_read}
                          
                          renderItem = {({item})=><View key = {uuid()} 
                                                        style = {{backgroundColor:'white',
                                                                  flexDirection:'row',
                                                                  justifyContent:'space-between',
                                                                  marginTop:2,
                                                                  marginBottom:2,
                                                                  padding:7}}>
                               <View style = {{
                                   flexDirection:'row',
                                   justifyContent:'flex-start'

                               }}>

                                    <Image style = {{width:40,height:40,borderRadius:20}}
                                                    source = {{ uri:`data:image/png;base64,${item.msgFromAvatar}`}}
                                                            />
                                    <View>
                                        <Text style = {{fontSize:18}}>{item.chat.from}</Text>
                                        <Text style = {{fontSize:14}}>{this.id2time(item.chat._id)}</Text>
                                    </View>
                                   
                               </View>
                               <View >
                                   <Text style = {{padding:4,fontSize:16}}>{item.chat.content}</Text>
                               </View>


                          </View>}
                >

                </FlatList>
          

            </View>
        )
    }
}
export default MyMessage

// 