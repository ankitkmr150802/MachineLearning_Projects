const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Serve `index.html` when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ Route for House Price Prediction
app.post("/predict", (req, res) => {
    console.log("Received Request Body:", req.body);

    const { size, bedrooms, bathrooms, garage_space, location_score } = req.body;

    // ✅ Check for missing values
    if ([size, bedrooms, bathrooms, garage_space, location_score].some(val => val === undefined || val === "")) {
        return res.status(400).json({ error: "Missing input values!" });
    }

    // ✅ Convert inputs to strings to prevent empty arguments
    const pythonProcess = spawn("python", [
        path.join(__dirname, "model.py"), 
        String(size), 
        String(bedrooms), 
        String(bathrooms), 
        String(garage_space), 
        String(location_score)
    ]);

    let predictedPrice = "";

    // ✅ Capture Python script output
    pythonProcess.stdout.on("data", (data) => {
        predictedPrice += data.toString().trim();
    });

    // ✅ Handle Python errors
    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error in Python script" });
        }
    });

    // ✅ Send final response (ensures clean output)
    pythonProcess.on("close", (code) => {
        if (!res.headersSent) {
            res.json({ predicted_price: predictedPrice });
        }
    });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
