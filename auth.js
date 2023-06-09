const{Schema,model}=require("mongoose")
const {isEmail}=require("validator")
const bcrypt=require("bcrypt")

let userSchema=new Schema({
    
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:[true,"email is required"],
        validate:[isEmail,"enter valid email"]
       
    },
    password:{
        type:String,
        minlength:[6,"minimum length of characters are 6"],
        required:[true,"password is required"]
        
    }
},{timestamps:true})

//mongoose Hook

userSchema.pre("save",async function (next) {
    let salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
    
})
//statics methods
userSchema.statics.login=async function (email,password) {
    let user=await this.findOne({email}).lean()
    if(user){
        let auth=await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect Email")
}

module.exports=model("user",userSchema)