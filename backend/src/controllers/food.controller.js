const foodModel = require("../models/food");
const PartnerModel = require("../models/partner");
const likemodel = require("../models/like")
const savemodel = require('../models/save')
const commentModel = require("../models/comment")
const {v4 : uuid} = require("uuid")
const {uploadfile} = require("../services/storage.service")

async function createFood(req,res) {
    try {
        const {name , description} = req.body;
        const fileuploadresult = await uploadfile(req.file.buffer,uuid())
        
        const foodItem = await foodModel.create({
            name,
            video : fileuploadresult.url,
            description,
            foodpartner : req.foodpartner._id,
        })

        res.status(201).send({
            msg : "Food created successfully",
            id : req.foodpartner._id,
            food : foodItem,
        })

    } catch (error) {
        res.status(500).json({
            msg : "Internal Server Error",
            error : error.message
        })
    }
}

async function getfooditems(req,res) {

    const foods = await foodModel.find({});

    let userId = req.user?._id;

    const result = await Promise.all(

        foods.map(async(food)=>{

            let liked = false;

            if(userId){

                const isLiked = await likemodel.findOne({
                    user:userId,
                    food:food._id
                });

                liked = !!isLiked;
            }

            let saved = false;

            if(userId){
                
                const isSaved = await savemodel.findOne({
                user:userId,
                food:food._id
            });

                saved = !!isSaved;
            }


            return {
                ...food.toObject(),
                liked,
                saved,
            };

        })
    );

    res.status(200).json({
        msg:"food items fetched successfully",
        fooditems:result
    });
}

async function foodpartnerbyId(req, res) {
  try {
    const id = req.params.id;

    const partner = await PartnerModel.findById(id);

    if (!partner) {
      return res.status(404).json({
        msg: "Partner not found",
      });
    }

    const foods = await foodModel.find({
      foodpartner: id,
    });

    return res.status(200).json({
      partner,
      foods,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

async function likefood(req, res) {
    const { foodId } = req.body;

    const food = await foodModel.findById(foodId);
    if (!food) {
        return res.status(404).json({ msg: "Food not found" });
    }

    const isAlreadyLiked = await likemodel.findOne({
        user: req.user._id,
        food: foodId
    });

    
    if (isAlreadyLiked) {
        await likemodel.deleteOne({
            user: req.user._id,
            food: foodId
        });

        food.likecount = Math.max(0, food.likecount - 1);
        await food.save();

        return res.status(200).json({
        msg: "unliked successfully",
        likecount: food.likecount,
        liked: false
        });
    }

    // LIKE
    await likemodel.create({
        user: req.user._id,
        food: foodId
    });

    food.likecount += 1;
    await food.save();

    return res.status(200).json({
        msg: "liked successfully",
        likecount: food.likecount,
        liked: true
    });
}

async function savefood(req,res){

    const {foodId} = req.body;

    const alreadySaved = await savemodel.findOne({
        user:req.user._id,
        food:foodId
    });

    if(alreadySaved){

    await savemodel.deleteOne({
        user:req.user._id,
        food:foodId
    });

    return res.json({
        saved:false
    });

    }

    await savemodel.create({
        user:req.user._id,
        food:foodId
    });

    res.json({
        saved:true
    });
}

async function addcomment(req,res){

 try{
    console.log("BODY:",req.body);
    console.log("USER:",req.user);

    const {foodId,text} = req.body;

    const food = await foodModel.findById(foodId);

    if(!food){
        return res.status(404).json({
            msg:"Food not found"
        });
    }

    const comment = await commentModel.create({

        user:req.user._id,
        food:foodId,
        text

    });

    food.commentcount +=1;

    await food.save();

    res.status(200).json({
        msg:"comment added",
        comment
    });

 }catch(err){

    console.log("ERROR:",err);

    res.status(500).json({
        msg:"Server error"
    })

 }

}

async function getcomments(req,res){

    const {foodId} = req.params;

    const comments = await commentModel
    .find({food:foodId})
    .populate("user","fullname");
    console.log(comments);

    res.status(200).json({
        comments
    });

}

async function deletecomment(req,res){

 try{

    const {commentId} = req.params;

    const comment = await commentModel.findById(commentId);

    if(!comment){
        return res.status(404).json({
            msg:"Comment not found"
        });
    }

    if(comment.user.toString() !== req.user._id.toString()){
        return res.status(403).json({
            msg:"Not allowed"
        });
    }

    await commentModel.findByIdAndDelete(commentId);
    const food = await foodModel.findById(comment.food);

    if(food){
        food.commentcount = Math.max(0,food.commentcount-1);
        await food.save();
    }

    res.status(200).json({
        msg:"Comment deleted"
    });

 }catch(err){

    console.log(err);

    res.status(500).json({
        msg:"Server error"
    })

 }
}

async function shareReel(req,res) {
    try {
        const {foodId} = req.body;

        const food = await foodModel.findById(foodId);

        if(!food){
            return res.status(404).json({
            msg:"Food not found"
            });
        }

        food.sharecount += 1;
        await food.save();
        res.json({
            sharecount:food.sharecount
        });
    } catch (error) {
            console.log(err);
            res.status(500).json({
            msg:"Server error"
        });
    }

}

async function getSavedReels(req,res){
    try{
        const saves = await savemodel
        .find({ user:req.user._id })
        .populate("food");

        const reels = saves
        .filter(s => s.food)
        .map(s => s.food);
        
        res.json({
            reels
        });

    }catch(err){
        console.log(err);

        res.status(500).json({
            msg:"Server error"
        });
    }

}

function userdetails(req,res) {
    try {
        const user = req.user;
        res.status(200).json({
            user
        })
    } catch (error) {
        res.status(500).json({
            msg : "Internal server error",
            error : error.message,
        })
    }
}

async function updateComment(req,res){

    try{
        const comment = await commentModel.findById(req.params.id);
        if(!comment){
            return res.status(404).json({msg:"Comment not found"})
        }
        comment.text = req.body.text;
        await comment.save();
        res.json({msg:"Updated"})

    }catch(err){
        res.status(500).json({error:err.message})
    }

}

async function deleteReel(req,res){
    try{
    const reel = await foodModel.findById(req.params.id);
    if(!reel){
        return res.status(404).json({msg:"Reel not found"});
    }

    if(reel.foodpartner.toString() !== req.foodpartner._id.toString()){
        return res.status(403).json({msg:"Not authorized"});
    }

    await reel.deleteOne();

    res.json({
        msg:"Reel deleted successfully"
    });
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}


async function editReel(req,res){
    try{

    const reel = await foodModel.findById(req.params.id);

    if(!reel){
        return res.status(404).json({
        msg:"Reel not found"
    });
    }

    // Only owner partner can edit
    if(reel.foodpartner.toString() !== req.foodpartner._id.toString()){
        return res.status(403).json({
        msg:"Not authorized"
    });
    }

    const {name,description} = req.body;

    // Update fields
    reel.name = name || reel.name;
    reel.description = description || reel.description;

    // Optional video update
    if(req.file){
        const fileuploadresult = await uploadfile(req.file.buffer,uuid());
        reel.video = fileuploadresult.url;
    }

    await reel.save();

    res.json({
        msg:"Reel updated",
        reel
    });

    }
    catch(err){
        res.status(500).json({
        error:err.message
     });
    }
}

async function getSingleReel(req,res){
    try{
        const reel = await foodModel.findById(req.params.id);
        if(!reel){
            return res.status(404).json({
                msg:"Reel not found"
            })
        }
        res.json({
            reel
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

module.exports = { createFood, getfooditems, foodpartnerbyId, likefood,
    savefood, addcomment, getcomments, deletecomment,
     shareReel, getSavedReels, userdetails, updateComment,
      deleteReel, editReel, getSingleReel }