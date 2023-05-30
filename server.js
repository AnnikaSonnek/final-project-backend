// //////////////////////////////////////////////////////////////////////// //
// /////////////////////////////// IMPORT ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

// //////////////////////////////////////////////////////////////////////// //
// //////////////////// CONNECTION TO DISPLAY ///////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-final";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// //////////////////////////////////////////////////////////////////////// //
// //////////////////////////// SCHEMAS /////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

// /////////// TODO SCHEMA /////////// //

const TodoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140,
    trim: true
  },
  deadline: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  category: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Todo = mongoose.model("Todo", TodoSchema);

// /////////// USER SCHEMA /////////// //

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  mail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  },
  avatar: {
    type: String,
    /* default: 'default-avatar.jpg' // You can set a default avatar image if desired */
  }
});

const User = mongoose.model("User", UserSchema);

// /////////////////////////////////////////////////////////////////////// //
// //////////////////////////// AUTHENTICATE USER //////////////////////// //
// /////////////////////////////////////////////////////////////////////// //

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization")
  try{
    const user = await User.findOne({accessToken: accessToken})
    if (user) {
      next()
    } else {
      res.status(401).json({
        success: false, 
        response: "Please login"
      })
    }
  } catch(error){
    res.status(500).json({
      success: false,
      response: error
    })
  }
};

// //////////////////////////////////////////////////////////////////////// //
// /////////////////////////////// ROUTES ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

// POST registration
// POST login
// GET todos
// POST todo
// PATCH todo
// DELETE todo

// ////////// API DOCUMENTATION ///////// //

app.get("/", (req, res) => {
  res.send({
    "Hello frontend developer": "Here's a documentation of the endpoints",
    "Endpoints": [
    {"/": "Api Info"},
    {"/thoughts": "GET. See 20 thoughts in descending order"}
    ]
  });
});

// //////////// REGISTER //////////////// //

app.post("/register", async (req, res) => {
  const {username, mail, password } = req.body
  try {
    const salt = bcrypt.genSaltSync() //create random salt
    const newUser = await new User({
      username: username,
      mail: mail,
      password: bcrypt.hashSync(password, salt) // hashes the password and the random salt
    }).save()
  res.status(201).json({
    success: true, 
    response: {
      username: newUser.username,
      id: newUser._id,
      accessToken: newUser.accessToken 
    }
  })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        response: "Username already exists! Try another one!"
      })
    } else {
    res.status(400).json({
      success: false,
      response: error
    })
    }
  }
})

// //////////// GET TO-DO´s ///////// //

app.get("/todos", authenticateUser)
app.get("/todos", async (req, res) => {
  try {
    const displayedTodos = await Todo.find().sort({createdAt: 'desc'}) // Exec()?
    res.status(200).json({
      success: true, 
      response: displayedTodos,
      message: "Successfully found To-do list"
    });
} catch(error) {
  res.status(400).json({
    success: false,
    response: error,
    message: "Did not find To-do list"
   });
}
});

// /////////////////////////////////////////////////////////////////////// //
// //////////////////////////// START SERVER ///////////////////////////// //
// /////////////////////////////////////////////////////////////////////// //

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
