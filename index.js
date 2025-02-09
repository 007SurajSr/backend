const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result)
})

app.post("/login", async (req, resp) => {
    if(req.body.password && req.body.email){
       let user = await User.findOne(req.body).select("-password");
       if (user) {
          resp.send(user)
       } else {
          resp.send({result: 'No user found'});
       }     
   } else {
    resp.send({result: 'No user found'});
   }})

 app.post("/add-product", async (req,resp) => {
   let product = new Product(req.body);
   let result = await product.save();
   resp.send(result);
 })

 app.get('/products', async (req,resp) =>{
   let product = await Product.find();
   if(product.length>0){
      resp.send(product)
   }else{
      resp.send({result:'No Product Found!!...'});
   }
 });

 app.delete('/delete/:id', async (req, resp) =>{
     
    const result = await Product.deleteOne({_id:req.params.id});
    resp.send(result);
 });

 app.put('/update/:_id', async (req,res) =>{
   let data = await Product.updateOne(
    req.params,
    {$set:req.body
    })
   res.send(data);
})

app.listen(5000);
