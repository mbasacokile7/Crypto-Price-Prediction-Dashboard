# Import Dependencies
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from nixtla import TimeGPT

#Create Flask APP

app = Flask(__name__)

# Enable CORS
CORS(app)

# Create timegpt model object
timegpt = TimeGPT()


@app.route("/predict", methods=["POST"])
def predict():

    # Put the code in between a try/except block
    try:
        # GEt the timeseries data from the express server
        data = request.json.get("data", [])

        # Convert the data to a Pandas DF
        df = pd.DataFrame(data)
        # Convert the date to timeseries
        df["ds"] = pd.to_datetime(df["ds"])

        # Fine tune the model for better accuracy
        timegpt.finetune(df, finetune_steps=10, finetune_depth=1)

        # Generate forecast for the next 3 days
        forecast = timegpt.forecast(df, h=3)

        #Convert the predictions to JSON and send back to express server
        forecast_json = forecast.to_dict(orient="records")
        return jsonify(forecast_json)

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=5001, debug=True)