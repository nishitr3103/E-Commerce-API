const express= require('express');
const router = express.Router();
const Users= require('../models/UserSchema')
const auth = require('../middleware/auth');

//configuring express to parse incoming json
router.use(express.json()); 

router.post('/users', async (req,res)=>{
    try{
        const user = new Users(req.body)
        const token= await user.gettoken(); // user because we want to get the one user instance to get its token   
        await user.save();
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login' ,async (req,res)=>{
    try{
        // userCredtials is a custom reuseable func created to fetch the email and pass from db.
        const user = await Users.userCredtials(req.body.email,req.body.password);
        const token= await user.gettoken(); // user because we want to get the one user instance to get its token   
        res.status(201).send(user) 
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req,res)=>{
    try{
        const user = await Users.find().select('name email phone')
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/:id', async (req,res)=>{
    try{
        const user = await Users.findById(req.params.id).select('-password'); // -password will be excluded
        res.status(200).send(user);
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports= router