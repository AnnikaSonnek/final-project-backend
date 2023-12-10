// //////////////////////////////////////////////////////////////////////// //
// /////////////////////////////// IMPORT ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
/* import crypto from "crypto";
import bcrypt from "bcrypt"; */
// import dotenv from 'dotenv';

// //////////////////////////////////////////////////////////////////////// //
// //////////////////// CONNECTION TO DISPLAY ///////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

// 127.0.0.1:27017 - Annika us this instead of localhost in the URL

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/truecrime";
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

// /////////// MOVIE SCHEMA /////////// //

const MovieSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  swedishTitle: {
    type: String, 
  },
  released: {
    type: Date,
  },
  synopsis: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  cast: {
    type: Array, 
  },
  rating: {
    type: Number,
    required: true,
  }, 
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const Movie = mongoose.model("Movie", MovieSchema);

// /////////// DOCUMENTARY SCHEMA /////////// //
const DocumentarySchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  swedishTitle: {
    type: String, 
  },
  released: {
    type: Date,
  },
  synopsis: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  }, 
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const Documentary = mongoose.model("Documentary", DocumentarySchema);

// /////////// DRAMASERIES SCHEMA /////////// //
const DramaSeriesSchema= new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  swedishTitle: {
    type: String, 
  },
  released: {
    type: Date,
  },
  synopsis: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  cast: {
    type: Array, 
  },
  seasons: {
    type: Number, 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  }, 
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const DramaSeries = mongoose.model("DramaSeries", DramaSeriesSchema);

// /////////// DOCUMENTARY SERIES SCHEMA /////////// //
const DocumentarySeriesSchema= new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  swedishTitle: {
    type: String, 
  },
  released: {
    type: Date,
  },
  synopsis: {
    type: String,
    required: true,
  },
  seasons: {
    type: Number, 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
  },
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const DocumentarySeries = mongoose.model("DocumentarySeries", DocumentarySeriesSchema);

// /////////// PODCAST SCHEMA /////////// //
const PodcastSchema= new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  hosts: {
    type: Array,
    required: true,
  },
  firstAired: {
    type: Date,
  },
  synopsis: {
    type: String,
    required: true,
  },
  producedBy: {
    type: String,
  },
  website: {
    type: String, 
    required: true,
  },
  rating: {
    type: Number,
  }, 
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const Podcast = mongoose.model("Podcast", PodcastSchema);

// /////////// BOOK SCHEMA /////////// //
const BookSchema= new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  swedishTitle: {
    type: String, 
  },
  author: {
    type: String, 
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  released: {
    type: Date,
  },
  ISBN: {
    type: Number, 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  }, 
  tags: {
    type: Array,
    required: true,
  }, 
  image: {
    type: String,
  }
})

const Book = mongoose.model("Book", BookSchema);

Movie.deleteMany().then(() => {
  new Movie({
    title: "hej hej", 
    released: new Date(2000,1,1), 
    synopsis: "en berättelse om mod", 
    rating: 5, 
    tags: ["murder", "comedy", "coldcase"], 
    image: "movie.png"
  }).save();
})

Book.deleteMany().then(() => {
  new Book({
    title: "Murder",
    relesed: new Date(2000,1,3),
    rating: 5, 
    author: "Bla bla",
    synopsis: "Det var en gång...", 
    tags: ["comedy", "murder", "coldcase"], 
    ISBN: 12345678910
  }).save();
})

Documentary.deleteMany().then(() => {
  new Documentary({
    title: "En dokumentär",
    synopsis: "Fyre festival the greatest party that never happened.",
    rating: 5, 
    tags: ["comedy", "white collar crime", "coldcase"],
  }).save();
})

DramaSeries.deleteMany().then(() => {
  new DramaSeries({
    title: "A tv-series",
    swedishTitle: "En dramaserie",
    synopsis: "En dramaserie i världsklass.", 
    seasons: 2, 
    rating: 2, 
    tags: ["swedish", "crime", "comedy"]
  }).save()
})


DocumentarySeries.deleteMany().then(() => {
  new DocumentarySeries({
    title: "True Crime Criminals",
    released: new Date(2011, 9, 1),
    synopsis: "En dokumentärserie i världsklass.", 
    seasons: 3, 
    rating: 3, 
    tags: ["cold case", "murder"], 
  }).save()
})

Podcast.deleteMany().then(() => {
  new Podcast({
    title: "My favorite Murder", 
    hosts: ["Karen Kilgariff", "Georgia Hardstark"],
    synopsis: "My favorite murder is the best podcast.", 
    website: "www.karen.com",
    producedBy: "Exactly Right",
    tags: ["comedy", "life", "discussion"]
  }).save()
})

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
    {"/movies": "GET. See movies"},
    {"/documentaries": "GET. See documentaries"},
    {"/drama-series": "GET. See dramaseries"},
    {"/documentary-series": "GET. See documentary series"},
    {"/podcasts": "GET. See podcasts."},
    {"/books": "GET. See books."}
    ]
  });
});

// ================= GET MOVIES =============== //

app.get("/movies", async (req, res) => {
  try {
    Movie.find().then((movie) => {
      res.status(200).json({
        success: true, 
        response: movie,
        message: "Successfully found Movies list"
      });
    })
} catch(error) {
  res.status(400).json({
    success: false,
    response: error,
    message: "Did not find To-do list"
   });
}
});

// ================= GET DOCUMETARIES =============== //

app.get("/documentaries", async (req, res) => {
  try {
    Documentary.find().then((documentary) => {
      res.status(200).json({
        success: true, 
        response: documentary,
        message: "Successfully found documentary list"
      });
    })
} catch(error) {
  res.status(400).json({
    success: false,
    response: error,
    message: "Did not find documentary list"
   });
}
});

// ================= GET DOCUMETARIES =============== //

app.get("/drama-series", async (req, res) => {
  try {
    DramaSeries.find().then((dramaseries) => {
      res.status(200).json({
        success: true, 
        response: dramaseries,
        message: "Successfully found dramaseries list"
      });
    })
} catch(error) {
  res.status(400).json({
    success: false,
    response: error,
    message: "Did not find dramaseries list"
   });
}
});


/* // ================= POST TO-DOs =============== //

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
}); */

// ================= GET MOVIE =============== //
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the todo id from the request parameters
  try {
    const singleMovie = await Movie.findById(id, );

    if (singleMovie) {
      res.status(200).json({
        success: true,
        response: singleMovie,
        message: "Single movie found!"
      });
    } else {
      res.status(404).json({
        success: false,
        response: "Single movie not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Failed to find the single movie"
    });
  }
});
/* 
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
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
