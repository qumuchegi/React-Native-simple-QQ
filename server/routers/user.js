var express = require('express');
var router = express.Router();
var model = require('../db')
var users = model.getModel('users')
var chatMsgs = model.getModel('chatMsgs')
var twoFriendsChats = model.getModel('twoFriendsChats')
var async = require('async')
var uploadImg = require('../midlewere/multer_img_storage')
//const serverChat = require('./routers/WS')
//const io = require('socket.io')(serverChat);
 

router.post('/register' , (req,res,next) => {
    let {username,password,sex,job,avatarBase64} = req.body;
   // console.log(userInfo.localAvatarURLbase64)
    users.findOne({username: username}, (err,user) => {
        if(user){
            res.json({code:1})//已经有相同用户名
        }else{
            new users({
                avatarBase64,
                username,
                password,
                sex ,
                job ,
                friendsID:[]
            }).save((err,savedUser) => {
                if(!err){
                    //console.log(savedUser)
                    res.json({code:0,data:savedUser})
                }else{
                    res.json({code:2})
                }
            })
        }
    })
})
/*
router.post('/avatar',uploadImg('asset/user_avatar').any(),(req,res,next) => {
    // let avatar = req.files[0]
    console.log('000000')
    //res.json({code:3,data:'80980'})
    
    console.log('用户头像入库',req.body)
    users.findOne({username:req.body.username}, (err,user) => {
        if(user){
            res.json(2)
            /*
            user.avatarURL = req.files[0].path

            user.save((err,savedUser) =>{
                if(!err){
                    res.json({code:0,data:savedUser.avatarURL})
                }

            })
            
        }else{
            res.json({code:1})
        }
    })
   
})
*/
router.get('/login',(req,res,next) => {
    let {username,password} = req.query
    users.findOne({username}, (err,user) => {
        if(user){
            if(user.password === password){
                let {username,_id,sex,job,avatarBase64,mySendedMsgs, messageNotRead} = user
                res.json({code:0,data: {username, _id, sex, job, avatarBase64, mySendedMsgs, messageNotRead}})
            }
            else{
                res.json({code:1}) // 密码不正确
            }
        }else{
            res.json({code:2}) // 用户名不存在
        }
    })
})
router.get('/queryuser', (req,res,next) => {
    let {username} = req.query
    console.log(username)
    users.findOne({username}, (err,user) => {
        if(user){
            res.json({code:0,data:{username:user.username, userAvatar:user.avatarBase64, sex:user.sex, job:user.job}})
        }else{
            res.json({code:1})
        }
    })
})
router.post('/addfriend', (req,res,next) => {
    let {myname, username,description,time} = req.body

    users.findOne({username: myname}, (err,I) => {
        if(I){
            if(I.friends.some(e => e === username)) return res.json({code:1})//已经是好友了
            if(I.mySendedMsgs.some(e => e.type==='add_friend_request' && e.requestedName===username)) return res.json({code:2})//已经发出过请求了
            users.findOne({username}, (err,user) => {
                if(user){
                    user.messageNotRead.push({type:'add_friend_request',  requesterName:myname, description,time})
                    user.save((err) => {
                        if(!err){
                            I.mySendedMsgs.push({type:'add_friend_request',  requestedName:username, description,time})
                            I.save((err) => {
                                if(!err){
                                    res.json({code:0}) // 已经发出加好友的请求
                                }
                            })
                        }
                    })
                }


            })
        }
    })
})
router.get('/myaddfriendsrequests',(req,res,next) => {
    let {username} = req.query
    let myaddfriendsrequests = []
    async.series([
        findFriends=>{
            users.findOne({username}, (err,user) => {
                if(user){
                    
                    console.log(user.mySendedMsgs)
                    user.mySendedMsgs.forEach( e => {
                        if(e.type === 'add_friend_request'){
                            myaddfriendsrequests.push(e)
                        }
                      
                    })
                    console.log(myaddfriendsrequests)
                    findFriends(null)
        
        
                    //res.json({code:0,data:myaddfriendsrequests})
                }
            })
        },
        friendsAvatar=>{
            let n = myaddfriendsrequests.length
            myaddfriendsrequests.forEach(e => {
                users.findOne({username:e.requestedName},(err,user) => {
                    if(user){
                        n--
                        e.userAvatar = user.avatarBase64
                        if(n===0){
                            friendsAvatar(null)
                        }
                    }
                })
            })
        }

    ],
        (err)=>{
            res.json({code:0,data:myaddfriendsrequests})

        })
})
/*
          {
               type: 'add_friend_request',
                requesterName: 请求者名字，
                description: 描述,
                time,
                avatarBase64 (下面新增)
          }
          {
              type: 'chat_msg',
          [   chatMsgID ]
          }
*/
router.get('/mymessagenotread',(req,res,next)=>{
    let {username} = req.query
    let friend_request_With_avatar = []
    let chat_msg_With_2avatar = []
    let my_request_result = []
    console.log('请求消息》》》')
    users.findOne({username}, (err,user) => {
        if(user){
            let MyAvatar = user.avatarBase64
            async.series([
                requestWithAvatar=>{
                    let n = user.messageNotRead.filter(e=>e.type==='add_friend_request').length
                    console.log('n',n)
                    if(n===0) return requestWithAvatar(null)
                    user.messageNotRead.forEach(ele => {
                        if(ele.type === 'add_friend_request'){
                            
                            users.findOne({username:ele.requesterName},(err,requester) => {
                                n--
                                let avatarBase64 = requester.avatarBase64
                                friend_request_With_avatar.push({ele,avatarBase64})
                                if(n === 0){
                                    requestWithAvatar(null)
                                }
                            })

                        } 
                    })
                },
                chatMsgsWithAvatar=>{
                    let h = user.messageNotRead.filter(e=>e.type==='chat_msg').length
                    if(h ===0) return chatMsgsWithAvatar(null)
                    user.messageNotRead.forEach(e => {
                        if(e.type === 'chat_msg'){
                            chatMsgs.findOne({_id:e.chatID},(err,chat)=>{
                                //\
                                 
                                if(chat){
                                    users.findOne({username:chat.from}, (err,from) => {
                                        h--
                                        let msgFromAvatar = from.avatarBase64
                                        chat_msg_With_2avatar.push({msgFromAvatar,chat})
                                        if(h===0){
                                            chatMsgsWithAvatar(null)
                                        }
                                    })
                                }else{
                                    chatMsgsWithAvatar(null)
                                }
                               

                            })
                        }
                    })
                   
                },
                myRequestResultWithAvatar=>{
                    let m = user.messageNotRead.filter(e=>e.type.match(/my-friend-request/)).length
                    if(m===0) return myRequestResultWithAvatar(null)
                    user.messageNotRead.forEach(ele => {
                        if(ele.type.match(/my-friend-request/)){
                            users.findOne({username: ele.requestedName},(err,user)=>{
                                m--
                                my_request_result.push({ele,avatar:user.avatarBase64})
                                if(m===0){
                                    myRequestResultWithAvatar(null)
                                }
                            })
                        }

                    })
                }

             
            ],(err)=>{
                res.json({code:0,data:{friend_request_With_avatar, chat_msg_With_2avatar, my_request_result}})
            }
                
                
            )
            
        }
    })
})
router.post('/passfriendrequest',(req,res,next) => { // 实际上拒绝和通过都通过这条路由，是拒绝还是通过由 type（ yes/no ） 字段来决定
    let {myname,myID,friendName,time,type} = req.body
    users.findOne({username:myname}, (err,I)=>{
        if(type === 'yes'){
            I.friends.push(friendName)
        }
        I.messageNotRead = I.messageNotRead.filter(e=>{
            (e.type === 'add_friend_request' && e.requesterName !== friendName)
            ||
            (e.type === 'chat_msg')
        })

        I.save((err)=>{

            if(type === 'yes'){
                new twoFriendsChats({
                    Requester:friendName,
                    RequesterID: myID,
                    chatMsgs:[]
                }).save((err,twoFriendsChat)=>{
                    if(!err){
                        users.findOne({username:friendName},(err,friend)=>{
                            if(friend){
                                friend.mySendedMsgs = friend.mySendedMsgs.filter(e=>{// 删除请求者的请求记录
                                    (e.type === 'add_friend_request' && e.requestedName !== myname)
                                    ||
                                    (e.type === 'chat_msg')
                                })
                                friend.friends.push(myname)
                                friend.messageNotRead.push({type:'my-friend-request-success',requestedName:myname,time})
                                friend.save((err)=>{
                                    if(!err){
                                        res.json({code:0})
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                users.findOne({username:friendName},(err,friend)=>{
                    friend.messageNotRead.push({type:'my-friend-request-reject',requestedName:myname,time})
                    friend.save((err)=>{
                        if(!err){
                            res.json({code:0})
                        }
                    })
                })
               
            }

         }
        )
    })
})
router.get('/myfriends',(req,res,next)=>{
    let {myname} = req.query
    let frineds= []
    users.findOne({username:myname}, (err,I) => {
        if(I){
            let friend_num = I.friends.length
            I.friends.forEach(name => {
                users.findOne({username: name}, (err,friend)=>{
                    if(friend){
                        frineds.push( {avatar:friend.avatarBase64, name:friend.username})
                        friend_num--
                        if(friend_num === 0){
                            res.json({code:0, data:frineds})
                        }
                    }
                   
                })
            })
        }
    })
})

router.post('/removemyrejectedrequest',(req,res) => {
    let{myname,requestedName} = req.body
    users.findOne({username:myname}, (err,I) => {
        if(I){
            I.mySendedMsgs = I.mySendedMsgs.filter(e=> !(e.type==='add_friend_request' && e.requestedName===requestedName))
            I.save((err)=>{
                if(!err){
                    res.json({code:0})
                }
            })
        }
    })
})

router.get('/chathistory',(req,res,next)=>{
    let {myname,friendname} = req.query
    console.log(myname,friendname)
    let friend_avatar = ''
    let chatHistpry_with_avatar = []
    async.series([
        friendAvatar=>{
            users.findOne({username:friendname}, (err,friend)=>{
                if(friend){
                    friend_avatar = friend.avatarBase64
                    friendAvatar(null)
                }

            })
        },
        chatMsg=>{
            chatMsgs.find({$or:[{from:myname,to:friendname},{from:friendname,to:myname}]},(err,chats)=>{
                if(chats){
                    chatHistpry_with_avatar = {chats,friend_avatar}
                    chatMsg(null)
                }
            })
        }
    ],()=>{
        res.json({code:0,data:chatHistpry_with_avatar})
    })
})

router.get('/chatlist',(req,res,next)=>{
    let {myname} = req.query
    let _chatlist = []
    let msgNum
    users.findOne({username:myname}, (err,I) => {
        if(I){
            let n = I.chatlist.length
            console.log(I.chatlist)
           
            I.chatlist.forEach(e => {
                users.findOne({username:e.name}, (err,f) => {
                    if(f){
                        msgNum = I.messageNotRead.filter(e=>(e.type==='chat_msg'&&e.from===f.username)).length
                        _chatlist.push({name:e.name, lastMsg:e.lastMsg, avatar: f.avatarBase64,msgNum})
                        n--
                        if(n===0){
                            res.json({code:0,data:_chatlist})
                        }
                    }else{
                        res.json({code:1 })
                    }
                    

                })
            })
        }else{
            res.json({code:2})
        }
    })
})
router.post('/removemynotmsg',(req,res)=>{//删除我的未读消息
    let {myname,friendname} = req.body
   
    users.findOne({username:myname}, (err,I)=>{
        if(I){
            I.messageNotRead = I.messageNotRead.filter(e=>!(e.type === 'chat_msg' && e.from === friendname))
            I.save((err)=>{
                if(!err){
                    console.log('已经删除未读消息')
                     
                    res.json({code:0})
                }
            })
        }
    })
})

module.exports = router