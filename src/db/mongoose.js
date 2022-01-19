const mongoose = require('mongoose');

const url = '';

mongoose.connect(url,{
    useNewUrlParser: true
}).then(()=>{
        console.log('Db is connected !!')
    }).catch((e)=>{
        console.log(e)
    })
