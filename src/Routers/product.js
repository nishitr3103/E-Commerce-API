const express= require('express');
const router = express.Router();
const Product = require('../models/ProductSchema');
const Category = require('../models/CategorySchema')
const multer = require('multer');

// for product pics
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//       const filename = file.originalname.split(' ').join('-');
//       cb(null, file.filename + '-' + Date.now())
//     }
//   })
  
// const upload = multer({ storage: storage })

router.use(express.json()); 

router.post('/products', async(req,res)=>{
    try{
        const category = await Category.findById(req.body.category) // to check the category value entered is present in db or not
        if(!category){
            return res.status(400).send("Category is invalid");
        }
        const product = new Product(req.body)
        await product.save();
        res.status(201).send(product)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.get('/products', async (req,res)=>{
   const productList = await Product.find().select('name price -_id') // .select() will help to filter the fields and using - _id it will  remove the id also
   res.send(productList)
})

//router to get the count of the products in our DB.
router.get('/products/count', async (req,res)=>{
    try{
        const productCount = await Product.countDocuments();
        res.status(201).send({count:productCount})
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.get('/products/:id', async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate({path:'category', model: Category})
        res.status(201).send(product)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.patch('/products/:id', async(req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,req.body)
        await product.save();
        res.status(201).send(product)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})

router.delete('/products/:id', async(req,res)=>{
    try{
        const product = await Product.findByIdAndRemove({_id:req.params.id})
        res.status(201).send(product)
    }
    catch(e){ 
        res.status(400).send(e)
    }
})




module.exports= router;
