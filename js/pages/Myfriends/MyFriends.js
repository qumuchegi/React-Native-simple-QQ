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
import uuid from 'uuid'
import {Header,Input} from 'react-native-elements'
//import {MyMessage_style} from './style'
 

class MyFriends extends Component{
    constructor(props){
        super(props)
        this.state = {
            myname:'',
            myFriends:[]

        }
    }
    static navigationOptions = {
        title: '好友',
      };
    async componentDidMount(){
        
        this.setState({myFriends:await this.fetchMyFriends()})
        console.log(this.state.myFriends)
    }
    async fetchMyFriends(){
        let myname = await AsyncStorage.getItem('username')
        this.setState({myname})
        let res = await api.get('/user/myfriends',{myname})
        if(res.code === 0){
            return res.data
        }
    }
    async toChat(friendName,friend_avatar){
        console.log(friendName)
        await AsyncStorage.setItem('chatFriendAvatar',friend_avatar)
        //let myname = await AsyncStorage.getItem('username')
        this.props.navigation.navigate('ChatO2O',{friendName,myname:this.state.myname})

    }
    render(){
        return(
            <View style = {{backgroundColor:'#eee',}}>
                <Header
                        backgroundColor = 'white'
                        leftComponent={<Icon name = 'left' size = {22} onPress={()=>this.props.navigation.goBack()}></Icon>}
                         
                    />
                <FlatList data = {this.state.myFriends}
                           
                          renderItem = {({item}) => <View key = {uuid()}>
                            <View style = {{flexDirection: 'row',
                                            paddingLeft:9,
                                            paddingTop:5,
                                            paddingBottom:5,
                                            paddingRight:6,
                                            marginTop:3,
                                            marginBottom: 4,
                                            backgroundColor:'white'
                                            }}>
                                <Image style = {{width:40,height:40,borderRadius:20}}
                                       source = {{ uri:`data:image/png;base64,${item.avatar}`}}
                                />
                               <View style = {{marginLeft:8}}>
                                   <Text style = {{fontSize:17,marginTop:15}}>{item.name}</Text>
                               </View>
                               <View style = {{ flex:10, 
                                                paddingRight:4,
                                                paddingLeft:230}}>
                                   <Button title = '>'
                                           onPress = {() => this.toChat(item.name,item.avatar)}
                                    />
                               </View>
                            </View>


                          </View>
                          }
                />


            </View>
        )
    }
}

export default MyFriends