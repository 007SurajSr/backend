const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectDB = async () =>{
    mongoose.connect("mongodb+srv://8700suraj:21hJIFETV1vdRFDL@testt-db.5igjwzu.mongodb.net/e-commerse");
    const productSchema = new mongoose.Schema({});
    // const product = mongoose.model('product', productSchema);
    // const data = await product.find();
    const users = mongoose.model

    console.warn(data);
}
connectDB();


app.listen(5000);
