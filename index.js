const express = require("express")
const userRouter = require('./src/Routers/user')
const productRouter = require ('./src/Routers/product')
const categoryRouter = require('./src/Routers/category')
const orderRouter = require('./src/Routers/order');

require('./src/db/mongoose')// Allow mangoose connects to database

const app = express();

app.use(userRouter)
app.use(productRouter);
app.use(categoryRouter)
app.use(orderRouter);

app.use('/',(req,res)=>{
    res.status(404).send('<h1>Page not Found !</h1>')
})

// Flow:
// user --> login /logout
// order place (orderSchema)--> having an array orderitme (products with quantity)--> that product --> having a category



const port = process.env.PORT || 3000;
app.listen(port)