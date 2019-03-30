import { createStackNavigator, createAppContainer } from "react-navigation"
import ChatO2O from '../pages/ChatOne2One/ChatOne2One'
import {TabNavigator} from './Tabbar/Tabbar'
import MyFriends from '../pages/Myfriends/MyFriends'
export const Logined_navigator_container =  createStackNavigator(
    {
        TabNavigator:TabNavigator,
        MyFriends:MyFriends,
        ChatO2O:ChatO2O,
    },{
        headerMode:'none'
    }
 )
 

 