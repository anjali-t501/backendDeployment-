const app = require('./app');
const dotenv =  require('dotenv');
const connectDatabase = require("./database-Connection/database")
const cloudinary = require('cloudinary')

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught Exception ");
    process.exit(1);
})

// Config 
dotenv.config({path:"backend/config/config.env"});


//connecting database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const port =  process.env.PORT;

const server = app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})


//unhandled promise rejection -> if mongodb url is wrong
//we want server to be crashed
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})
