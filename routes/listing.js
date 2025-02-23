const express=require("express");
const router=express.Router();

const wrapAysnc=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const listing=require("../models/listing.js");

const {isLoggedIn, isOwner,validListing}=require("../middleware.js");


const listingController=require("../controllers/listings.js");


const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })


router
.route("/")
.get(wrapAysnc(listingController.index))
.post(isLoggedIn,upload.single('list[image]'),validListing,wrapAysnc(listingController.createListing));

  
router.get("/new",isLoggedIn,listingController.renderNewForm);
router
.route("/:id") 
.get(wrapAysnc(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('list[image]'),validListing,wrapAysnc(listingController.updateListing)) 
.delete(isLoggedIn,isOwner,wrapAysnc(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAysnc(listingController.renderEditForm));

module.exports=router;