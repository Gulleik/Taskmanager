const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

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
    }
})

userSchema.pre("save", async function (next) {
    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model("User",userSchema)

module.exports = User