const express = require('express');
const morgan = require ('morgan');
const uuid = require('uuid');

const app = express();

let movies = [
    {
        title: "Ghostbusters",
        released: "1984",
        genre: ["action", "sci-fi"],
        director: {
            name: "Ivan Reitman",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Young Frankenstein",
        released: "1974",
        genre: "comedy",
        director: {
            name: "Mel Brooks",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Star Wars",
        released: "1977",
        genre: "sci-fi",
        director: {
            name: "George Lucas",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Star Trek IV: The Voyage Home",
        released: "1986",
        genre: "sci-fi",
        director: {
            name: "Leonard Nimoy",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Jaws",
        released: "1975",
        genre: "action",
        director: {
            name: "Steven Spielberg",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Avengers: Endgame",
        released: "2019",
        genre: ["action", "sci-fi"],
        director: {
            name: "The Russo Brothers",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
    }
    },
    {
        title: "The Godfather",
        released: "1972",
        genre: "drama",
        director: {
            name: "Francis Ford Copolla",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "The Godfather, Part II",
        released: "1974",
        genre: "drama",
        director: {
            name: "Francis Ford Copolla",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "The Shawkshank Redemption",
        releaed: "1994",
        genre: "drama",
        director: {
            name: "Frank Darabont",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    },
    {
        title: "Ace Ventura: When Nature Calls",
        released: "1997",
        genre: "comedy",
        director: {
            name: "Steve Odekirk",
            biography: "Placeholder information",
            birthdate: "Placeholder date"
        }
    }
];

app.use(morgan('common')); //use morgan to log errors/data to terminal
app.use(express.static('public')); //use static to serve documentation.html
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Welcome to myFlix page');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies)
   });

   app.get('/movies/:title', (req, res) => {
       let movie = movies.find((movie) => {
           return movie.title === req.params.title;
       });
       if(movie) {
           res.status(200).json(movie)
       } else {
           res.status(400).send('No movie with that title is found')
       }
   });

   app.get('/movies/genre/:genre', (req, res) => {
       let movieList = []
       movies.find((movie) => {
           if(movie.genre === req.params.genre) {
               movieList.push(movie)
           }
       });

       res.json(movieList)
   });

   app.get('/movies/director/:directorName', (req, res) => {
       let director = movies.find((movie) => {
           return movie.director.name === req.params.directorName;
       });
       if(director) {
           res.status(200).json(director)
       } else {
           res.status(400).send('No director with that name is found')
       }
   });

   app.post('/users', (req, res) => {
       let user = req.body

       if(user.username) {
           res.status(200).json(user)
       } else {
           res.status(400).send('Valid user info was not passed in')
       }
   });

   app.put('/users/:username', (req, res) => {
       let username = req.params.username
       res.status(200).send(`Username has been changed to ${username}`)
   });


   let favorites = []
   app.post('/users/add/:movieName', (req, res) => {
       let addMovie = movies.find((movie) => {
           return movie.title === req.params.movieName;
       });

       if(addMovie) {
           favorites.push(req.params.movieName)
           res.status(200).send(`${req.params.movieName} has been added to your favorites`);
       } else {
           res.status(400).send('Cannot find movie with that name');
       }
   });

   app.delete('/users/remove/:movieName', (req, res) => {
       favorites = favorites.filter((name) => { return name !== req.params.movieName });
       res.status(200).send(`${req.params.movieName} has been removed from your favorites`);
   });

   app.delete('/users/deleteAccount/:id', (req, res) => {
       res.status(200).send('Your account has been deleted');
   })

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
