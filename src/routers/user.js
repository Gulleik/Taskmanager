const express = require("express")
const router = new express.Router()
const User = require("../models/user")

router.get("/users", async (req,res)=>{
    try{
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id
    try{
     user = await User.findById(_id)
     if(!user){
        return res.status(404).send()
    }
    res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post("/users", async (req, res) =>{
    const user = new User(req.body)
    const token = await user.generateAuthToken()

    try{
        await user.save()
        res.status(201).send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.patch('/users/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "email", "password"]
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
 
    if(!isValidOperation){
        return res.status(400).send({error: "ugyldig oppdatering"})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save()

       if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/users/:id",async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
    res.status(404).send({error: "no user by that id"})
        }

        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router