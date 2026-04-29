const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT DB
mongoose.connect("YOUR_MONGODB_URL")
.then(() => console.log("DB Connected"));

// USER MODEL
const User = mongoose.model("User", {
  email: String,
  password: String
});

// BARCODE MODEL
const Barcode = mongoose.model("Barcode", {
  userId: String,
  code: String,
  createdAt: { type: Date, default: Date.now }
});

// REGISTER
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User created" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.status(401).send("Invalid");

  res.json({ userId: user._id });
});

// SAVE BARCODE
app.post("/save-barcode", async (req, res) => {
  const barcode = new Barcode(req.body);
  await barcode.save();
  res.json({ message: "Saved" });
});

// GET USER BARCODES
app.get("/barcodes/:userId", async (req, res) => {
  const data = await Barcode.find({ userId: req.params.userId });
  res.json(data);
});

app.listen(3000, () => console.log("Server running"));
