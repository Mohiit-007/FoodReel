const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const authrouter = require("./routes/auth.routes")
const authfoodrouter = require("./routes/food.routes")
const cors = require('cors')

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.get('/',(req,res)=>{
    res.send("this is myy first project in MERN")
})

app.use('/user',authrouter)
app.use('/partner',authfoodrouter)

module.exports = app;