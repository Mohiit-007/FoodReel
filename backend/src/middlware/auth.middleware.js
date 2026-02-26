const jwt = require("jsonwebtoken");
const Partner = require("../models/partner");
const User = require("../models/user")

async function authfoodpartnermiddleware(req,res,next) {
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            msg : "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const partner = await Partner.findById(decoded.id);

        if(!partner){
            return res.status(401).json({
                msg : "Partner not found"
            })
        }

        req.foodpartner = partner;
        next();

    } catch (error) {
        return res.status(401).json({
            msg : "Invalid token"
        })
    }
}

async function authusermiddleware(req,res,next){
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            msg : "Please login first"
        })
    }

    try {

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        if(!user){
            res.status(401).json({
                msg : "user not found"
            })
        }
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(400).send({
            msg : "Invalid token",
            error : error.message
        })
    }
}

async function authusermiddlewareoptional(req,res,next){

    const token = req.cookies.token;

    if(!token){
        return next(); 
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            req.user = null;
            return next();
        }
        req.user = user;
    }catch(err){
        req.user = null;
    }

    next();
}

module.exports = {authfoodpartnermiddleware, authusermiddleware, authusermiddlewareoptional};