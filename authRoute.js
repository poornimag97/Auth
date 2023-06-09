const express=require("express")
const User=require("../models/auth")
const jwt=require("jsonwebtoken");
const {requireAuth} = require("../middlewares/requireAuth");
let authRouter=express.Router()

function handleError(err){
  console.log(err.message,err.code);
  let errors={email:"",password:""}

  if(err.code===11000){
    errors["email"]="email already exists";
    return errors;
  }
  if(err.message==="incorrect Email") {
    errors.email="that email doesn't exists"
  }
  if(err.message==="incorrect password"){
    errors.password="that password is not correct"
  }
  
  if(err.message.includes("user validation failed")){
    Object.values(err.errors).forEach(({properties})=>{
      errors[properties.path]=properties.message
    })
  }
  return errors;
}
    let maxAge=3*24*60*60      
    function createToken(id) {
      return jwt.sign({id},"topsecret",{
        expiresIn:maxAge
      })
    }

authRouter.get("/",(req,res)=>{
    res.render("home")
})

authRouter.get("/secret", requireAuth,(req,res)=>{
    res.render("secret")
})


authRouter.get("/login",(req,res)=>{
    res.render("login")

})

authRouter.post("/login",async(req,res)=>{
    // res.send("login")
    const{email,password}=req.body
    try {
      let user=await User.login(email,password)
      let token=createToken(user._id)
      res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:maxAge*1000
      })
      res.status(200).json(user)
      // console.log(email,password);
    } catch (error) {
      let errors=handleError(error)
      res.status(400).json({errors})
      // console.log(error);
    }

})

authRouter.get("/signup",(req,res)=>{
    res.render("signup")
})

authRouter.post("/signup",async(req,res)=>{
  const{email,password}=req.body
  try {
    let user=await User.create({email,password})
    let token=createToken(user._id)
    res.cookie("jwt",token,{
      httpOnly:true,
      maxAge:maxAge*1000
    })
     res.status(201).json(user)
  } catch (err) {
    let errors=handleError(err)
    res.status(400).json({errors})
    // console.log(err);
   // res.send("user not created")
  }
})


authRouter.get("/logout",(req,res)=>{
  try {
    res.cookie("jwt","",{
      maxAge:1
    })
    res.redirect("/login")
  } catch (error) {
    res.status(400).send("unable to logout")
  }
})

module.exports=authRouter;