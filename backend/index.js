const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

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
  try {
    const pins = await Pin.find();
    res.json(pins);
  } catch (error) {
    console.error("❌ Error fetching pins:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/pins", async (req, res) => {
  try {
    const pin = new Pin(req.body);
    await pin.save();
    res.json(pin);
  } catch (error) {
    console.error("❌ Error saving pin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

cron.schedule('*/10 * * * *', async () => {
  try {
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    const expiryDate = new Date(Date.now() - THREE_HOURS);
    const result = await Pin.deleteMany({ createdAt: { $lt: expiryDate } });

    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} expired pins`);
    }
  } catch (error) {
    console.error("❌ Error deleting expired pins:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
