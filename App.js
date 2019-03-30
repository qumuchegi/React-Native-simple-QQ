/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,AsyncStorage} from 'react-native';
import TabbarContainer  from './js/components/Tabbar/Tabbar'
import {TopContainer} from './js/components/LoginNavigator/LoginNavigator'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



 
export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLogined:false
    }
  }
  async componentDidMount(){
    let username = await AsyncStorage.getItem('username')
    if(username){
      this.setState({isLogined: true})
    }

  }
   
  render() {

    return  (
      
      <TopContainer/>
    
    )
    
 }
}
// <LoginContainer/>
const styles = StyleSheet.create({
   
});
/*
render() {
    const Container 
    if(this.state.isLogined){
        Container =  <TabbarContainer />
    }
    else{
      Container = <LoginContainer/>
    }
    return (

         <Container/>
    );
    */