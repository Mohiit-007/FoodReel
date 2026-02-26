const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Partner = require("../models/partner")

async function registerUser(req,res) {
    try{
        const {fullname , email , password} = req.body;

        if(!fullname || !email || !password){
            return res.status(400).send({msg : "All fields are required"})
        }

        const isUserAlreadyExists = await User.findOne({email});
        if(isUserAlreadyExists){
            return res.status(400).json({msg : "User already exists"})
        }
        const saltrounds = 10;
        const hashedpassword = await bcrypt.hash(password,saltrounds);

        const user = await User.create({
            fullname,
            email,
            password : hashedpassword,
        })

        const token = jwt.sign({
            id : user._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite : "strict"
        });
        res.status(201).send({
            msg : "User created successfully",
            user : {
                _id : user._id,
                fullname : user.fullname,
                email : user.email,
            }
        })
    }
    catch(error){
        res.status(500).json({
        msg : "Internal server error",
        error : error.message})
    }
}

async function loginUser(req,res) {
    try {
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).send({msg : "All fields are required"})
        }

        const user =  await User.findOne({email});
        if(!user){
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const ispassword = await bcrypt.compare(password,user.password)
        if(!ispassword){
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({
            id : user._id,
        },process.env.JWT_SECRET);

        res.cookie("token",token,{
            httpOnly : true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", 
        });

        res.status(200).send({
            msg : "User loggedIn successfully",
            user : {
                _id : user._id,
                fullname : user.fullname,
                email : user.email,
            }
        })
    } catch (error) {
        res.status(500).json({
        msg : "Internal server error",
        error : error.message})
    }

}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).send({
        msg : "User LogOut successfully"
    })
}

async function registerPartner(req,res){
    try {
        const {name , email , password, phone, address, contactName} = req.body;

        if(!name || !email || !password || !phone || !address || !contactName){
            return res.status(400).send("All fields are required");
        }
        const isPartnerAlreadyExists = await Partner.findOne({email});
        if(isPartnerAlreadyExists){
            return res.status(400).send("User already existsssssss")
        }
        const saltrounds = 10;
        const hashedpassword = await bcrypt.hash(password,saltrounds);

        const partner = await Partner.create({
            name,
            email,
            password:hashedpassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({
            id : partner._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly : true,
            sameSite : "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).send({
            msg : "parnter created successfully",
            Partner : {
                _id : partner._id,
                name : partner.name,
                email : partner.email,
                contactName : partner.contactName,
            }
        })


    } catch (error) {
        res.status(500).json({
        msg : "Internal server error",
        error : error.message})
    }
}

async function loginPartner(req,res){
    try {
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).send({msg : "All fields are required"})
        }

        const partner = await Partner.findOne({email});

        if(!partner){
            res.status(404).send({msg : "Invalid credentials"})
        }

        const hashedpassword = await bcrypt.compare(password,partner.password);

        if(!hashedpassword){
            res.status(404).send({msg : "Invalid credentials"})
        }

        const token = jwt.sign({
            id : partner._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly : true,
            sameSite : "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            msg : "partner LoggedIn successfully",
            Partner : {
                _id : partner._id,
                name : partner.name,
                email : partner.email,
                contactName : partner.contactName,
            }
        })

    } catch (error) {
        res.status(500).json({
            msg : "Internal server Error",
            error : error.message
        })
    }

}

function partnerlogout(req,res){
    res.clearCookie("token");
    res.status(200).send({
        msg : "partner LogOut successfully"
    })
}

module.exports = { registerUser, loginUser, logoutUser, registerPartner, loginPartner, partnerlogout }