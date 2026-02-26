const express  = require("express")
const {
    createFood,
    getfooditems,
    foodpartnerbyId,
    likefood,
    savefood,
    addcomment,
    getcomments,
    deletecomment,
    shareReel,
    getSavedReels,
    userdetails,
    updateComment,
    deleteReel,
    editReel,
    getSingleReel,   
 } = require("../controllers/food.controller")

const {authfoodpartnermiddleware, authusermiddleware, authusermiddlewareoptional} = require("../middlware/auth.middleware")

const multer = require("multer")

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() })

router.get('/reel/:id', getSingleReel)

router.get('/',authusermiddlewareoptional,getfooditems)

router.get('/user',authusermiddleware,userdetails)

router.get('/saved',authusermiddleware,getSavedReels)

router.get('/comment/:foodId',getcomments)

router.post('/like',authusermiddleware,likefood)

router.post('/save',authusermiddleware,savefood)

router.post('/comment',authusermiddleware,addcomment)

router.post('/share',shareReel)

router.post("/api/food",authfoodpartnermiddleware,upload.single('video'),createFood);

router.put("/update/comment/:id",authusermiddleware,updateComment);

router.delete('/comment/:commentId',authusermiddleware,deletecomment)

router.delete('/delete/:id',authfoodpartnermiddleware,deleteReel)

router.put('/edit/:id',authfoodpartnermiddleware,upload.single('video'),editReel);

router.get("/:id",foodpartnerbyId)

module.exports = router;