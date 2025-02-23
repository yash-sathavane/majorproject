const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try {
        let{username,email,password}=req.body;
        const newuser=new User({
            email,
            username
        });
        const registeredUser=await User.register(newuser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("msg","Welcome to Wanderlust!");
            res.redirect("/listing");
        });
    } catch (error) {
        req.flash("err",error.message);
        res.redirect("/signup");
    }
  
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("msg","Welcome back to wanderlust!");
    let redirect=res.locals.redirectUrl||"/listing";
    res.redirect(redirect);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        next(err);
        }
        req.flash("msg","Logged you out!");
        res.redirect("/listing");
    })
};