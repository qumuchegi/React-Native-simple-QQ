const mongoose=require('mongoose');
const db_url = require('./config').db_url
mongoose.connect(db_url,{useNewUrlParser:true},err=>console.log(err))

mongoose.model('users',mongoose.Schema({
    username:String,
    //avatarURL:String,
    avatarBase64:String,
    password:String,
    sex:String,
    job:String
}))

module.exports = {
    getModel:function(modelname){
        return mongoose.model(modelname)
    }
} 