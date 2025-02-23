const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listeningSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl);
    req.session.redirectUrl=req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("err","You must logged in!");
        res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}




module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("err", "You are not the owner of this listing");
            return res.redirect(`/listing/${id}`); // Redirect to the specific listing page
        }
        next();
    } catch (error) {
        // Handle error if necessary, or call next with the error
        next(error);
    }
};


// module.exports.isOwner=async(req,res,next)=>{
//     let {id}=req.params;
//     let listings= await listing.findById(id);
//     console.log(listings);
//     console.log(res.locals.currentUser._Id);
//     if(!listings.owner.equals(res.locals.currentUser)){
//       req.flash("err","You are not the owner. so, please remain in your limit!");
//      return res.redirect(`/listing/${id}`);
     
//     }
//     next();
// }

module.exports.validListing=(req,res,next)=>{
    let result=listeningSchema.validate(req.body);
   
    if(result.error){
     throw new ExpressError(400,result.error);
    }else{
       next();
    }
}

module.exports.validReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
     throw new ExpressError(400,result.error);
    }else{
       next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    try {
        let {id,reviewId}=req.params;
        let review= await Review.findById(reviewId);
        console.log(review);
        console.log(res.locals.currentUser._id);
        if(!review.author.equals(res.locals.currentUser._id)){
          req.flash("err","You are not the author of this review");
         return res.redirect(`/listing/${id}`);
         
        }
        next();
    } catch (error) {
        next(error);
    }
       
    }