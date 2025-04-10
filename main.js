//Import the packags to be used
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";
import cors from "cors";

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

//Allow Express to use CORS
app.use(cors());

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
  const apiURL = "https://www.alphavantage.co/query?function=" + userTimeFrame + "&symbol=" + userCoin + "&market=USD&apikey=" + apiKey;

  // Make API call using Axios
  try {
    const response = await axios.get(apiURL);

    // Get Only the time series data:
    const timeSeriesData = response.data["Time Series (Digital Currency Daily)"];

    // Convert the data to usable format
    let formattedData = Object.keys(timeSeriesData).map(date =>({
      ds: date, //Get the Timestamp || Date Stamp
      y: parseFloat(timeSeriesData[date]["4. close"]) // Getting the closing price for each datapoint
    })).reverse() // Having the data in chronological order

    // Send the formatted data to the Python API for predictions
    // TODO: Send Data to Python Server for Predictions
    //const pythonRespnse = await axios.post("http://127.0.0.1:5001/predict", {data: formattedData})

    //Get the forecasts from the Python Server
    // TODO: Take forecast data from Python server to render on Chart
    //const forecastData = pythonRespnse.data;

    //Render the Predictions on a dashboard
    //TODO: Send over forecastData to be rendered as well
    res.render("dashboard", {actualData: formattedData});

  } catch (error) {
      console.log(error)
  }
  

});



  // Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});