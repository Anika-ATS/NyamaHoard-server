const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT||5000;
//midddleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ashfkhm.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //mongodb
    const catagoryCollection = client.db("Nyama").collection("CatagoryCard");
    const ADDaToyCollection = client.db("Nyama").collection("ADDaToy");

    
     app.get('/toy', async(req, res) => {
      const cursor=catagoryCollection.find();
       const result=await cursor.toArray();
      res.send(result);
     })

    //find by id
    app.get('/toy/:id', async(req, res) => {
      const id= req.params.id;
      const query={ _id: new ObjectId(id)};
      
      const options = {
       
        // Include only the `title` and `imdb` fields in the returned document
        projection: { picture:1, name:1, SellerName:1, SellerEmail:1, price:1, Ratings:1, Stock:1,Description:1  },
      };


      const result=await catagoryCollection.findOne(query,options) ;
      res.send(result);
     })

     //AddaToy collection
     //get data from second db conditional email
     app.get('/AddAtoy', async(req, res) => {
      console.log(req.query.email);
      // console.log(req.query);
      let query = {};
     
      if(req.query?.email)
      {
          query={email:req.query.email};
      }
      const result=await ADDaToyCollection.find(query).toArray() ;

      res.send(result);

     })

     //send data from client to server data
     app.post('/AddAtoy', async(req, res) => {
       const AddaToy=req.body;
       console.log(AddaToy);
       const result=await ADDaToyCollection.insertOne(AddaToy);
       res.send(result);


     })
    //  //update
    //  app.put('/AddAtoy/:id', async(req, res) => {
    //   const ToyUpdate=req.body;
      
    //   // res.send(result);
    // })




     //delete
     
     app.delete('/AddAtoy/:id', async(req, res) => {
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await ADDaToyCollection.deleteOne(query);
      res.send(result);


    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Nyama')
  })

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
