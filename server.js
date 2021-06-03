// require express, cors, mongoose, dotenv.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

// Create app, port variables. 
const app = express();
const port = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMS: 15 * 60 * 1000,
  max: 30
});

app.set("trust proxy", 1);

app.use(limiter);

// Origin is the url from netlify
let corsOptions = {
  origin: "https://peaceful-poincare-5cb351.netlify.app/",
  optionsSuccessStatus: 200
};

// App .use cors so we can run server on localhost, passing the restrictions. 
app.use(cors());

// And express.json(), to return info in JSON.
app.use(express.json());




// URI FOR MongoDB
const uri = process.env.ATLAS_URI;
// Connecting to mongoose, uri
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// Creating a connection instance variable.
const connection = mongoose.connection;
// Once the connection is "open" => log -||-
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});




// Routes for the server to use;
// The server URL is https://localhost:5000. 
// Now if you add “/exercises” or “/users” on the end it will load the endpoints defined in the corresponding router files.
const exercisesRouter = require("./routes/exercises.route");
// const usersRouter = require("./routes/users.route");
app.use("/exercises", limiter, exercisesRouter);
// app.use("/users", usersRouter);


// Makes the local server run.
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

