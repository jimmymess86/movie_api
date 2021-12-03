const express = require("express");
const morgan = require ("morgan");
const app = express();

let myMovies = [
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
];

app.use(morgan("common")); //use morgan to log errors/data to terminal
app.use(express.static("public")); //use static to serve documentation.html

// GET requests

app.get("/", (req, res) => {
    res.send("My Movie Data!");
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
