import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ChatList from '../../screens/ChatList'
import My from  '../../screens/My'
import { createStackNavigator, createAppContainer,createBottomTabNavigator } from "react-navigation"
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import Login from '../../pages/Login/Login'
import Register from '../../pages/Register/Register'
import Icon from 'react-native-vector-icons/Entypo';
import {QueryUser} from '../../pages/QueryUser/QueryUser'
import MyMessage from '../../pages/MyMessage/MyMessage'
import MyFriends from '../../pages/Myfriends/MyFriends'
/*
const  My_stack = createStackNavigator(
    {
        已经登录:{screen: My},
        登录:{screen: Login},
        注册:{screen: Register},
       
    }
)
*/
const add_stack = createStackNavigator(
    {
        找人:{screen: QueryUser}
    }
)
const My_stack = createStackNavigator(
    {
        My:My,
        MyMessage:MyMessage,
        //MyFriends:MyFriends
    }
)
export const TabNavigator =  createBottomTabNavigator(
    {
       聊天列表:ChatList,
       加好友:add_stack,
       我的: My_stack
    },
      {
        header:'none',
        //initialRouteName:'聊天列表页面',
        defaultNavigationOptions:({navigation}) => ({
            tabBarIcon:({ focused, horizontal, tintColor })=>{
                const { routeName } = navigation.state;
                let iconName = routeName === '聊天列表' ? 'list' : routeName === '加好友' ? 'add-user' : 'bar-graph'   
                let iconColor = focused ? 'rgb(28,115,212)' : 'gray'
                return <Icon name = {iconName} color = {iconColor} size = {20}/>
            }
        }),
            tabBarOptions: {
                activeTintColor: 'rgb(28,115,212)',
                inactiveTintColor: 'gray',
                labelStyle: {
                    fontSize: 14,
                  },
        },
      },
      
     
  );


 //const TabbarContainer = createAppContainer(TabNavigator)
 //export default TabbarContainer

 
 
