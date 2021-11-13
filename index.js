const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk9pn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log(`mongodb connected`);
    const database = client.db("dronePilot");
    const userCollection = database.collection("users");
    const productCollection = database.collection("product");
    const orderCollection = database.collection("order");
    const reviewCollection = database.collection("reviews");

    app.post("/users", async (req, res) => {
      const doc = req.body;
      const result = await userCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      console.log(req.body.role);
      const email = req.body.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: req.body.role,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.json(result);
    });

    app.post("/products", async (req, res) => {
      const doc = req.body;
      const result = await productCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.json(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    app.get("/orders/:userID", async (req, res) => {
      const userID = req.params.userID;
      const query = { userID: userID };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
    app.put("/approveorder/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Shipped",
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.post("/reviews", async (req, res) => {
      const doc = req.body;
      const result = await reviewCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
