const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type :String,
    required:true
},
phone: Number,
isadmin:{
    type:Boolean,
    default:false
},// here token is an array of objects, 
tokens:[{
    token : {
        type:String,
        required:true
    }
}]
})

UserSchema.pre('save', async function(next){   
    /// save is the name of the event
    // here, we will not use arrow function becasue arrow function can not bind  things.. need to check !!!
    // this : is used to get access to the individual user thats about to be saved
    // next : if next is not used then the code will hang becasue it will think we are still running some lgics before saving the user and it will not save the user
    // everything will work at the time of creating user but it will not work at the time of updating because some mongoose queries bypass the advance middlewar functions... so, that why wee need change patch request ...
    const user = this
    if(user.isModified('password')){ // is modefied will give true when new user password is created and also when any user password is updated
        user.password= await bcrypt.hash(user.password,8) //bcypt is installed and required
    }
    next()
})

// setting middlewar to check user credentials in login page
UserSchema.statics.userCredtials = async (email,password)=>{
    //userCredtials is custome build
    //static -- helps to directly access the model when we have actually have access to ... like every time userschema is called this will also run
    const user = await Users.findOne({email : email}) // find the passed email to check if its present or not
    if(!user){
        throw new Error("User not found")
    }
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Credentials invalid")
    }
    return user;
}

// setting up new token when a new user is created or when a exisitng user is logged in
UserSchema.methods.gettoken= async function(){
    const user=this;
    try{
        const token= await jwt.sign({_id:user._id.toString() },'thisismysecrettoken');
       //const token= await jwt.sign({_id:user._id.toString() },process.env.JWTSECRET);
        const tokens=user.tokens.push({token});//here it add the token values to the array of tokens
        console.log(tokens)
        await user.save();
        return token
    }
    catch(e){
        console.log(e)
        throw new Error('token not generating')
    }            
}

const Users = mongoose.model('users',UserSchema);

module.exports= Users;