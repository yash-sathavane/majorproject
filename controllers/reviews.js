const review=require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listings=await listing.findById(req.params.id);
    const rew=req.body.revi;
    const nrew=new review(rew);
    let {id}=req.params;
    
    
    nrew.author=req.user._id;
    listings.reviews.push(nrew);
    console.log(nrew);
    await nrew.save();
    await listings.save();
   
  
   req.flash("msg","Review added!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
   req.flash("msg","Review deleted!");
    res.redirect(`/listing/${id}`);

};