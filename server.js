const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');



const port=process.env.port||8000;
const orderRoutes=require('./api/routes/orders');
const productsRoute=require('./api/routes/products');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods',"GET,POST,PATCH,PUT,DELETE");
        return res.status(200).json({});
    }
    next();
});


//mongodb connection setup
mongoose.connect('mongodb://localhost:27017/rest_in_api')
.then(()=>{
    console.log("connected to mongodb")
})
.catch(()=>{
    console.log("failed to connect :(")

})


//routes started here 

app.get('/',(req,res)=>{
    res.status(200).send('hello expressjs')
});



//routes which should handle requests
app.use('/products',productsRoute);

app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error=new Error('oops not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})

app.listen(port,()=>{
    console.log(`server is running on port : ${port}`);
})


