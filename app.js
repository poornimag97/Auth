const express=require("express")
const mongoose=require("mongoose")
const authRouter=require("./routes/authRoute")
const cookieParser = require('cookie-parser')
const {checkUser}=require("./middlewares/requireAuth")
let app=express()


//registering template engine
app.set("view engine","ejs")

//db connection
async function db() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Authdb")
    console.log("db connected");
}
db()

//in built middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())

app.use(checkUser)

app.use(authRouter)

app.use((req,res)=>{
    res.render("pnf")
})



app.listen(5000,(err)=>{
    if(err)console.log(err);
    console.log("server is running on port 5000");
})

// app.get("/set-cookie",(req,res)=>{
//     res.cookie("username","mala")
//      res.send("cookie set")

// app.get("/get-cookie",(req,res)=>{
//     console.log(req.cookies);
//     res.send(req.cookies)
// })

// app.get("/delete",(req,res)=>{
//     res.clearCookie("username")
//     res.send("cookies cleared")
// })