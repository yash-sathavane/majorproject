if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");

const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine","ejs");
let path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public"))); 

const flash=require("connect-flash");
const session=require("express-session");

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.msg=req.flash("msg");
    res.locals.err=req.flash("err");
    res.locals.currentUser=req.user;
    next();
})


const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const listing=require("./models/listing.js");
const review=require("./models/review.js");



const listings=require("./routes/listing.js");
app.use("/listing",listings);
const reviews=require("./routes/review.js");
app.use("/listing/:id/review",reviews);
const userRoute=require("./routes/user.js");
app.use("/",userRoute);


// app.get("/register",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"Delta student"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(mongo_url);
}
main().then(()=>{
    console.log("connected to DB.");
}).catch((err)=>{
    console.log(err);
});

app.listen("8080",(req,res)=>{
    console.log("app is listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("this is root path.");
});












app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})



app.use((err,req,res,next)=>{
   let{status=500,message="some wrong"}=err;
//    res.status(status).send(message);
   res.render("error.ejs",{message});

});


