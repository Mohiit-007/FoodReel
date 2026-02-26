const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongodb connected")
    })
    .catch((err)=>{
        console.log("mongodb conection error",err)
    })
}

module.exports = connectDB;