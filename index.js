require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.post('/coffee', async(req, res) => {
        const allCoffee = req.body
        console.log(allCoffee)

        const result = await coffeeCollectionPrac.insertOne(allCoffee);
        res.send(result)
    })

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
