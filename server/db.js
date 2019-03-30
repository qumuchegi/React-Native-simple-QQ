const mongoose=require('mongoose');
const db_url = require('./config').db_url
mongoose.connect(db_url,{useNewUrlParser:true},err=>console.log(err))

mongoose.model('users',mongoose.Schema({
    username:String,
    //avatarURL:String,
    avatarBase64:String,
    password:String,
    sex:String,
    job:String,
    friends:Array,// [username]
    messageNotRead:Array,//未读消息，分为 加好友请求的消息、聊天消息，用 type（ add_friend_request / chat_msg )字段区分
    // 此处的 未读消息已读后要删除 ！！！
    /*
      加好友请求的消息: {
          type: 'add_friend_request',
          requesterName: 请求者名字，
          description: 描述,
          time
      }，
      好友请求被给予通过的消息：{
          type: ‘my-friend-request-success'
          requestedName: 被请求者名字
          time
      }
      好友请求被给予拒绝的消息：{
          type: ‘my-friend-request-reject'
          requestedName: 被请求者名字
          time
      }
      聊天消息：{
          type: 'chat_msg',
          from: // 消息发送者名字
          chatID: chatMsgID 
      }

    */
    mySendedMsgs:Array,
    // 我发出去的消息，内容与上面的 messageNotRead 一样 ！但是好友请求 的 requesterName 反过来是我要请求的对方的名字 ： requestedName
    chatlist:Array,// 聊天列表数组，[{name,lastMsg}]存储聊天好友名字，在两种情况下存储： 1. 我主动发起聊天时存储好友名字； 2. 好友给我发消息时
}))
mongoose.model('twoFriendsChats',mongoose.Schema({
    /* 
       一旦两个用户之间建立起好友关系，也就是接收加好友请求的人通过请求之后，就要 为双方建立这个 聊天文档，在这里
       可以保存两人的聊天历史
       甚至，_id可以作为两个人成为好友的时间 ！！！
    */
    Requester:String,// 当初发出好友请求的那个人的名字
    RequesterID:String,
    Receiver:String,// 接收加好友请求的人的名字，也就是被加好友的人
    chatMsgs:Array,// 两人互相的聊天内容，{ [ chatMsgID ] },也就是下面单独成一个文档的 chatMsgs 的ID

}))
mongoose.model('chatMsgs',mongoose.Schema({
    /* 
       聊天消息，消息除了要实时发送给对方（用 websocket)，同时还要存入对方的 messageNotRead

    */
    from:String,// 消息发送者名字
    to:String,// 接收者名字
    content:String,// 消息内容
    // 消息发送时间可以 从 Mongodb 的 _id 解析，所以不另设 消息发送时间字段
    hadRead:Boolean,// 是否已读，已读true，未读false
}))

module.exports = {
    getModel:function(modelname){
        return mongoose.model(modelname)
    }
} 
