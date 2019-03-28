import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ChatList from '../../screens/ChatList'
import My from  '../../screens/My'
import { createStackNavigator, createAppContainer,createBottomTabNavigator } from "react-navigation"
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import Login from '../../pages/Login/Login'
import Register from '../../pages/Register/Register'
import Icon from 'react-native-vector-icons/Entypo';

const  My_stack = createStackNavigator(
    {
        已经登录:{screen:My},
        登录:{screen:Login},
        注册:{screen:Register}
    }
)
 
const AppNavigator =  createBottomTabNavigator(
    {
       聊天列表:{screen:ChatList},
       我的:{screen:My_stack}
    },
      {
        initialRouteName:'聊天列表',
        defaultNavigationOptions:({navigation}) => ({
            tabBarIcon:({ focused, horizontal, tintColor })=>{
                const { routeName } = navigation.state;
                let iconName = routeName === '聊天列表' ? 'bar-graph'  : 'list'
                let iconColor = focused ? 'red' : 'blue'
                return <Icon name = {iconName} color = {iconColor} size = {20}/>
            }
        }),
            tabBarOptions: {
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                labelStyle: {
                    fontSize: 14,
                  },
        },
      },
      
     
  );
 const TabbarContainer = createAppContainer(AppNavigator)

 
export default TabbarContainer