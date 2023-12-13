const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const url = "mongodb+srv://threat:threat@cluster0.5jbq9u3.mongodb.net/employee";
// Connect to MongoDB
mongoose.connect("mongodb+srv://threat:threat@cluster0.5jbq9u3.mongodb.net/employee") ;

app.use(express.static(path.join(__dirname, 'public')));
// Define a Schema for MongoDB
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes

// Create item
app.post('/items', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single item by ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Update item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Delete item by ID
app.delete('/items/:id', async (req, res) => {
    try {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
  
      const db = client.db("Student");
      const collection = db.collection('items');
  
      const itemId = req.params.id;
  
      // Convert the received string ID to an ObjectId
      const objectId = new ObjectId(itemId);
  
      // Find and delete the item by ID
      await collection.deleteOne({ _id: objectId });
  
      client.close();
  
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Error deleting item' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
