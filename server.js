
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

console.log("SERVER STARTED");

// ==========================
// USER SCHEMA
// ==========================
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// ==========================
// EXPENSE SCHEMA
// ==========================
const expenseSchema = new mongoose.Schema({

  title: String,

  amount: Number,

  addedBy: String,

  date: {
    type: Date,
    default: Date.now
  }

});

const Expense = mongoose.model('Expense', expenseSchema);

// ==========================
// TEST ROUTE
// ==========================
app.get('/', (req, res) => {
  res.send("Expense Tracker Backend Working!");
});

// ==========================
// SIGNUP
// ==========================
app.post('/signup', async (req, res) => {

  const { username, password } = req.body;

  try {

    const existingUser = await User.findOne({ username });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const newUser = new User({
      username,
      password
    });

    await newUser.save();

    res.json({
      message: "Signup successful!"
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// ==========================
// LOGIN
// ==========================
app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });

    if (!user) {

      return res.status(401).json({
        message: "User not found"
      });

    }

    if (user.password === password) {

      return res.json({
        message: "Login successful!"
      });

    }

    else {

      return res.status(401).json({
        message: "Wrong password"
      });

    }

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// ==========================
// ADD EXPENSE
// ==========================
app.post('/add-expense', async (req, res) => {

  try {

    const expense = new Expense({
      title: req.body.title,
      amount: req.body.amount,
      addedBy: req.body.addedBy
    });

    await expense.save();

    res.json({
      message: "Expense Added Successfully"
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error adding expense"
    });

  }

});

// ==========================
// GET ALL EXPENSES
// ==========================
app.get('/expenses', async (req, res) => {

  try {

    const expenses = await Expense.find().sort({ date: -1 });

    res.json(expenses);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching expenses"
    });

  }

});

// ==========================
// MONGODB CONNECTION
// ==========================
mongoose.connect('mongodb://admin:Bakery12345@ac-r5kgsjk-shard-00-00.fow3xuv.mongodb.net:27017,ac-r5kgsjk-shard-00-01.fow3xuv.mongodb.net:27017,ac-r5kgsjk-shard-00-02.fow3xuv.mongodb.net:27017/expenseDB?ssl=true&replicaSet=atlas-yep0ju-shard-0&authSource=admin&retryWrites=true&w=majority')

.then(() => {

  console.log("MongoDB Connected");

  app.listen(3000, () => {

    console.log("Server running on port 3000");

  });

})

.catch(err => {

  console.log("Mongo Error:", err);

});