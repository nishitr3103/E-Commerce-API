const express= require('express')
const router= express.Router()

const Category = require('../models/CategorySchema');

router.get('/category',async (req,res)=>{

    try{
        const categoryList = await Category.find()
        res.status(201).send(categoryList)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.post('/category',async (req,res)=>{

    const category = new Category(req.body)
    try{
        await category.save()
        res.status(201).send(category)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.get('/category/:id', async(req,res)=>{

    try{
        const category= await Category.findById({_id:req.params.id})
        res.status(201).send(category)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.patch('/category/:id', async (req,res)=>{
    
    try{
        const category= await Category.findByIdAndUpdate(
            req.params.id, 
            { name:req.body.name,
              color:req.body.color
            })
        await category.save();
        res.status(201).send(category)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.delete('/category/:id', async (req,res)=>{

    try{
        const category= await Category.findByIdAndRemove({_id:req.params.id})
        res.status(201).send(category)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})


module.exports= router;