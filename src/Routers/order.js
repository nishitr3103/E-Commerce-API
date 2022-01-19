const express= require('express');
const router = express.Router();
const Order= require('../models/OrderSchema');
const OrderItem = require('../models/OrderItemSchema');
const auth = require('../middleware/auth');
const Users = require('../models/UserSchema')
const Product = require('../models/ProductSchema');
const Category = require('../models/CategorySchema');
const { findByIdAndUpdate } = require('../models/OrderSchema');

//configuring express to parse incoming json
router.use(express.json()); 

router.get('/order', auth, async (req,res)=>{
    try{
        const order = await Order.find().populate({
            path : 'user',
            model: Users,
            select : 'name email'
        })
        res.status(200).send(order);
    }catch(e){
        res.status(401).send(e);
    }
})

router.post('/order', auth, async (req,res)=>{
    // First we will save the order items in orderitem table. then we will assign the value to ordeitem value ot the orderitem field in order table.
    const arr = req.body.orderitem
    const pro = Promise.all(arr.map(async items=>{
        // .map() is used for looping .. It will send array  of order items
        const orderitmeList = await  OrderItem.addorderitem(items.product,items.quantity);
        //created addorderitem() to save the values in orderitem table
        return orderitmeList;
    }))
    const value = await pro;
    
    const order = await new  Order({
        orderitem:value,
        address:req.body.address,
        pincode: req.body.pincode,
        status:req.body.status,
        user:req.body.user
    })
    try{
        await order.save()
        res.status(201).send(order)
    }catch(e){
        res.status(401).send(e)
    }
})

router.get('/order/:id', auth, async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id).populate({
            path: 'user',
            model: Users,
            select: 'name email -_id'
        }).populate({
            path:'orderitem' , populate:{
                path:'product', populate:{
                    path:'category',
                    model: Category,
                    select:'name -_id'
                },
                model:Product,
                select: 'name description category -_id'
            },
            model: OrderItem,
            select:'product quantity -_id'
        })

        res.status(200).send(order)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/order/:id', auth, async (req,res)=>{
    try{
        const order = await Order.findByIdAndUpdate(
            {_id:req.params.id}, 
            { status:req.body.status,
            })
        await order.save();   
        res.status(200).send(order);
    }catch(e){
        res.status(401).send(e);
    }
})

router.delete('/order/:id',auth ,async(req,res)=>{
    try{
    const orderitemkey = await Order.findById(req.params.id)
    const val = orderitemkey.orderitem;

    // created array to delete all the corresponding orderitems
    await val.map(async item=>{
        const orderitem = await OrderItem.findByIdAndRemove({_id:item})
    })
    const order = await Order.findByIdAndRemove({_id:req.params.id})

    res.status(200).send(order)
}catch(e){
    res.status(400).send(e)
}
})


module.exports=router;