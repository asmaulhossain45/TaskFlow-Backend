const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 3000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://task-flow-asmaul.web.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `${process.env.DB_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const taskCollection = client.db("TaskFlow").collection("Tasks");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TaskFlow is Running ....");
});

// ===== CRUD operation =====

// ----- Read Operation -----
app.get("/tasks", async (req, res) => {
  const result = await taskCollection.find().toArray();
  res.send(result);
});

// ----- Post Operation -----
app.post("/task", async (req, res) => {
  const task = req.body;
  console.log(task);
  const result = await taskCollection.insertOne(task);
  console.log(result);
  res.send(result);
});

// ----- Update Operation -----
app.patch("/task/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const filter = { _id: new ObjectId(id) };
  const updatedData = {
    $set: {
      status: data.taskName,
    },
  };
  const result = await taskCollection.updateOne(filter, updatedData);
  res.send(result);
});

// ----- delete Operation -----
app.delete("/task/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
