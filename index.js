const express = require('express');
require('./db/config');
const user = require('./db/User');

const app = express();

app.post("/register",(req, res)=>{
    res.send("api in progress")
})

app.listen(5000);
