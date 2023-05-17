const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');



//get all products 
router.get('/',(req,res,next)=>{
    Product.find()
    .exec()
    .then((docs)=>{
        console.log(docs);
        res.status(200).json(docs);
      
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

});


//post route
router.post('/',(req,res,next)=>{
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price

    });
    product.save().then((result)=>console.log(result))
    .catch((error)=>console.log(error));
    res.status(201).json({
        message:"Handling Post request",
        createProductProperty:product
    });
});

//get products by id
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc=>{
        console.log("Frome Database",doc);
        if (doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message:"No valid documents found"});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })

})


//update route
router.patch('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;

    }
    Product.update({_id:id},{$set:{name:req.body.newName,price:req.body.price}})
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
})


//delete route
router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findByIdAndDelete({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });


})


module.exports=router