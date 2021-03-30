const express = require('express')
const app = express()
const bodyParser=require('body-parser');
const cors=require('cors');
const port = process.env.PORT || 8080
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://freshGroceryAdmin:x4nd3r1sm3@cluster0.q17pz.mongodb.net/freshGroceryDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());





client.connect(err => {
  const productCollection = client.db("freshGroceryDB").collection("products");
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

  //fetching all the data from database ends here
  
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})