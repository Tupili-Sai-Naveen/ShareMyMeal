const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Mongoose schema
const PinSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  description: String,
  name: String,
  phone: String,
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


const Pin = mongoose.model("Pin", PinSchema);

app.get('/', (req, res) => {
  res.send('✅ ShareMyMeal API is running!');
});

app.get("/pins", async (req, res) => {
  const pins = await Pin.find();
  res.json(pins);
});

app.post("/pins", async (req, res) => {
  const pin = new Pin(req.body);
  await pin.save();
  res.json(pin);
});


cron.schedule('*/10 * * * *', async () => {
  const THREE_HOURS = 3 * 60 * 60 * 1000;
  const expiryDate = new Date(Date.now() - THREE_HOURS);

  const result = await Pin.deleteMany({ createdAt: { $lt: expiryDate } });
  if (result.deletedCount > 0) {
    console.log(🧹 Deleted ${result.deletedCount} expired pins);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
