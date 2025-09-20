const mongoose= require("mongoose");

const userSchema =new mongoose.Schema({
    shortid:{
        type:String,
        required:true
    },
    givenid:{
        type:String,
        required:true
    },
    vistedHistory:[{timestamp:{type:Number}}],
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
     clicks: { type: Number, default: 0 } ,

    
},
{timestamps:true});

const URL=mongoose.model("url",userSchema);

module.exports=URL;