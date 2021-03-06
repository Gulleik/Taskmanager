const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        deafult: 0,
        validate(value){
            if(Age<0){
                throw new Error("alder må være positiv")
            }
        }

    } ,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes("password")){
                throw new Error("kan ikke ha password i passordet");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error("unable to login")
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()},'GulleikErKul')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.pre("save", async function (next) {
    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.pre("remove", async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model("User",userSchema)

module.exports = User