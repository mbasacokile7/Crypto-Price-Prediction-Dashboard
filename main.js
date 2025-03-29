//Import the packags to be used
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

//When dealing with files, we use native node packages
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;
// Set the view engine
app.set('view engine', 'ejs');

//Allow express to access the public folder for static files
app.use(express.static("public"));

// Use the body Parser middleware to get the user data 
app.use(bodyParser.urlencoded({extended:true}));





// --- HTTP Requests --- //
// This will render the landing page;
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });


// Create a route to go to the selection page
app.get("/select", (req, res) =>{
  res.render("selection");
})



  // Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});