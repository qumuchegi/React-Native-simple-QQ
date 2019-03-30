import {StyleSheet} from 'react-native'
export const QueryUser_style = StyleSheet.create({
    queryInput:{
        justifyContent:'space-between',
        backgroundColor:'white'
    
    },
    queryButton:{
        backgroundColor:'#342'
    },
    userCard:{
        margin:3,
        padding: 5,
        borderStyle:'solid',
        borderColor: '#ddd',
        borderRadius: 5,
        borderWidth: 2,
        justifyContent:'center',
        backgroundColor:'white'
        
    },
    userInfo:{
        
        flexDirection: 'row',
        justifyContent:'space-around'
        
    },
    addFriendButton:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent:'center'
    },
    addFriendTextarea:{
        marginTop:6,
        height: 80, 
        backgroundColor:'white',
        borderColor: 'gray', 
        borderWidth: 1
    },
    myAddFriendsRequest:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        backgroundColor:'white',
        paddingTop:7,
        paddingLeft:7,
        paddingBottom: 7,
    },
    description:{
        fontSize:30,
        paddingLeft: 30,
        backgroundColor:'white'
    }
})