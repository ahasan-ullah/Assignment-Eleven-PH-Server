const express=require('express');
const cors=require('cors');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');

const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieparser());

app.get('/',(req,res)=>{
  res.send('food is ready');
})

app.listen(port,()=>{
  console.log(`food is cooking at ${port}`);
})