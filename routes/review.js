const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAysnc=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const review=require("../models/review.js");
const listing=require("../models/listing.js");

const {validReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

router.post("/",isLoggedIn,validReview,wrapAysnc(reviewController.createReview));


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAysnc(reviewController.deleteReview));


module.exports=router;