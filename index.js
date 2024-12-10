require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.1bvy3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
      await client.connect();

      const coffeeCollectionPrac = client.db('coffeePracticeDB').collection('coffeePrac')

      // POST route to add new coffee
      app.post('/coffee', async(req, res) => {
          const allCoffee = req.body;
          console.log(allCoffee);

          const result = await coffeeCollectionPrac.insertOne(allCoffee);
          res.send(result);
      });

      // GET route to retrieve all coffee
      app.get('/coffee', async(req, res) => {
          const cursor = coffeeCollectionPrac.find();
          const result = await cursor.toArray();
          res.send(result);
      });

      // GET route to retrieve a specific coffee by id
      app.get('/coffee/:id', async(req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollectionPrac.findOne(query);
          res.send(result);
      });

      // PUT route to update a specific coffee by id
      app.put('/coffee/:id', async(req, res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          
          const updatedCoffee = {
              $set: {
                  name: req.body.name,
                  type: req.body.type,
                  origin: req.body.origin,
                  chef: req.body.chef,
                  price: req.body.price,
                  imageUrl: req.body.imageUrl
              }
          };

          const result = await coffeeCollectionPrac.updateOne(filter, updatedCoffee, options);
          res.send(result);
      });

      // DELETE route to remove a specific coffee by id
      app.delete('/coffee/:id', async(req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollectionPrac.deleteOne(query);
          res.send(result);
      });

      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Coffee Shop API');
});

app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
