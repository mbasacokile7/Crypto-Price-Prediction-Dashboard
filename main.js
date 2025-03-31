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

// Configure the use of environment variables
env.config();

// Store the port number in an Environment Variable
const port = process.env.PORT;

// Store my AlphaVantage API-Key in an environment variable
const apiKey = process.env.API_KEY

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
});

//Post request to get the cryptoprice data we need
app.post("/fetch-data", async (req, res) =>{

  // Get the cryptocurrency the user wnats
  const userCoin = req.body.crypto;

  //get the timeframe that the user wants
  let userTimeFrame = "";

  // Need an if statement to get the proper API Function
  if (req.body.timeframe === "Daily"){
    userTimeFrame = "DIGITAL_CURRENCY_DAILY";
  } else if (req.body.timeframe === "Weekly"){
    userTimeFrame = "DIGITAL_CURRENCY_WEEKLY";
  } else {
    userTimeFrame = "DIGITAL_CURRENCY_MONTHLY";
  }

  // API URL
  const apiURL = "https://www.alphavantage.co/query?function=" + userTimeFrame + "&symbol=" + userCoin + "&market=EUR&apikey=" + apiKey;

  // Make API call using Axios
  try {
    const response = await axios.get(apiURL);
    console.log(response.data["Meta Data"]);
  } catch (error) {
      console.log(error)
  }
  

});



  // Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});