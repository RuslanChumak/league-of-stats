const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let userSchema = new mongoose.Schema({
    summonerName: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!require('validator').isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.indexOf('password') !== -1 )
                throw new Error('Password is invalid')
        }
    },
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ]
})
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
userSchema.statics.findOneByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Incorrect email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Incorrect password')
    }
    return user
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'kdweueksdsjfij')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
userSchema.virtual('tasks', {
    ref: "Task",
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model("User", userSchema)

module.exports = User

