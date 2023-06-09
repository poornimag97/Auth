const jwt=require("jsonwebtoken")
const User=require("../models/auth")
// verify jwt

let requireAuth=(req,res,next)=>{
    let token=req.cookies.jwt
    if(token){
        jwt.verify(token,"topsecret",(err,decodedToken)=>{
            if(err){
                res.redirect("/login")
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect("/login")
    }
}
//checkuser

let checkUser=(req,res,next)=>{
    let token=req.cookies.jwt
    if(token){
        jwt.verify(token,"topsecret",async(err,decodedToken)=>{
            if(err){
                res.locals.user=null
                next()
            }
            else{
                let id=decodedToken.id
                let user=await User.findById(id).lean()
                res.locals.user=user
                next()
            }
        })
    }
    else{
        res.locals.user=null
        next()
    }
}

module.exports={
    requireAuth,
    checkUser
}