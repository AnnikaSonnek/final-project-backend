// //////////////////////////////////////////////////////////////////////// //
// /////////////////////////////// IMPORT ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
// import dotenv from 'dotenv';

// //////////////////////////////////////////////////////////////////////// //
// //////////////////// CONNECTION TO DISPLAY ///////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

// 127.0.0.1:27017 - Annika us this instead of localhost in the URL

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-final";
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
    default: Date.now
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
    default: 'default-avatar.jpeg' // You can set a default avatar image if desired */
  }, 
  checkedTasks: {
    type: Number,
    default: 0
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

// ================= API DOCUMENTATION =============== //

app.get("/", (req, res) => {
  res.send({
    "Hello frontend developer": "Here's a documentation of the endpoints",
    "Endpoints": [
    {"/": "Api Info"},
    {"/register": "POST. Post Mail, Username, Password"},
    {"/login": "POST. Post Mail, Password"},
    {"/todos": "GET. See to-dos in descending order"},
    {"/todos": "POST. Post one new to-do"},
    {"/todos/:id": "GET. GET one to-do"},
    {"/todos/:id": "PATCH. Edit one to-do"},
    {"/todos/:id": "DELETE. Delete one to-do"},
    {"/todos/:id/completed": "PATCH. Update completed status of one todo"}
    ]
  });
});

// ================= REGISTER =============== //

app.post("/register", async (req, res) => {
  const {username, mail, password } = req.body
  try {
    const salt = bcrypt.genSaltSync() //create random salt
    const newUser = await new User({
      username: username,
      mail: mail, // will not be used in frontend store
      password: bcrypt.hashSync(password, salt) // hashes the password and the random salt
    }).save()
  res.status(201).json({
    success: true, 
    response: {
      username: newUser.username,
      id: newUser._id,
      mail: newUser.mail,
      accessToken: newUser.accessToken, 
      avatar: newUser.avatar
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

// ================= LOGIN =============== //

app.post("/login", async (req, res) => {
  const { mail, password } = req.body; // Extract the mail and password from the request body

  try {
    const user = await User.findOne({ mail: mail }); // Find a user with the provided mail in the database

    if (user && bcrypt.compareSync(password, user.password)) {
      // Check if the user exists and the provided password matches the hashed password in the database
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          mail: user.mail, //will not be used in the frontend
          accessToken: user.accessToken,
          avatar: user.avatar
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials do not match or the account does not exist"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
});



// ================= COMPLETED TASKS USER =============== //
app.patch("/users/:id/checkedtasks", authenticateUser)
app.patch("/users/:id/checkedtasks", async (req, res) => {
  const { id } = req.params;
  const increment = parseInt(req.body.increment);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: { checkedTasks: increment } },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json({
        success: true,
        response: updatedUser,
        message: "Changed amount of checked tasks",
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Failed to change checked tasks total.",
      });
    }
  } catch (error) {
    console.log(error); // Log the error to the console
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to update checked tasks, bad request",
    });
  }
});



/*app.patch("/todos/:id", authenticateUser);
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the todo id from the request parameters
  const { description, category, deadline, priority } = req.body; // Extract the updated fields from the request body
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { description, category, deadline, priority }, { new: true }
    );

    if (updatedTodo) {
      res.status(200).json({
        success: true,
        response: updatedTodo,
        message: "Todo updated successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Todo not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to update the todo"
    });
  }
});
*/

// ================= GET TO-DOs =============== //

app.get("/todos", authenticateUser)
app.get("/todos", async (req, res) => {
    const accessToken = req.header("Authorization"); // Extract the access token from the request header
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  try {
    const displayedTodos = await Todo.find({ user: user._id }).sort({createdAt: 'desc'}) // Exec()?
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

// ================= POST TO-DOs =============== //

app.post("/todos", authenticateUser);
app.post("/todos", async (req, res) => {
  const { description, category, deadline, priority } = req.body; // Extract the message from the request body
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  try {
    const newTodo = await new Todo({
      description: description,
      deadline: deadline,
      category: category,
      priority: priority,
      user: user._id // Set the user field to the user's _id
    }).save();

    res.status(200).json({ 
      success: true, 
      response: newTodo 
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to create a new todo"
    });
  }
});

// ================= GET TO-DO =============== //
app.get("/todos/:id", authenticateUser);
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the todo id from the request parameters
  try {
    const singleTodo = await Todo.findById(id, );

    if (singleTodo) {
      res.status(200).json({
        success: true,
        response: singleTodo,
        message: "Single todo found!"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Single todo not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to find the single todo"
    });
  }
});

// ================= PATCH TO-DO =============== //

app.patch("/todos/:id", authenticateUser);
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the todo id from the request parameters
  const { description, category, deadline, priority } = req.body; // Extract the updated fields from the request body
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { description, category, deadline, priority }, { new: true }
    );

    if (updatedTodo) {
      res.status(200).json({
        success: true,
        response: updatedTodo,
        message: "Todo updated successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Todo not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to update the todo"
    });
  }
});

// ================= TOGGLE TO-DO =============== //

app.patch("/todos/:id/completed", authenticateUser);
app.patch("/todos/:id/completed", async (req, res) => {
  const { id } = req.params; // Extract the todo id from the request parameters
  const { completed } = req.body; // Extract the updated fields from the request body
  try {
    const statusChangedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true }
    );

    if (statusChangedTodo) {
      res.status(200).json({
        success: true,
        response: statusChangedTodo,
        message: "Todo updated successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Todo not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to update the todo"
    });
  }
});

// ================= DELETED TO-DO =============== //

app.delete("/todos/:id", authenticateUser);
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (deletedTodo) {
      res.status(200).json({
        success: true,
        response: deletedTodo,
        message: "Todo deleted successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Todo not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to delete the todo"
    });
  }
});

// /////////////////////////////////////////////////////////////////////// //
// //////////////////////////// START SERVER ///////////////////////////// //
// /////////////////////////////////////////////////////////////////////// //

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
