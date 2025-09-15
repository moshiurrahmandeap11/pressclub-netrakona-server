const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
let pcHeaderSlideshowCollection;
let sliderCollection;
let mishonvishonCollection;
let achievementCollection;
let memberlistCollection;
let adminstrationCollection;
let mediaCollection;
let committeeCollection;
let galleryCollection;
let contactCollection;
let quickContactCollection;
let officeHoursCollection;

async function run() {
  try {
    // await client.connect();

    const db = client.db("pressClubWebsite"); // ✅ Single database
    lastUpdateCollection = db.collection("lastUpdates");
    importantPersonCollection = db.collection("importantPersons");
    importantLinksCollection = db.collection("importantLinks");
    pcHistoryCollection = db.collection("pcHistory");
    pcHeaderSlideshowCollection = db.collection("pcheaderSlideShow")
    sliderCollection = db.collection("sliderCollection")
    mishonvishonCollection = db.collection("mishonVishon")
    achievementCollection = db.collection("achivementCollection")
    memberlistCollection = db.collection("memberlist")
    adminstrationCollection = db.collection("adminstration")
    mediaCollection = db.collection("media")
    committeeCollection = db.collection("commitiee")
    galleryCollection = db.collection("gallery")
    contactCollection = db.collection("contact")
    quickContactCollection = db.collection("quickContact"); // Add this
    officeHoursCollection = db.collection("officeHours"); // Add this


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
    const updates = await lastUpdateCollection
      .find()
      .sort({ date: -1 })
      .toArray();
    res.send(updates);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch updates" });
  }
});

// READ single
app.get("/last-update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = await lastUpdateCollection.findOne({
      _id: new ObjectId(id),
    });
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
    const result = await lastUpdateCollection.deleteOne({
      _id: new ObjectId(id),
    });
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
    res
      .status(500)
      .send({ message: "Failed to add person", error: error.message });
  }
});

// READ all
app.get("/important-person", async (req, res) => {
  try {
    const result = await importantPersonCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch people", error: error.message });
  }
});

// READ single
app.get("/important-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await importantPersonCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!person) {
      return res.status(404).send({ message: "Person not found" });
    }
    res.send(person);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch person", error: error.message });
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
    res
      .status(500)
      .send({ message: "Failed to update person", error: error.message });
  }
});

// DELETE
app.delete("/important-person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await importantPersonCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to delete person", error: error.message });
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
    res
      .status(500)
      .send({ message: "Failed to add link", error: error.message });
  }
});

// READ all
app.get("/important-links", async (req, res) => {
  try {
    const links = await importantLinksCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(links);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch links", error: error.message });
  }
});

// READ single
app.get("/important-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const link = await importantLinksCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!link) return res.status(404).send({ message: "Link not found" });
    res.send(link);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch link", error: error.message });
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
    res
      .status(500)
      .send({ message: "Failed to update link", error: error.message });
  }
});

// DELETE
app.delete("/important-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await importantLinksCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to delete link", error: error.message });
  }
});

// ================== CRUD for PC History ==================

// CREATE / ADD HISTORY
app.post("/pc-history", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description)
      return res.status(400).send({ message: "Description is required" });

    // Only allow one history document? (Optional: if only one history exists)
    const existing = await pcHistoryCollection.findOne({});
    if (existing) {
      return res
        .status(400)
        .send({ message: "History already exists. Use PUT to update." });
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
    res
      .status(500)
      .send({ message: "Failed to add history", error: err.message });
  }
});

// READ ALL / GET HISTORY
app.get("/pc-history", async (req, res) => {
  try {
    const history = await pcHistoryCollection
      .find()
      .sort({ updatedAt: -1 })
      .toArray();
    res.send(history);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Failed to fetch history", error: err.message });
  }
});

// READ SINGLE
app.get("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const history = await pcHistoryCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!history) return res.status(404).send({ message: "History not found" });
    res.send(history);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Failed to fetch history", error: err.message });
  }
});

// UPDATE / EDIT HISTORY
app.put("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description)
      return res.status(400).send({ message: "Description is required" });

    const updatedDoc = {
      $set: {
        description,
        updatedAt: new Date(),
      },
    };

    const result = await pcHistoryCollection.updateOne(
      { _id: new ObjectId(id) },
      updatedDoc
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Failed to update history", error: err.message });
  }
});

// DELETE HISTORY
app.delete("/pc-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pcHistoryCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Failed to delete history", error: err.message });
  }
});


// ================== Crud For Header SlideShow ==================


app.post("/header-slide", async(req, res) => {
  try {
    const images = req.body;
    const newSlides = {
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await pcHeaderSlideshowCollection.insertOne(newSlides)
    res.send(result)
  } catch (err) {
    res.send({
      message: "Failed to add slides",
      error: err.message
    })
  }
})

app.get("/header-slide", async(req, res) => {
  try {
    const slides = await pcHeaderSlideshowCollection.find().sort({updatedAt: -1}).toArray();
    res.send(slides)
  } catch (err) {
    res.send({
      message: "failed to get slides",
      error: err.message
    })
  }
})


app.delete("/header-slide/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const result = await pcHeaderSlideshowCollection.deleteOne({
      _id: new ObjectId(id),
    })
    res.send(result)
  } catch (err) {
    res.send({
      message: "failed to delete slide", error: err.message
    })
  }
})

// ================== Slider ==================
app.post("/slider", async(req, res) => {
  try {
    const slider = req.body;
    const newSlider = {
      slider,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await sliderCollection.insertOne(newSlider)
    res.send(result)
  } catch (err) {
    res.send({
      message: "failed to add slider",
      error:  err.message
    })
  }
})

app.get("/slider", async(req, res) => {
  try {
    const slider = await sliderCollection.find().sort({updatedAt: -1}).toArray();
    res.send(slider)
  } catch(err) {
    res.send({
      message: "failed to get slider",
      error : err.message
    })
  }
})

app.delete("/slider/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const result = await sliderCollection.deleteOne({_id: new ObjectId(id)})
    res.send(result)
  } catch(err) {
    res.send({
      message: "failed to delete slider",
      error: err.message
    })
  }
})

// ================== Mishon Vishon ==================
app.post("/mishon-vishon", async(req, res) => {
  try {
    const mishonVishon = req.body;
    const newMishonVishon = {
      mishonVishon,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await mishonvishonCollection.insertOne(newMishonVishon)
    res.send(result)
  } catch (err) {
    res.send({
      message: "failed to add mishon vishon",
      error: err.message,
    })
  }
})

app.get("/mishon-vishon", async(req, res) => {
  try {
    const mishonVishon = await mishonvishonCollection.find().sort({updatedAt: -1}).toArray();
    res.send(mishonVishon)
  } catch (err) {
    res.send({
      message: "failed to get mishon vishon",
      error: err.message,
    })
  }
})

app.patch("/mishon-vishon/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await mishonvishonCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Mission Vision not found" });
    }

    res.send({ message: "Mission Vision updated successfully", result });
  } catch (err) {
    res.status(500).send({
      message: "Failed to update Mission Vision",
      error: err.message,
    });
  }
});

app.delete("/mishon-vishon/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await mishonvishonCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Mission Vision not found" });
    }

    res.send({ message: "Mission Vision deleted successfully", result });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete Mission Vision",
      error: err.message,
    });
  }
});

// ================== Achievement ==================

app.post("/achievement", async (req, res) => {
  try {
    const achievement = req.body;
    const newAchievement = {
      ...achievement, // direct spread kore data rakho
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await achievementCollection.insertOne(newAchievement);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: "failed to add achievement",
      error: err.message,
    });
  }
});


app.get("/achievement", async(req, res) => {
  try {
    const achievement = await achievementCollection.find().sort({updatedAt: -1}).toArray();
    res.send(achievement)
  } catch {
    res.send({
      message: "failed to get data",
      error: err.message
    })
  }
})

app.patch("/achievement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await achievementCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "achievement data not found" });
    }

    res.send({ message: "achievement data updated successfully", result });
  } catch (err) {
    res.status(500).send({
      message: "failed to update achievement",
      error: err.message,
    });
  }
});


app.delete("/achievement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await achievementCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "achievement not found" });
    }

    res.send({ message: "achievement deleted successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete achievement",
      error: err.message,
    });
  }
});

// ================== Member List ==================
app.post("/member-list", async (req, res) => {
  try {
    const member = req.body;
    const newMember = {
      member,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await memberlistCollection.insertOne(newMember);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({
      message: "failed to add member",
      error: err.message,
    });
  }
});

app.get("/member-list", async (req, res) => {
  try {
    const members = await memberlistCollection.find().sort({ updatedAt: -1 }).toArray();
    res.status(200).send(members);
  } catch (err) {
    res.status(500).send({
      message: "failed to get members",
      error: err.message,
    });
  }
});

app.get("/member-list/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid member ID",
      });
    }
    const member = await memberlistCollection.findOne({ _id: new ObjectId(id) });
    if (!member) {
      return res.status(404).send({
        message: "Member not found",
      });
    }
    res.status(200).send(member);
  } catch (err) {
    res.status(500).send({
      message: "Failed to get member",
      error: err.message,
    });
  }
});

app.patch("/member-list/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid member ID" });
    }

    const updates = req.body; // এখানে শুধু member ফিল্ড আসছে
    const updatedMember = {
      member: { ...updates }, // এখানে wrap করলাম
      updatedAt: new Date(),
    };

    const result = await memberlistCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedMember },
      { returnDocument: "after" } // MongoDB driver 4.0+ syntax
    );

    // The issue was here - result.value should be just result
    if (!result) {
      return res.status(404).send({ message: "Member not found" });
    }

    res.status(200).send(result); // Send result directly, not result.value
  } catch (err) {
    console.error("Update error:", err); // Add logging for debugging
    res.status(500).send({
      message: "Failed to update member",
      error: err.message,
    });
  }
});


app.delete("/member-list/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid member ID",
      });
    }
    const result = await memberlistCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Member not found",
      });
    }
    res.status(200).send({
      message: "Member deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete member",
      error: err.message,
    });
  }
});

// ================== adminstration ==================
// GET all administration data
app.get("/adminstration", async (req, res) => {
  try {
    const result = await adminstrationCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch administration data",
      error: err.message,
    });
  }
});

// GET single administration item by ID
app.get("/adminstration/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid administration ID" });
    }

    const result = await adminstrationCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return res.status(404).send({ message: "Administration item not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch administration item",
      error: err.message,
    });
  }
});

// POST new administration item
app.post("/adminstration", async (req, res) => {
  try {
    const { name, image, tenure, contact, email, address, type } = req.body;

    // Validation
    if (!name || !tenure || !contact || !email || !address || !type) {
      return res.status(400).send({
        message: "Name, tenure, contact, email, address, and type are required",
      });
    }

    // Validate type
    if (!["president", "secretary"].includes(type)) {
      return res.status(400).send({
        message: "Type must be either 'president' or 'secretary'",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: "Invalid email format",
      });
    }

    const newAdministration = {
      name,
      image: image || "",
      tenure,
      contact,
      email,
      address,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await adminstrationCollection.insertOne(newAdministration);

    if (result.insertedId) {
      const insertedItem = await adminstrationCollection.findOne({
        _id: result.insertedId,
      });
      res.status(201).send(insertedItem);
    } else {
      res.status(400).send({ message: "Failed to create administration item" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Failed to create administration item",
      error: err.message,
    });
  }
});

// PATCH update administration item
app.patch("/adminstration/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid administration ID" });
    }

    const updates = req.body;

    // Validate email if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).send({
          message: "Invalid email format",
        });
      }
    }

    // Validate type if provided
    if (updates.type && !["president", "secretary"].includes(updates.type)) {
      return res.status(400).send({
        message: "Type must be either 'president' or 'secretary'",
      });
    }

    // Add updatedAt timestamp
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await adminstrationCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).send({ message: "Administration item not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to update administration item",
      error: err.message,
    });
  }
});

// DELETE administration item
app.delete("/adminstration/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid administration ID" });
    }

    const result = await adminstrationCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Administration item not found" });
    }

    res.status(200).send({
      message: "Administration item deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete administration item",
      error: err.message,
    });
  }
});

// ================== Media ==================
// GET all media
app.get("/media", async (req, res) => {
  try {
    const result = await mediaCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch media data",
      error: err.message,
    });
  }
});

// GET single media item by ID
app.get("/media/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid media ID" });
    }

    const result = await mediaCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return res.status(404).send({ message: "Media item not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch media item",
      error: err.message,
    });
  }
});

// POST new media item
app.post("/media", async (req, res) => {
  try {
    const { name, representative, mobile, email, type } = req.body;

    // Validation
    if (!name || !representative || !mobile || !email || !type) {
      return res.status(400).send({
        message: "Name, representative, mobile, email, and type are required",
      });
    }

    // Validate type
    if (!["electronic", "print"].includes(type)) {
      return res.status(400).send({
        message: "Type must be either 'electronic' or 'print'",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: "Invalid email format",
      });
    }

    const newMedia = {
      name,
      representative,
      mobile,
      email,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await mediaCollection.insertOne(newMedia);

    if (result.insertedId) {
      const insertedItem = await mediaCollection.findOne({
        _id: result.insertedId,
      });
      res.status(201).send(insertedItem);
    } else {
      res.status(400).send({ message: "Failed to create media item" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Failed to create media item",
      error: err.message,
    });
  }
});

// PATCH update media item
app.patch("/media/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid media ID" });
    }

    const updates = req.body;

    // Validate email if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).send({
          message: "Invalid email format",
        });
      }
    }

    // Validate type if provided
    if (updates.type && !["electronic", "print"].includes(updates.type)) {
      return res.status(400).send({
        message: "Type must be either 'electronic' or 'print'",
      });
    }

    // Add updatedAt timestamp
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await mediaCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).send({ message: "Media item not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to update media item",
      error: err.message,
    });
  }
});

// DELETE media item
app.delete("/media/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid media ID" });
    }

    const result = await mediaCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Media item not found" });
    }

    res.status(200).send({
      message: "Media item deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete media item",
      error: err.message,
    });
  }
});


// ================== committee ==================
// GET all committee members
app.get("/committee", async (req, res) => {
  try {
    const result = await committeeCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch committee data",
      error: err.message,
    });
  }
});

// GET single committee member by ID
app.get("/committee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid committee ID" });
    }

    const result = await committeeCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return res.status(404).send({ message: "Committee member not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch committee member",
      error: err.message,
    });
  }
});

// POST new committee member
app.post("/committee", async (req, res) => {
  try {
    const { image, name, designation, occupation, contact, email, address } = req.body;

    // Validation
    if (!name || !designation || !occupation || !contact || !email || !address) {
      return res.status(400).send({
        message: "Name, designation, occupation, contact, email, and address are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: "Invalid email format",
      });
    }

    // Validate image URL if provided
    if (image && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(image)) {
      return res.status(400).send({
        message: "Invalid image URL",
      });
    }

    const newMember = {
      image: image || '',
      name,
      designation,
      occupation,
      contact,
      email,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await committeeCollection.insertOne(newMember);

    if (result.insertedId) {
      const insertedItem = await committeeCollection.findOne({
        _id: result.insertedId,
      });
      res.status(201).send(insertedItem);
    } else {
      res.status(400).send({ message: "Failed to create committee member" });
    }
  } catch (err) {
    res.status(500).send({
      message: "Failed to create committee member",
      error: err.message,
    });
  }
});

// PATCH update committee member
app.patch("/committee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid committee ID" });
    }

    const updates = req.body;

    // Validate email if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).send({
          message: "Invalid email format",
        });
      }
    }

    // Validate image URL if provided
    if (updates.image && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(updates.image)) {
      return res.status(400).send({
        message: "Invalid image URL",
      });
    }

    // Add updatedAt timestamp
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await committeeCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).send({ message: "Committee member not found" });
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to update committee member",
      error: err.message,
    });
  }
});

// DELETE committee member
app.delete("/committee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid committee ID" });
    }

    const result = await committeeCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Committee member not found" });
    }

    res.status(200).send({
      message: "Committee member deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete committee member",
      error: err.message,
    });
  }
});

// ================== Gallery ==================
// GET all gallery items
app.get("/gallery", async (req, res) => {
    try {
        const result = await galleryCollection.find({}).toArray();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch gallery data",
            error: err.message,
        });
    }
});

// GET single gallery item by ID
app.get("/gallery/:id", async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid gallery ID" });
        }

        const result = await galleryCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return res.status(404).send({ message: "Gallery item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch gallery item",
            error: err.message,
        });
    }
});

// POST new gallery item
app.post("/gallery", async (req, res) => {
    try {
        const { type, category, url, caption, date } = req.body;

        // Validation
        if (!type || !['photo', 'video'].includes(type)) {
            return res.status(400).send({
                message: "Invalid or missing type (must be 'photo' or 'video')",
            });
        }
        if (!category || !['ইভেন্ট', 'অনুষ্ঠান', 'জাতীয় দিবস', 'সেমিনার', 'সভা'].includes(category)) {
            return res.status(400).send({
                message: "Invalid or missing category (must be one of: ইভেন্ট, অনুষ্ঠান, জাতীয় দিবস, সেমিনার, সভা)",
            });
        }
        if (!url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)) {
            return res.status(400).send({
                message: "Invalid or missing URL",
            });
        }
        if (!caption || !date) {
            return res.status(400).send({
                message: "Caption and date are required",
            });
        }

        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).send({
                message: "Invalid date format",
            });
        }

        const newItem = {
            type,
            category,
            url,
            caption,
            date: parsedDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await galleryCollection.insertOne(newItem);

        if (result.insertedId) {
            const insertedItem = await galleryCollection.findOne({
                _id: result.insertedId,
            });
            res.status(201).send(insertedItem);
        } else {
            res.status(400).send({ message: "Failed to create gallery item" });
        }
    } catch (err) {
        res.status(500).send({
            message: "Failed to create gallery item",
            error: err.message,
        });
    }
});

// PATCH update gallery item
app.patch("/gallery/:id", async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid gallery ID" });
        }

        const updates = req.body;

        // Validate fields if provided
        if (updates.type && !['photo', 'video'].includes(updates.type)) {
            return res.status(400).send({
                message: "Invalid type (must be 'photo' or 'video')",
            });
        }
        if (updates.category && !['ইভেন্ট', 'অনুষ্ঠান', 'জাতীয় দিবস', 'সেমিনার', 'সভা'].includes(updates.category)) {
            return res.status(400).send({
                message: "Invalid category (must be one of: ইভেন্ট, অনুষ্ঠান, জাতীয় দিবস, সেমিনার, সভা)",
            });
        }
        if (updates.url && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(updates.url)) {
            return res.status(400).send({
                message: "Invalid URL",
            });
        }
        if (updates.date) {
            const parsedDate = new Date(updates.date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).send({
                    message: "Invalid date format",
                });
            }
            updates.date = parsedDate;
        }

        // Add updatedAt timestamp
        const updatedData = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await galleryCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedData },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).send({ message: "Gallery item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to update gallery item",
            error: err.message,
        });
    }
});

// DELETE gallery item
app.delete("/gallery/:id", async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid gallery ID" });
        }

        const result = await galleryCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Gallery item not found" });
        }

        res.status(200).send({
            message: "Gallery item deleted successfully",
            deletedId: id,
        });
    } catch (err) {
        res.status(500).send({
            message: "Failed to delete gallery item",
            error: err.message,
        });
    }
});

// ================== Contact ==================
// GET all contact items
app.get('/contact', async (req, res) => {
    try {
        const result = await contactCollection.find({}).toArray();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: 'Failed to fetch contact data',
            error: err.message,
        });
    }
});

// GET single contact item by ID
app.get('/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid contact ID' });
        }

        const result = await contactCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return res.status(404).send({ message: 'Contact item not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: 'Failed to fetch contact item',
            error: err.message,
        });
    }
});

// POST new contact item
app.post('/contact', async (req, res) => {
    try {
        const { type, title, name, email, phone, details } = req.body;

        // Validation
        if (!type || !['feedback', 'suggestion', 'inquiry'].includes(type)) {
            return res.status(400).send({
                message: "Invalid or missing type (must be 'feedback', 'suggestion', or 'inquiry')",
            });
        }
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).send({
                message: 'Invalid or missing title',
            });
        }
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).send({
                message: 'Invalid or missing name',
            });
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send({
                message: 'Invalid or missing email',
            });
        }
        // Phone is optional, but if provided, validate format
        if (phone && (typeof phone !== 'string' || !/^\+?[1-9]\d{1,14}$/.test(phone))) {
            return res.status(400).send({
                message: 'Invalid phone number format',
            });
        }
        if (!details || typeof details !== 'string' || details.trim() === '') {
            return res.status(400).send({
                message: 'Invalid or missing details',
            });
        }

        const newItem = {
            type,
            title: title.trim(),
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '', // Optional field
            details: details.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await contactCollection.insertOne(newItem);

        if (result.insertedId) {
            const insertedItem = await contactCollection.findOne({
                _id: result.insertedId,
            });
            res.status(201).send(insertedItem);
        } else {
            res.status(400).send({ message: 'Failed to create contact item' });
        }
    } catch (err) {
        res.status(500).send({
            message: 'Failed to create contact item',
            error: err.message,
        });
    }
});

// PATCH update contact item
app.patch('/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid contact ID' });
        }

        const updates = req.body;

        // Validate fields if provided
        if (updates.type && !['feedback', 'suggestion', 'inquiry'].includes(updates.type)) {
            return res.status(400).send({
                message: "Invalid type (must be 'feedback', 'suggestion', or 'inquiry')",
            });
        }
        if (updates.title && (typeof updates.title !== 'string' || updates.title.trim() === '')) {
            return res.status(400).send({
                message: 'Invalid title',
            });
        }
        if (updates.name && (typeof updates.name !== 'string' || updates.name.trim() === '')) {
            return res.status(400).send({
                message: 'Invalid name',
            });
        }
        if (updates.email && (typeof updates.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email))) {
            return res.status(400).send({
                message: 'Invalid email',
            });
        }
        if (updates.phone && (typeof updates.phone !== 'string' || !/^\+?[1-9]\d{1,14}$/.test(updates.phone))) {
            return res.status(400).send({
                message: 'Invalid phone number format',
            });
        }
        if (updates.details && (typeof updates.details !== 'string' || updates.details.trim() === '')) {
            return res.status(400).send({
                message: 'Invalid details',
            });
        }

        // Add updatedAt timestamp
        const updatedData = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await contactCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).send({ message: 'Contact item not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: 'Failed to update contact item',
            error: err.message,
        });
    }
});

// DELETE contact item
app.delete('/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid contact ID' });
        }

        const result = await contactCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Contact item not found' });
        }

        res.status(200).send({
            message: 'Contact item deleted successfully',
            deletedId: id,
        });
    } catch (err) {
        res.status(500).send({
            message: 'Failed to delete contact item',
            error: err.message,
        });
    }
});


// ================== Quick Contact ==================
// GET all quick contact items
app.get("/quick-contact", async (req, res) => {
    try {
        const result = await quickContactCollection.find({}).toArray();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch quick contact data",
            error: err.message,
        });
    }
});

// GET single quick contact item by ID
app.get("/quick-contact/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid quick contact ID" });
        }

        const result = await quickContactCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return res.status(404).send({ message: "Quick contact item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch quick contact item",
            error: err.message,
        });
    }
});

// POST new quick contact item
app.post("/quick-contact", async (req, res) => {
    try {
        const { type, value } = req.body;

        // Validation
        if (!type || !['email', 'location', 'phone'].includes(type)) {
            return res.status(400).send({
                message: "Invalid or missing type (must be 'email', 'location', or 'phone')",
            });
        }
        if (!value || typeof value !== 'string' || value.trim() === '') {
            return res.status(400).send({
                message: "Invalid or missing value",
            });
        }
        // Validate email format if type is 'email'
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return res.status(400).send({
                    message: "Invalid email format",
                });
            }
        }
        // Validate phone format if type is 'phone' (basic example)
        if (type === 'phone') {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(value)) {
                return res.status(400).send({
                    message: "Invalid phone number format",
                });
            }
        }

        const newItem = {
            type,
            value: value.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await quickContactCollection.insertOne(newItem);

        if (result.insertedId) {
            const insertedItem = await quickContactCollection.findOne({
                _id: result.insertedId,
            });
            res.status(201).send(insertedItem);
        } else {
            res.status(400).send({ message: "Failed to create quick contact item" });
        }
    } catch (err) {
        res.status(500).send({
            message: "Failed to create quick contact item",
            error: err.message,
        });
    }
});

// PATCH update quick contact item
app.patch("/quick-contact/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid quick contact ID" });
        }

        const updates = req.body;

        // Validate fields if provided
        if (updates.type && !['email', 'location', 'phone'].includes(updates.type)) {
            return res.status(400).send({
                message: "Invalid type (must be 'email', 'location', or 'phone')",
            });
        }
        if (updates.value && (typeof updates.value !== 'string' || updates.value.trim() === '')) {
            return res.status(400).send({
                message: "Invalid value",
            });
        }
        // Validate email format if updating to email
        if (updates.type === 'email' || (updates.value && updates.type === undefined)) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.value)) {
                return res.status(400).send({
                    message: "Invalid email format",
                });
            }
        }
        // Validate phone format if updating to phone
        if (updates.type === 'phone' || (updates.value && updates.type === undefined)) {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(updates.value)) {
                return res.status(400).send({
                    message: "Invalid phone number format",
                });
            }
        }

        // Add updatedAt timestamp
        const updatedData = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await quickContactCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedData },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).send({ message: "Quick contact item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to update quick contact item",
            error: err.message,
        });
    }
});

// DELETE quick contact item
app.delete("/quick-contact/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid quick contact ID" });
        }

        const result = await quickContactCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Quick contact item not found" });
        }

        res.status(200).send({
            message: "Quick contact item deleted successfully",
            deletedId: id,
        });
    } catch (err) {
        res.status(500).send({
            message: "Failed to delete quick contact item",
            error: err.message,
        });
    }
});



// ================== Office Hours ==================
// GET all office hours
app.get("/office-hours", async (req, res) => {
    try {
        const result = await officeHoursCollection.find({}).toArray();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch office hours data",
            error: err.message,
        });
    }
});

// GET single office hours item by ID
app.get("/office-hours/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid office hours ID" });
        }

        const result = await officeHoursCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return res.status(404).send({ message: "Office hours item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to fetch office hours item",
            error: err.message,
        });
    }
});

// POST new office hours item
app.post("/office-hours", async (req, res) => {
    try {
        const { day, hours } = req.body;

        // Validation
        const validDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
        if (!day || !validDays.includes(day)) {
            return res.status(400).send({
                message: "Invalid or missing day (must be one of: রবিবার, সোমবার, মঙ্গলবার, বুধবার, বৃহস্পতিবার, শুক্রবার, শনিবার)",
            });
        }
        if (!hours || typeof hours !== 'string' || hours.trim() === '') {
            return res.status(400).send({
                message: "Invalid or missing hours",
            });
        }

        // Optional: Check for duplicate day
        const existing = await officeHoursCollection.findOne({ day });
        if (existing) {
            return res.status(400).send({
                message: `Office hours for ${day} already exist. Use PATCH to update.`,
            });
        }

        const newItem = {
            day,
            hours: hours.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await officeHoursCollection.insertOne(newItem);

        if (result.insertedId) {
            const insertedItem = await officeHoursCollection.findOne({
                _id: result.insertedId,
            });
            res.status(201).send(insertedItem);
        } else {
            res.status(400).send({ message: "Failed to create office hours item" });
        }
    } catch (err) {
        res.status(500).send({
            message: "Failed to create office hours item",
            error: err.message,
        });
    }
});

// PATCH update office hours item
app.patch("/office-hours/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid office hours ID" });
        }

        const updates = req.body;

        // Validate fields if provided
        const validDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
        if (updates.day && !validDays.includes(updates.day)) {
            return res.status(400).send({
                message: "Invalid day (must be one of: রবিবার, সোমবার, মঙ্গলবার, বুধবার, বৃহস্পতিবার, শুক্রবার, শনিবার)",
            });
        }
        if (updates.hours && (typeof updates.hours !== 'string' || updates.hours.trim() === '')) {
            return res.status(400).send({
                message: "Invalid hours",
            });
        }

        // Optional: Check for duplicate day if updating day
        if (updates.day) {
            const existing = await officeHoursCollection.findOne({ day: updates.day, _id: { $ne: new ObjectId(id) } });
            if (existing) {
                return res.status(400).send({
                    message: `Office hours for ${updates.day} already exist.`,
                });
            }
        }

        // Add updatedAt timestamp
        const updatedData = {
            ...updates,
            updatedAt: new Date(),
        };

        const result = await officeHoursCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedData },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).send({ message: "Office hours item not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            message: "Failed to update office hours item",
            error: err.message,
        });
    }
});

// DELETE office hours item
app.delete("/office-hours/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid office hours ID" });
        }

        const result = await officeHoursCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Office hours item not found" });
        }

        res.status(200).send({
            message: "Office hours item deleted successfully",
            deletedId: id,
        });
    } catch (err) {
        res.status(500).send({
            message: "Failed to delete office hours item",
            error: err.message,
        });
    }
});




// ================== Root ==================
app.get("/", (req, res) => {
  res.send("Press Club Website Server running ✅");
});

app.listen(port, () => {
  console.log(`Press Club server running on port ${port}`);
});
