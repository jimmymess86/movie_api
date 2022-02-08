const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://jimmymac:Frankie1!@cluster0.us5ha.mongodb.net/test', { userNewUrlParser: true, useUnifiedTopology: true});

/* let myMovies = [
{
title: "Ghostbusters",
director: "Ivan Reitman"
},
{
title: "Young Frankenstein",
director: "Mel Brooks"
},
{
title: "Star Wars",
director: "George Lucas"
},
{
title: "Star Trek IV: The Voyage Home",
director: "Leonard Nimoy"
},
{
title: "Jaws",
director: "Steven Spielberg"
},
{
title: "Avengers: Endgame",
director: "The Russo Brothers"
},
{
title: "The Godfather",
director: "Francis Ford Coppola"
},
{
title: "The Godfather, Part II",
director: "Francis Ford Coppola"
},
{
title: "The Shawkshank Redemption",
direcotr: "Frank Darabont"
},
{
title: "Ace Ventura: When Nature Calls",
director: "Steve Odekerk"
}
]; */

app.use(morgan("common")); //use morgan to log errors/data to terminal
app.use(express.static("public")); //use static to serve documentation.html

// GET requests

app.get("/", (req, res) => {
  res.send("My Movie Data!");
});

// Returns a JSON object with list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// find a movie based on title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

// Get a genre description
app.get('/genre/:Name', (req,res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
  .then((movie) =>{
    res.json({genre: movie.Genre.Description});
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET description about director
app.get('/director/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name})
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Add a user
/* We’ll expect JSON in this format
{
ID: Integer,
Username: String,
Password: String,
Email: String,
Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Update a user's info, by username
/* We’ll expect JSON in this format
{
Username: String,
(required)
Password: String,
(required)
Email: String,
(required)
Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(myMovies);
});

//error handling middleware
app.use((err, req, res, next) => {
  console.lerror(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
