const mongoose = require("mongoose");

const saveschema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "food",
        required : true,
    }
},{timestamps : true})

const Save = mongoose.model("save",saveschema);

module.exports = Save;