var express = require('express');
var router = express.Router();
var model = require('../db')
var users = model.getModel('users')
var async = require('async')
var uploadImg = require('../midlewere/multer_img_storage')

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
                job 
            }).save((err,savedUser) => {
                if(!err){
                    console.log(savedUser)
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
                res.json({code:0,data:user})
            }
            else{
                res.json({code:1}) // 密码不正确
            }
        }else{
            res.json({code:2}) // 用户名不存在
        }
    })
})
module.exports = router