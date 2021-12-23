const mongoose=require('mongoose');

const ProfileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Favece:{
        type:String
    },
    PR:{
        type:String
    }

    

});

module.exports=Profile=mongoose.model('Profile',ProfileSchema);