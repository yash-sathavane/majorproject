const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");

app.set("view engine","ejs");
let path=require("path");
app.set("views",path.join(__dirname,"views"));

const session=require("express-session");
const flash=require("connect-flash");
app.use(flash());
app.use(session({secret:"mysuperscretstring",
  resave:false,
  saveUninitialized:true

}));

app.get("/test",(req,res)=>{
  res.send("Test successful.");
});

app.get("/reqcount",(req,res)=>{
  if(req.session.count){
    req.session.count++;
  }
  else{
    req.session.count=1;
  }
  res.send(`You sent a request ${req.session.count} times`);
})

app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  next();
})

app.get("/register",(req,res)=>{
  let {name="Anonymous"}=req.query;
  req.session.name=name;
  if(name==="Anonymous"){
    req.flash("error","user not registered.");
  }else{
  req.flash("success","User registered successfully!");}
  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
 
  res.render("index.ejs", {name:req.session.name});
})

app.listen("3000",()=>{
  console.log("App listening on port 3000.")
})






















// const cookieParser = require('cookie-parser');
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies",(req,res)=>{
//   res.cookie("color","red",{signed:true});
//   res.send("done");
// });

// app.get("/verify",(req,res)=>{
//   res.send(req.signedCookies);
// });

//  app.get("/getcookies",(req,res)=>{
//   res.cookie("greet","namste");
//   res.cookie("madein","india");
//   res.send("sent you come cookies");
//  });

//  app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hii,I am root!");
//  });

//  app.get("/greet",(req,res)=>{
//   let {name="Annonymous"}=req.cookies;
//   res.send(`Hii ${name}`);
//  })



//  app.use("/users",users);
//  app.use("/posts",posts);

 