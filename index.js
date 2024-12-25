const express=require('express');
const cors=require('cors');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieparser());

app.get('/',(req,res)=>{
  res.send('food is ready');
})



//mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7txs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //Database
    const allFoods=client.db('hungryNakiDB').collection('foods');
    const purchasedFood=client.db('hungryNakiDB').collection('purchasedFood');

    // allfoods
    app.get('/foods',async(req,res)=>{
      const page=parseInt(req.query.page);
      const size=parseInt(req.query.size);
      const cursor=allFoods.find();
      const result=await cursor
      .skip(page*size)
      .limit(size)
      .toArray();
      res.send(result);
    })

    // single food by id
    app.get('/foods/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await allFoods.findOne(query);
      res.send(result);
    })

    // products count
    app.get('/productsCount',async(req,res)=>{
      const count=await allFoods.estimatedDocumentCount();
      res.send({count});
    })

    //purchased food to db
    app.post('/purchasedFood',async(req,res)=>{
      const food=req.body;
      const result=purchasedFood.insertOne(food);
      res.send(result);
    })

    //getting purchased product
    app.get('/purchasedFood',async(req,res)=>{
      const cursor=purchasedFood.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    // get food list by email address
    app.get('/allFoods/:email',async(req,res)=>{
      const email=req.params.email;
      const query={"addBy.email": email};
      const result=await allFoods.find(query).toArray();
      res.send(result);
    })









    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
  console.log(`food is cooking at ${port}`);
})