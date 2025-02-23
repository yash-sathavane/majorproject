const express=require("express");
const router=express.Router();

//user
 //Index
 router.get("/",(req,res)=>{
    res.send("get for users");
 });

 //show
 router.get("/:id",(req,res)=>{
    res.send("show for users");
 });

 //post
 router.post("/",(req,res)=>{
    res.send("post for users");
 });

 //Delete 
 router.delete("/:id",(req,res)=>{
    res.send("delete for users");
 });

 module.exports=router;