// order schema is for how many orderitems (products with quantity) u r purchasing

const mongoose= require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderitem : [{ /// array coz there will be multiple items
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderitem',
        required: true
    }],
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number
    },
    status:{
        type : String,
        default:'In progress'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    }
})

const order = mongoose.model('orders',OrderSchema);

module.exports= order;