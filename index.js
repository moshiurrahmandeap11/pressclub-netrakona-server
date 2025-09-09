const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.crm9gp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// collections
let lastUpdateCollection;
let importantPersonCollection;
let importantLinksCollection;
let pcHistoryCollection;

async function run() {
  try {
    await client.connect();

    const db = client.db("pressClubWebsite"); // ✅ Single database
    lastUpdateCollection = db.collection("lastUpdates");
    importantPersonCollection = db.collection("importantPersons");
    importantLinksCollection = db.collection("importantLinks");
        pcHistoryCollection = db.collection("pcHistory");

    console.log("✅ MongoDB connected successfully (pressClubWebsite)");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run();

// ================== CRUD for Last Update ==================

// CREATE
app.post("/last-update", async (req, res) => {
  try {
    const newUpdate = req.body;
    newUpdate.date = new Date();
    const result = await lastUpdateCollection.insertOne(newUpdate);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to add update" });
  }
});

// READ all
app.get("/last-update", async (req, res) => {
  try {
    const updates = await lastUpdateCollection.find().sort({ date: -1 }).toArray();
    res.send(updates);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch updates" });
  }
});

// READ single
app.get("/last-update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = await lastUpdateCollection.findOne({ _id: new ObjectId(id) });
    res.send(update);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch update" });
  }
});

// UPDATE
app.put("/last-update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDoc = {
      $set: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        date: new Date(),
      },
    };
    const result = await lastUpdateCollection.updateOne(
      { _id: new ObjectId(id) },
      updatedDoc
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to update" });
  }
});

// DELETE
app.delete("/last-update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await lastUpdateCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to delete" });
  }
});

// ================== CRUD for Important Person ==================

// CREATE
app.post("/important-person", async (req, res) => {
  try {
    const newPerson = req.body; 
    const result = await importantPersonCollection.insertOne(newPerson);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add person", error: error.message });
  }
});

// READ all
app.get("/important-person", async (req, res) => {
  try {
    const result = await importantPersonCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch people", error: error.message });
  }
});

// READ single
app.get("/important-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await importantPersonCollection.findOne({ _id: new ObjectId(id) });
    if (!person) {
      return res.status(404).send({ message: "Person not found" });
    }
    res.send(person);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch person", error: error.message });
  }
});

// UPDATE
app.put("/important-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPerson = req.body; 
    const result = await importantPersonCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPerson }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update person", error: error.message });
  }
});

// DELETE
app.delete("/important-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await importantPersonCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete person", error: error.message });
  }
});

// ================== CRUD for Important Links ==================

// CREATE
app.post("/important-links", async (req, res) => {
  try {
    const newLink = {
      title: req.body.title,
      url: req.body.url,
      createdAt: new Date(),
    };
    const result = await importantLinksCollection.insertOne(newLink);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add link", error: error.message });
  }
});

// READ all
app.get("/important-links", async (req, res) => {
  try {
    const links = await importantLinksCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(links);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch links", error: error.message });
  }
});

// READ single
app.get("/important-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const link = await importantLinksCollection.findOne({ _id: new ObjectId(id) });
    if (!link) return res.status(404).send({ message: "Link not found" });
    res.send(link);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch link", error: error.message });
  }
});

// UPDATE
app.put("/important-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLink = {
      title: req.body.title,
      url: req.body.url,
      // optionally update createdAt? Usually keep original
    };
    const result = await importantLinksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedLink }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update link", error: error.message });
  }
});

// DELETE
app.delete("/important-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await importantLinksCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete link", error: error.message });
  }
});

// ================== CRUD for PC History ==================


// CREATE / ADD HISTORY
app.post("/pc-history", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).send({ message: "Description is required" });

    // Only allow one history document? (Optional: if only one history exists)
    const existing = await pcHistoryCollection.findOne({});
    if (existing) {
      return res.status(400).send({ message: "History already exists. Use PUT to update." });
    }

    const newHistory = {
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await pcHistoryCollection.insertOne(newHistory);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to add history", error: err.message });
  }
});

// READ ALL / GET HISTORY
app.get("/pc-history", async (req, res) => {
  try {
    const history = await pcHistoryCollection.find().sort({ updatedAt: -1 }).toArray();
    res.send(history);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch history", error: err.message });
  }
});

// READ SINGLE
app.get("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const history = await pcHistoryCollection.findOne({ _id: new ObjectId(id) });
    if (!history) return res.status(404).send({ message: "History not found" });
    res.send(history);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch history", error: err.message });
  }
});

// UPDATE / EDIT HISTORY
app.put("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description) return res.status(400).send({ message: "Description is required" });

    const updatedDoc = {
      $set: {
        description,
        updatedAt: new Date(),
      },
    };

    const result = await pcHistoryCollection.updateOne({ _id: new ObjectId(id) }, updatedDoc);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to update history", error: err.message });
  }
});

// DELETE HISTORY
app.delete("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pcHistoryCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to delete history", error: err.message });
  }
});

// ================== Root ==================
app.get("/", (req, res) => {
  res.send("Press Club Website Server running ✅");
});

app.listen(port, () => {
  console.log(`Press Club server running on port ${port}`);
});
