
import { createStackNavigator, createAppContainer,createBottomTabNavigator } from "react-navigation"
import Login from '../../pages/Login/Login'
import  Register from '../../pages/Register/Register'
import TabNavigator from '../Tabbar/Tabbar'
//import MyMessage from '../../pages/MyMessage/MyMessage'
//import ChatO2O from '../../pages/ChatOne2One/ChatOne2One'
import {Logined_navigator_container} from '../LoginedNavigator'

export const Top_stack = createStackNavigator(
    {
        Login:Login,
        Register:Register,
        hadLogined: Logined_navigator_container,    //TabNavigator,
        //ChatO2O:ChatO2O,
        //MyMessage:MyMessage
    },
    {
        initialRouteName:'Login',
        header:'none',
        headerMode:'none'
    }
)

export const TopContainer = createAppContainer(Top_stack)

