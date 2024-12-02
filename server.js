const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(bodyParser.json());

const password = "Sanjik2004";
const username = "rozyyevsanjar";
const server = "cluster0.759yl6s.mongodb.net"

const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);

// MongoDB Atlas connection string
const connectionURL = "mongodb+srv://rozyyevsanjar:Sanjik2004@cluster0.759yl6s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Replace `<username>` and `<password>` with your credentials.
// Replace `middlesex_university` with your database name.

const client = new MongoClient(connectionURL, { 
  serverApi: { 
      version: ServerApiVersion.v1,
      strict: false,//Setting this to true breaks text index queries.
      deprecationErrors: true,
  }
});
let db;

// Connect to MongoDB Atlas
client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB Atlas", err);
    return;
  }
  console.log("Connected to MongoDB Atlas");
  db = client.db(); // No need to specify the DB name again if it's in the connection string
});

// Routes

// Fetch all clubs
app.get("/clubs", async (req, res) => {
  try {
    const clubs = await db.collection("clubs").find({}).toArray();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clubs", error: err });
  }
});

// Add a new club
app.post("/clubs", async (req, res) => {
  try {
    const newClub = req.body;
    const result = await db.collection("clubs").insertOne(newClub);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ message: "Error adding club", error: err });
  }
});

// Start Server
const PORT = 5001 ;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
