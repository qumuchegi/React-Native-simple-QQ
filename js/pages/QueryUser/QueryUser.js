import React, {Component} from 'react';
import {Platform, 
        Text, 
        TextInput,
        View,
        Image,
        Alert,
        AsyncStorage,
        FlatList,
        ScrollView ,
        TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Input, Divider, Button } from 'react-native-elements';
import api from '../../axios/api'
import {QueryUser_style} from './style'
import uuid from 'uuid'

export class QueryUser extends Component{
    constructor(props){
        super(props)
        this.state = {
            query_username:'',
            queryUser_result:'',
            showAddFriendPannel:false,
            addFriendDescription:'',
            addfriendSend:false,
            hadSendAddFriends:'',// 已经发出的加好友请求
        }
    }
    async componentDidMount(){
        let myname = await AsyncStorage.getItem('username')
        if(!myname) return Alert.alert('请登录','',[{text:'ok',onPress:()=>{console.log(7)}}])
        let res = await api.get('/user/myaddfriendsrequests',{username:myname})
        if(res.code === 0){
            console.log('我的好友请求：',res.data)
            this.setState({hadSendAddFriends: res.data})
        }

    }
    static navigationOptions = {
        title: '找人',
    };
    onChangetUserName(text){
        this.setState({query_username:text})
    }
    async queryUser(){
        console.log(this.state.query_username)
        if(!this.state.query_username) return Alert.alert('请输入用户名','',[{text:'ok',onPress:()=>{console.log(7)}}])
        let res = await api.get('/user/queryuser', {username: this.state.query_username})
        if(res.code === 0){
            console.log(res.data)
            this.setState({queryUser_result:res.data,addfriendSend:false})
        } else if(res.code === 1){
            Alert.alert('没有此用户','',[{text:'ok',onPress:()=>{console.log(7)}}])
        }
    }
    async addFriend(){
        if(!this.state.addFriendDescription) return Alert.alert('请输入请求描述','',[{text:'ok',onPress:()=>{console.log(7)}}])
        let myname = await AsyncStorage.getItem('username')
        if(!myname) return Alert.alert('请登录','',[{text:'ok',onPress:()=>{console.log(7)}}])
        if(myname===this.state.queryUser_result.username) return Alert.alert('你是你自己的好友','',[{text:'ok',onPress:()=>{console.log(7)}}])
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`

        let res = await api.post('/user/addfriend',
            {
                myname, 
                username:this.state.queryUser_result.username, 
                description: this.state.addFriendDescription,
                time:now
            }
        )
        if(res.code === 0){
            Alert.alert('好友请求发送成功 ！','',[{text:'ok',onPress:()=>{console.log(7)}}])
            let hadSendAddFriends = this.state.hadSendAddFriends
            this.setState({addfriendSend: true, hadSendAddFriends: [...hadSendAddFriends,
                    {
                        userAvatar:this.state.queryUser_result.userAvatar, 
                        requestedName:this.state.queryUser_result.username, 
                        time:'现在',
                        description:this.state.addFriendDescription
                    }]})
        }else if(res.code === 1){
            Alert.alert('你们已经是好友了',
                     '',
                    [{text:'ok',onPress:()=> {}}])
        }else if(res.code === 2){
            Alert.alert('已经发出过请求了',
            '',
           [{text:'ok',onPress:()=> {}}])
        }

    }

    async removeRejectedRequest(requested){
        
        let requestedName = requested.username || requested.requestedName
        console.log(requestedName)
        let myname = await AsyncStorage.getItem('username')

        let res = await api.post('/user/removemyrejectedrequest',{myname,requestedName})
        if(res.code === 0){
            this.setState({hadSendAddFriends:this.state.hadSendAddFriends.filter(e=>(e.username!== requestedName && e.requestedName!== requestedName) )})
            Alert.alert('已经删除请求记录',
            '',
           [{text:'ok',onPress:()=> {}}])
        }
    }
    render(){
        return(
            <View style = {{backgroundColor:'#eee'}}>
                <View style = {QueryUser_style.queryInput}>
                    <Input  placeholder = '搜索用户名字' 
                            value = {this.state.query_username}
                            inputStyle = {{width:100,backgroundColor:'#eee',borderRadius:9}}
                            leftIcon = {<Icon   name = 'magnifying-glass' 
                                                size = {22} 
                                                shake={true}
                                        />
                            }
                             
                             
                            onChangeText = {(text) => this.onChangetUserName(text)}
                    />
                     
                    <Button onPress = {() => this.queryUser()}
                            icon={
                                <Icon   name = 'forward'
                                size = {23}
                                color = 'white'
                                />
                            }
                            buttonStyle = {{width:330,marginLeft:20,marginTop:5,}}
                            titleStyle = {{fontSize:15}}
                            title="查询用户"
                    />
                    
                </View>
                
                <View>
                    {
                        this.state.queryUser_result && !this.state.addfriendSend ?
                        
                        <View style = {QueryUser_style.userCard}>
                            <View style = {{justifyContent:'space-between',flexDirection:'row'}}>
                                <Text>查询结果</Text>
                                <Icon name = 'cross' onPress = {()=>this.setState({addfriendSend:true})} size = {24}/>
                            </View>
                            <View style = {QueryUser_style.userInfo}>
                                <View>
                                    <Image style = {{width:50,height:50,borderRadius:25}}
                                        source = {{ uri:`data:image/png;base64,${this.state.queryUser_result.userAvatar}`}}
                                    />
                                </View>
                                <View>
                                    <Text style = {{fontSize:30,marginLeft:5,marginTop:10}}>
                                      {this.state.queryUser_result.username}
                                    </Text>
                                </View>
                            </View>
                            <View style = {QueryUser_style.addFriendButton}>
                                <Button title = {this.state.showAddFriendPannel ? '取消' : '加好友' }
                                        onPress  = {() => this.setState((prevState)=>({showAddFriendPannel: !prevState.showAddFriendPannel}))}
                                        buttonStyle = {{width:100 }}
                                        titleStyle = {{fontSize:15}}
                                        icon={
                                            !this.state.showAddFriendPannel ?
                                            <Icon
                                                name="add-to-list"
                                                size={23}
                                                color="white"
                                            />
                                            :
                                            <Icon
                                                name="minus"
                                                size={23}
                                                color="white"
                                            />
                                    }
                                />
                                
                            </View>
                            {
                                    this.state.showAddFriendPannel ?
                                    <View>
                                        <TextInput
                                                multiline = {true}
                                                placeholder = '输入加好友请求原因描述'
                                                style = {QueryUser_style.addFriendTextarea}
                                                onChangeText = {(text)=>this.setState({addFriendDescription:text})}
                                        />
                                        <Button onPress = {()=>this.addFriend()} title = '发送好友请求'/>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                        :
                        null
                    }
                </View>
                <View>
                    {
                        this.state.hadSendAddFriends.length ?
                        <Text style = {{margin:8}}>已经发出的好友请求</Text>
                        :
                        null
                    }
                    
                    {
                        this.state.hadSendAddFriends ?
                        <ScrollView overScrollMode = 'always' style = {{marginBottom:230}}>
                        <FlatList
                                data={this.state.hadSendAddFriends}
                                renderItem={({item}) => <View key = {uuid()} 
                                                              style = {{marginTop:5,marginBottom:5,backgroundColor:'white'}}>
                                    <View>
                                        <View style = {QueryUser_style.myAddFriendsRequest}>
                                            <View>
                                                <Image style = {{width:50,height:50,borderRadius:25}}
                                                    source = {{ uri:`data:image/png;base64,${item.userAvatar}`}}
                                                />
                                            
                                            </View>
                                            <View>
                                                <Text style = {{fontSize:20,marginLeft:5,marginTop:10}}>
                                                {item.username || item.requestedName}
                                                </Text>
                                                <Text style = {{fontSize:10}}>
                                                {item.time.replace(/(\d*)-(\d*)-(\d*)-(\d*)-(\d*)/,(match,p1,p2,p3,p4,p5)=>`${p1}/${p2}/${p3}  ${p4}:${p5}`)}
                                                </Text>
                                            </View>
                                            <Icon name = 'cross' 
                                                  size = {23} 
                                                  style = {{marginLeft:200}}
                                                  onPress = {()=>this.removeRejectedRequest(item)}></Icon>
                                        </View>
                                        <Text style = {{margin:7}}>我的请求描述</Text>
                                        <View style = {QueryUser_style.description}>
                                            
                                            <Text>{item.description}</Text>
                                        </View>
                                    </View>
                                </View>
                            
                            }
                        />
                        </ScrollView>
                        :
                        null
                    }
                </View>

            </View>
        )
    }

}