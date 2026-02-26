const mongoose = require("mongoose")

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Restaurant/Business name is required"],
        minlength: 2
    },

    contactName: {
        type: String,
        trim: true,
        required: [true, "Contact person name is required"]
    },

    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
    },

    address: {
        type: String,
        required: [true, "Address is required"]
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },

}, { timestamps: true })


const Partner = mongoose.model("partner", partnerSchema)

module.exports = Partner