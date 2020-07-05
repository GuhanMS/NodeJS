//this is destructing method
const{Schema, model} = require("mongoose");

//this is normal one
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username:{
            type:String,
            required :true,
        },
        email :{
            type:String,
            required :true,
            unique:true,

        },
        password:{
            type:String,
            required :true,
        },
    },
    { timestamps:true}
);
 
module.exports = model("users", UserSchema);