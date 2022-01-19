// this is for products with quantity you are buying 

const mongoose= require('mongoose');

const orderitemSchema = new mongoose.Schema({

    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    quantity:{
        type : Number,
        required:true
    }
})

orderitemSchema.statics.addorderitem = async (prodctid,quan)=>{
    const orderitemlist = await new orderitem({product:prodctid,quantity:quan})
    await orderitemlist.save();
    return orderitemlist._id
}

const orderitem = mongoose.model('orderitem',orderitemSchema);

module.exports= orderitem