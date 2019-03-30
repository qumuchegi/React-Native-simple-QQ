import {StyleSheet,Dimensions} from 'react-native'
var {height, width} = Dimensions.get('window')
export const Chat_style = StyleSheet.create({
    header:{
        height:50

    },
    chatMsgView:{
        height:height-45-50-100,
        marginBottom: 100,
    },
    input:{
        backgroundColor:'#999',
        height:45,
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
    
        borderColor: '#ccc',
        borderRadius: 4,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
         
    },
    msgItem:{
        flexDirection:'column',

    }

})