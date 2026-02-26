const express = require("express")
const { registerUser, loginUser, logoutUser, registerPartner, loginPartner, partnerlogout }  = require("../controllers/auth.controller")

const router = express.Router();

//User
router.post('/register',registerUser);

router.post('/login',loginUser);

router.post('/logout',logoutUser);

//Partner
router.post('/partner/register',registerPartner)

router.post('/partner/login',loginPartner)

router.post('/partner/logout',partnerlogout)

module.exports = router;