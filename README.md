# 🧠 NeuraCoin: AI-Powered Cryptocurrency Dashboard

NeuraCoin is a responsive web dashboard that leverages AI and data visualization to help users understand and forecast cryptocurrency price movements. It supports multiple timeframes (Daily, Weekly, Monthly), and provides both historical analytics and intelligent insights for informed trading decisions.

---

## 🚀 Features

- 📈 **Interactive Data Visualization**  
  View historical crypto price charts (BTC, ETH, ADA, XRP, SOL, etc.) using AlphaVantage data.
  
- 📊 **Custom Timeframe Filtering**  
  Choose from Daily, Weekly, or Monthly data and apply date range filters (e.g., last 7 days).

- 🤖 **AI-Powered Insights**  
  Analyzes patterns in crypto trends using DeepSeek (e.g., volatility, trends, sentiment).

- 🔮 **AI-Powered Forecasting** *(Coming Soon)*  
  Uses deep learning to generate short-term price forecasts based on historical data and market signals.

- 💡 **Responsive UI/UX**  
  Fully mobile-optimized with intuitive forms, loaders, dropdowns, and a clean visual layout.

---

## 📂 Project Structure

```bash
project-root/
│
├── public/                # Static assets (CSS, JS, images)
│   ├── css/
│   └── images/
│
├── views/                 # EJS templates
│   ├── partials/
│   ├── selection.ejs
|   |         ├── header.ejs
│   |         └── footer.ejs
│   ├── dashboard.ejs      # View Coin Data and Filter Data. View AI insights
│   ├── selection.ejs      # Select Coin and Timeframe
    ├── index.html         # Landing Page
│   └── error.ejs
│
├── main.js                # Main Express server setup
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation

```

## ⚙️ Installation
```bash
git clone https://github.com/mbasacokile7/Crypto-Price-Prediction-Dashboard.git
cd Crypto-Price-Prediction-Dashboard
npm install
```

Create a .env file and add your AlphaVantage API key:

`ALPHA_VANTAGE_API_KEY=your_api_key_here`

Then start the server:

```bash
npm main.js
```

## 🌐 Usage
1. Navigate to http://localhost:3000/

2. Select a cryptocurrency and timeframe.

3. View historical price charts and AI insights.

4. (Forecasting module coming soon!)

## 📸 Screenshots

### Dashboard View
![SELECTION PAGE](SELECTION_PAGE.PNG)

### Dashboard View
![Dashboard](DASHBOARD.PNG)

## 🙌 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) — for providing free financial market data.
- [Chart.js](https://www.chartjs.org/) — for elegant and responsive data visualization.
- [Font Awesome](https://fontawesome.com/) — for the clean and intuitive icons used across the UI.
