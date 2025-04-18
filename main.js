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
const apiKey = process.env.API_KEY;

//Deep Seek API KEy
const deepseekAPI_Key = process.env.DeepSeek_API_KEY;

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
  const selectedTimeFrame = req.body.timeframe;
  //get the timeframe that the user wants
  let userTimeFrame = "";
  

  // Need an if statement to get the proper API Function
  if (selectedTimeFrame === "Daily"){
    userTimeFrame = "DIGITAL_CURRENCY_DAILY";
  } else if (selectedTimeFrame === "Weekly"){
    userTimeFrame = "DIGITAL_CURRENCY_WEEKLY";
  } else {
    userTimeFrame = "DIGITAL_CURRENCY_MONTHLY";
  }
  
  // API URL
  const apiURL = "https://www.alphavantage.co/query?function=" + userTimeFrame + "&symbol=" + userCoin + "&market=USD&apikey=" + apiKey;

  // ==== AXIOS POST REQUESTS ==== ///

  // Get CryptoData from AlphaVantage
  function getCryptoData(){
    return axios.get(apiURL);

  }
  // Send Data to model for predictions
  function sendCryptoData(){
    
    
  }
  // Get DeepSeek Crypto Insights using OpenRouter API
  function getInsights(){
    const headers = {
      "Authorization": `Bearer ${deepseekAPI_Key}`,
      "Content-Type": "application/json",
    };


    // Get Insights from DeepSeek-v3
    const deepSeekURL = 'https://openrouter.ai/api/v1/chat/completions';
    let prompt  = `You are a financial analyst assistant helping crypto traders and investors.

                   Given the following parameters:

                                                  - Coin: ${userCoin}
                                                  - Timeframe:${selectedTimeFrame} from 2024 to 2025

                  Based on this, generate an HTML-formatted report with:

                                              1. A brief and concise summary overview of the coin’s performance and market sentiment during the timeframe.
                                              2. Key Trends : List 3–5 bullet points outlining price movements, volume spikes, volatility shifts, or general momentum.
                                              3. Key Influences: List relevant events, news, economic indicators, or social trends that impacted the coin’s behavior.
                                              4. A closing summary with strategic insights that might help traders, investors, or analysts make informed decisions.

                  ⚠️ The output should be fully formatted in HTML using:

                                              - <h2>for section headings and <h3> for sub headings
                                              - <ul><li> for bullet points
                                              - <p> for body text
                                              - Use <strong> for key points where relevant
                                              - The response should only be the content, Do Not Include the header meta-data
                                              
                  Your response should not be too technical, so that everyone can understand it.
                  Avoid including actual price predictions. Focus on analytical insights and trends only.`;

                  
    let insight_data = {
      "model": "deepseek/deepseek-chat-v3-0324:free",
      "messages": [{"role": "user", "content": prompt }]
    
    }

    return axios.post(deepSeekURL, insight_data, {
      headers: headers
    });
    
  }

  // Store the API responses in global variables
  let alphaVatageResponse
  let deepSeekResponse

  // Use Promises.all() to make the requests at the same time
  try {
    [alphaVatageResponse, deepSeekResponse] = await Promise.all([getCryptoData(), getInsights()]);
    
  } catch (error) {
    console.log(error)
    res.render("error");
  }

  // =========================== Payload Preprocessing =========================== //
  // ========Crypto Data ========//
  // Get Only the time series data:
  let dataIndex = `Time Series (Digital Currency ${req.body.timeframe})`
  const timeSeriesData = alphaVatageResponse.data[dataIndex];

  // Convert the data to usable format
  let formattedData = Object.keys(timeSeriesData).map(date =>({
    ds: date, //Get the Timestamp || Date Stamp
    y: parseFloat(timeSeriesData[date]["4. close"]) // Getting the closing price for each datapoint
  })).reverse() // Having the data in chronological order

  // ========Crypto Data for Python server ========//
  // Send the formatted data to the Python API for predictions
    // TODO: Send Data to Python Server for Predictions
    //const pythonRespnse = await axios.post("http://127.0.0.1:5001/predict", {data: formattedData})

    //Get the forecasts from the Python Server
    // TODO: Take forecast data from Python server to render on Chart
    //const forecastData = pythonRespnse.data;

    //Render the Predictions on a dashboard
    //TODO: Send over forecastData to be rendered as well

  // ========Deep Seek Response ========//

 
  // Preprocessing
  let modelInsights = deepSeekResponse.data.choices[0].message.content;
  let formattedInsights = cleanLLMHtmlResponse(modelInsights);

  // Render Everything in the dashboard
  res.render("dashboard", {actualData: formattedData, insights: formattedInsights, userCoin:userCoin, selectedTimeFrame: selectedTimeFrame});

 

});

//function to clean OpenRouter LLM response to proper html
function cleanLLMHtmlResponse(rawContent) {
    return rawContent
        .replace(/```html\s*/i, '')  // Remove opening code fence
        .replace(/```$/, '')         // Remove closing code fence
        .trim();                     // Remove extra whitespace
}


  // Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});