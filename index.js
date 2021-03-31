const express = require('express')
const app = express()
const bodyParser=require('body-parser');
const cors=require('cors');
const port = process.env.PORT || 8080
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = "mongodb+srv://freshGroceryAdmin:x4nd3r1sm3@cluster0.q17pz.mongodb.net/freshGroceryDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());





client.connect(err => {
  const productCollection = client.db("freshGroceryDB").collection("products");
  const orderCollection = client.db("freshGroceryDB").collection("orders");
  // adding product to database starts here
  app.post('/addProduct',(req,res)=>{
    const product=req.body;
    console.log(product);
    productCollection.insertOne(product)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })
  // adding product to database ends here

  //fetching all the data from database starts here

  app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/singleproduct/:pdId',(req,res)=>{
    productCollection.find({_id:ObjectId(req.params.pdId)})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  //fetching all the data from database ends here

  //Oder storing in database starts here
  app.post('/processorder',(req,res)=>{
    const order=req.body;
    orderCollection.insertOne(order)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })
  //Oder storing in database ends here

  //my order history starts here
  app.get('/myorderhistory/:myEmailId',(req,res)=>{
    const emailId=req.params.myEmailId;
    orderCollection.find({customerEmail:emailId})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  //my order history ends here

  //Single Product Delete starts here
  app.delete('/deletesingleproduct/:pdId',(req,res)=>{
    const productId=req.params.pdId;
    console.log(productId);
    productCollection.deleteOne({_id:ObjectId(productId)})
    .then(result=>{
      res.send(result.deletedCount>0);
    })
  })
  //Single Product Delete ends here
  
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})