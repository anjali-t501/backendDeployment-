const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const dotenv =  require('dotenv');
const cors = require('cors')

// Config 
dotenv.config({path:"backend/config/config.env"});


app.use(cookieParser())

//after cloudnary
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}))
app.use(fileupload())
app.use(bodyParser.json({limit: '50mb'}));


//to add multiple images placing express.json() AFTER bodyParser.
//if runing express.json() first, express would set the global limit to 1mb.
app.use(express.json())


app.use(express.json())

app.use(cors());

//Route Imports
const user = require("./routes/userRoutes")
const animalType = require('./routes/categories/animalTypeRoutes')
const treatmentType = require('./routes/categories/treatmentTypeRoute')
const product =  require('./routes/productsRoute')
const essential = require('./routes/categories/dailyEssentialRoutes');
const medical = require('./routes/categories/medicalCareRoute');
const order = require('./routes/orderRoutes')
const faq = require("./routes/FAQRoutes");

app.use("/api/v1",user);
app.use("/api/v1",animalType);
app.use("/api/v1",treatmentType);
app.use("/api/v1",product);
app.use("/api/v1",essential);
app.use("/api/v1",medical);
app.use("/api/v1",order);
app.use("/api/v1", faq);

app.get('/vet', (req,res)=>{
    res.send(`<h1>vetmedman</h1>`);
    })
//Middleware for error
app.use(errorMiddleware)



module.exports =  app;
