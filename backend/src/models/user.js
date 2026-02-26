const mongoose =  require("mongoose")

const Userschema = mongoose.Schema({
    fullname : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim: true,
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps : true})

const User = mongoose.model("user",Userschema)

module.exports = User;