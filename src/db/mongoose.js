const mongoose = require('mongoose');

const url = 'mongodb+srv://ecommerce_api:nodejs@cluster1.pkihm.mongodb.net/Ecommerce_api?retryWrites=true&w=majority';

mongoose.connect(url,{
    useNewUrlParser: true
}).then(()=>{
        console.log('Db is connected !!')
    }).catch((e)=>{
        console.log(e)
    })