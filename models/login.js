const mongoose= require("mongoose");

const loginSchema =new mongoose.Schema({
   
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
          type:String,
        required:true
    },

    
},
{timestamps:true});

const LOG=mongoose.model("login",loginSchema);

module.exports=LOG;