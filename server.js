const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) =>{

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


  next();
 
})
// MongoDB Atlas connection string
const connectionURL = "mongodb+srv://rozyyevsanjar:Sanjik2004@cluster0.759yl6s.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(connectionURL, { 
  serverApi: { 
    version: ServerApiVersion.v1,
    strict: false, 
    deprecationErrors: true,
  }
});

let db;

// Connect to MongoDB Atlas
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("middlesex_clubs");

    // Setup routes after successful connection
    app.get("/clubs", async (req, res) => {
      try {
        const clubs = await db.collection("clubs").find({}).toArray();
        res.json(clubs);
      } catch (err) {
        res.status(500).json({ message: "Error fetching clubs", error: err });
      }
    });

    app.post("/clubs", async (req, res) => {
      try {
        const newClub = req.body;
        const result = await db.collection("clubs").insertOne(newClub);
        res.status(201).json(result.ops);
      } catch (err) {
        res.status(500).json({ message: "Error adding club", error: err });
        console.error(err);
      }
    });

    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas", err);
  }
}

startServer();
