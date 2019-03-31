 var app = require('../app')
 var model = require('../db')
 var users = model.getModel('users')
 var chatMsgs = model.getModel('chatMsgs')
 const serverChat = require('http').Server(app);
 const io = require('socket.io')(serverChat);
 var async = require('async')

 io.on('connection',function(socket){
     socket.on('sendChatMsg',data=>{
         const {from,to,content} = data

         let msgNum = 0

         console.log({from,to,content})
         io.emit('recChatMsg',{from,to,content})
         //io.emit('chatlistMsg',{})
         async.series([
            save_friendNotReadMsg=>{
                users.findOne({username: to},(err,user)=>{
                    if(user){
                       
                        new chatMsgs({
                            from,
                            to,
                            content,
                            hadRead:false
                        }).save((err,newChatMsg)=>{
                         
                            newChatMsg.save()
                            if(!err){
                                let chatID = []
                               chatID = []
                               chatID.push(newChatMsg._id)
                               
                               user.messageNotRead.push(
                                   { 
                                       type: 'chat_msg',
                                       from,
                                       chatID
                               })
                              
                               user.save((err,user_newMsg)=>{

                                   msgNum = user.messageNotRead.filter(e=>(e.type==='chat_msg'&&e.from===from)).length

                                   save_friendNotReadMsg(null)
                                  // console.log(user_newMsg.messageNotRead)
                               })
                               
                            }
       
                        })                 
                    }
                })
              
                
            },
            saveChatList=>{
                users.findOne({username:from},(err,I)=>{
                    if(I){
                       
                        io.emit('chatlistMsg',{name:from, lastMsg:content, avatar: I.avatarBase64,msgNum,to})
                        let new_I_chatlist = I.chatlist.filter(e=>e.name!==to)
                        new_I_chatlist.push({name:to,lastMsg:content})
                        I.chatlist = new_I_chatlist
                        I.save((err)=>{
                            if(!err){
                                users.findOne({username:to},(err,f)=>{
                                    if(f){
                                        let new_f_chatlist = f.chatlist.filter(e=>e.name!==from)
                                        new_f_chatlist.push({name:from,lastMsg:content})
                                        f.chatlist = new_f_chatlist
                                        f.save((err)=>{
                                            if(!err){
                                                saveChatList(null)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }


         ],
            (err)=>{
                if(!err)
                console.log('消息实时发送给对方，存入对方未读消息，还有双方都把对方的名字存入自己的 chlist ',msgNum)

            })

        






     })
     socket.on('rmChatlist_notReadMsg_state',data=>{
        io.emit('rmChatlist_notReadMsg_state',data)
   
    })

    }
 
  
 
 )

 module.exports = serverChat
