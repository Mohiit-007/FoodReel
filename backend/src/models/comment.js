const mongoose = require("mongoose");

const commentschema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"food",
        required:true
    },

    text:{
        type:String,
        required:true
    }

},{timestamps:true});

const Comment = mongoose.model("comment",commentschema);

module.exports = Comment;