const mongoose = require("mongoose");

const foodschema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    video : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required  :true,
    },
    foodpartner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "partner",
    } ,
    likecount : {
        type : Number,
        default : 0,
    },
    commentcount:{
        type:Number,
        default:0
    },
    sharecount:{
        type:Number,
        default:0
    }
},{timestamps : true});

const Food = mongoose.model("food",foodschema);
module.exports = Food;