const listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    let allListing=await listing.find({});
    res.render("listings/index.ejs",{allListing});
  };

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    // console.log(listings);
    if(!listings){
      req.flash("err","Listing you requested for not existed");
      res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listings});
};

module.exports.createListing=async (req,res,next)=>{
  let url=req.file.path;
  let filename=req.file.filename;
    let list=req.body.list;
   const newlist=new listing(list);
   newlist.owner=req.user._id;
   newlist.image={url,filename};
   await newlist.save();
   req.flash("msg","New listing created!");
   res.redirect("/listing");  
   };

 module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    if(!listings){
        req.flash("err","Listing you requested for not existed");
        res.redirect("/listing");
      }
      let newurl=listings.image.url;
      newurl=newurl.replace("/upload","/upload/h_200,w_200");
    res.render("listings/edit.ejs",{listings,newurl});
};

module.exports.updateListing=async (req,res)=>{
    if(!(req.body.list)){
        throw new ExpressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    let newlist=await listing.findByIdAndUpdate(id,{...req.body.list});
    if(typeof req.file!="undefined")
   {
     let url=req.file.path;
    let filename=req.file.filename;
    newlist.image={url,filename};
    await newlist.save();
    }
   req.flash("msg","listing updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
   req.flash("msg","listing deleted!");
    res.redirect(`/listing`);
};
