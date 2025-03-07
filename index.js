const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');
const app = express();
const Jwt = require('jsonwebtoken');

const jwtKey = 'e-com';

app.use(express.json());
app.use(cors());


app.post("/register",   async (req, res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({result}, jwtKey, {expiresIn: "2h"}, (err,token) => {
      if(err){
         res.send({result: "Something went wrong, Please try again later"})
      }
      res.send({result, auth:token})
   })
})

app.post("/login",   async (req, resp) => {
    if(req.body.password && req.body.email){
       let user = await User.findOne(req.body).select("-password");
       if (user) {
         Jwt.sign({user}, jwtKey, {expiresIn: "2h"}, (err,token) => {
            if(err){
               resp.send({result: "Something went wrong, Please try again later"})
            }
            resp.send({user, auth:token})
         })
         
       } else {
          resp.send({result: 'No user found'});
       }     
   } else {
    resp.send({result: 'No user found'});
}})

 app.post("/add-product", verifyToken, async (req,resp) => {
   let product = new Product(req.body);
   let result = await product.save();
   resp.send(result);
 })

 app.get('/products', verifyToken, async (req,resp) =>{
   let product = await Product.find();
   if(product.length>0){
      resp.send(product)
   }else{
      resp.send({result:'No Product Found!!...'});
   }
 });

 app.delete('/delete/:id', verifyToken, async (req, resp) =>{
     
    const result = await Product.deleteOne({_id:req.params.id});
    resp.send(result);
 });

app.get('/update/:id', verifyToken, async (req,resp) =>{
   let result = await Product.findOne({_id: req.params.id});
   if (result){
      resp.send(result)
   } else {
      resp.status(404).send({result:"No record Found.."});
   }
});

 app.put('/product/:id', verifyToken, async (req,res) =>{
   let result = await Product.updateOne(
    {_id: req.params.id},
    {
      $set:req.body
    })
   res.send(result);
});

app.get('/search/:key', verifyToken, async (req,resp)=>{
   let result = await Product.find({
      "$or": [
         {name : {$regex: req.params.key}},
         {company : {$regex: req.params.key}},
         {price : {$regex: req.params.key}},
         {category : {$regex: req.params.key}}
      ]
   });
   resp.send(result);
})

function verifyToken(req,resp,next){
   let token = req.headers['authorization'];
   if(token){
      token = token.split( ' ')[1];
      Jwt.verify(token, jwtKey, (err, valid) => {
         if(err) 
            {
             resp.status(401).send({result: "Please provide valid token "});
         } else {
            next();
         }
      })
   } else {
      resp.status(403).send({ result : " Please add token with header"});
   }
}

app.listen(5000);
