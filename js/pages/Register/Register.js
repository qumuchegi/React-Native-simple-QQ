import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,Alert,AsyncStorage,Picker} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Input, Divider, Button,Header } from 'react-native-elements';
import api from '../../axios/api'
var ImagePicker = require('react-native-image-picker');
import {Register_style} from './style'
 

class Register extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:'',
            password_confirm:'',
            job:'',
            sex:'',
            avatarFormdata:'',
            localAvatarURLbase64:'',
            
        }
        this.password_confirm_Input = React.createRef()
    }
    static navigationOptions = {
        title: '注册',
    };
    onChangeState = (inputKey, value)=> {
        this.setState({[inputKey]:value})
    }
    checkPassword () {
        if(this.state.password_confirm === this.state.password){
            console.log('密码一致')
            return true
        }else{
            console.log('密码不一致')
            Alert.alert('密码不一致',
                        '请重新输入密码',
                        [{text:'ok',onPress:()=> console.log(9)}])
            return false
            
        }
    }
    async saveUser(user){
        await console.log(0)
        
        try{
            await AsyncStorage.setItem('username',user.username)
            await AsyncStorage.setItem('userID',user._id)
            await AsyncStorage.setItem('sex',user.sex)
            await AsyncStorage.setItem('job',user.job)
            await AsyncStorage.setItem('avatarBase64',user.avatarBase64)
           
           
        }catch(err){
            console.log(err)
        }
        
        
    }
    async register(){
 
        if(
            this.checkPassword() &&
            this.state.username &&
            this.state.password &&
            this.state.sex &&
            this.state.job 
           
        ){
       
            let res = await api.post('/user/register',
            {
                username:this.state.username,
                password:this.state.password,
                sex:this.state.sex,
                job:this.state.job,
                avatarBase64:this.state.localAvatarURLbase64
             
            })
            if(res.code === 1){
                Alert.alert('已经有相同用户名',
                            '请重新输入用户名',
                            [{text:'ok',onPress:()=>this.password_confirm_Input.current.value = null}])
            }else if(res.code === 0){
                /*
                let config = {headers: { 'Content-Type': 'multipart/form-data' }}
                console.log(this.state.avatarFormdata)

                let res1 = await api.post('/user/avatar', this.state.avatarFormdata, config)
                */
                //if(res1.code === 0){
                    await this.saveUser(res.data)
                    Alert.alert('注册成功',
                     '',
                    [{text:'ok',onPress:()=>this.password_confirm_Input.current.value = null}])
                    this.props.navigation.navigate('已经登录')

                    this.props.navigation.navigate('hadLogined')
                //}
                
            }

        }
    }
    
    showImagePicker(){
        ImagePicker.showImagePicker(options,(response)=>{
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                //let formdata = this.avatarFormdata(response)
                this.setState({
                    localAvatarURLbase64: response.data, 
                   // avatarFormdata: formdata
                })
            }
        })
    }
    render(){
        return(
            <View >
                <Header
                        backgroundColor = 'white'
                        centerComponent={{ text: this.state.friendName, style: { color: '#333' } }}
                        leftComponent={<Icon name = 'chevron-thin-left' size = {22} onPress={()=>this.props.navigation.goBack()} />}
                         
                    />

                <View style = {{marginTop:50}}>
                 
                 <Input placeholder = '用户名' 
                        leftIcon = {()=><Icon name='user' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('username',text)}
                        />
                 <Input placeholder = '密码' 
                        type = 'password'
                        leftIcon = {()=><Icon name='key' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('password',text)}
                        />
                 <Input placeholder = '确认密码' 
                        ref = {this.password_confirm_Input}
                        leftIcon = {()=><Icon name='key' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('password_confirm',text)}
                        />

                 <Input placeholder = '工作' 
                        leftIcon = {()=><Icon name='briefcase' type = 'entype' size={24}></Icon>}
                        onChangeText = {(text) => this.onChangeState('job',text)}
                        />
                 <View style = {{
                     justifyContent:'space-between',
                     flexDirection:'row',
                     padding:25,
                     paddingBottom:40,
                     height:100
                  
                 }}>
                    <View style={{flexDirection:'row'}}>
                        <Icon name='upload' size = {30} onPress = {()=> this.showImagePicker()}/>
                        <Text style ={{marginTop:10}}>上传头像</Text>
                    </View>
                   
                    <View style = {Register_style.ImageContainer}>
                    {
                        this.state.localAvatarURLbase64 ?
                        <Image source = {{uri:`data:image/png;base64,${this.state.localAvatarURLbase64}`}}
                                style={Register_style.localAvatar}/>
                        :
                        <Icon name = 'image-inverted' size = {35}/>
                    }
                    </View>
                    
                 </View>
                 <View style = {{marginLeft:27,marginRight:25}}>
                      <Icon name = 'slideshare' size = {24}/>
                      <Text style={{}}>性别</Text>
                      <Picker
                        selectedValue={this.state.sex}
                        style={{  margin:0 ,padding:0 ,height:200}}
                        onValueChange={(itemValue, itemIndex) => this.setState({sex: itemValue})}>
                        <Picker.Item label="male" value="male" />
                        <Picker.Item label="female" value="female" />
                     </Picker>
                  </View>
                  
                
               </View>
               
               <View style = {{padding:20}}>
                 <Button title = '注册' 
                     
                          
                         onPress = {()=>this.register()}
                         
                 />
               </View>
            </View>
        )
    }
}
export default Register

const options = {
    title: '选择图片', 
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', 
    chooseFromLibraryButtonTitle: '图片库', 
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high', 
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2, 
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: { 
        skipBackup: true, 
        path: 'images'
    }
};

/*
    avatarFormdata(ImgPicker_res){
        let formdata = new FormData()

        function dataURLtoFile(dataurl, filename) { // 将base64转换为文件
             var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                 bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
             while(n--){
                 u8arr[n] = bstr.charCodeAt(n);
             }
             return new File([u8arr], filename, {type:mime});
         }
         try{
             let avatarFile = dataURLtoFile(`data:image/jpg;base64,${ImgPicker_res.data}`,ImgPicker_res.fileName)
            
             formdata.append('avatar',avatarFile)
             console.log('formdata username:', this.state.username)
             formdata.append('username',this.state.username)
          
         }catch(err){
             console.log(err)
         }
         return formdata
    }
*/