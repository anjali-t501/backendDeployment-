const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("connected...");
    })
    //.catch(err=>console.log(err))
    
}

module.exports = connectDatabase;