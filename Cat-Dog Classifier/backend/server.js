const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS & Serve Frontend Files
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Configure Multer for File Uploads
const upload = multer({ dest: "uploads/" });

// ✅ Route for Image Prediction
app.post("/predict", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" }); // ✅ Return immediately if no file
    }

    const imagePath = path.join(__dirname, "uploads", req.file.filename);
    const pythonProcess = spawn("python", [path.resolve(__dirname, "model.py"), imagePath]);

    let predictionResult = "";

    // ✅ Collect Python script output
    pythonProcess.stdout.on("data", (data) => {
        predictionResult += data.toString().trim();
    });

    // ✅ Handle Python script errors
    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error in Python script" });
        }
    });

    // ✅ Send the final prediction result
    pythonProcess.on("close", (code) => {
        if (!res.headersSent) {
            // ✅ Extract only the last line (Ensures clean response)
            const cleanResult = predictionResult.split("\n").pop().trim();
            res.json({ result: cleanResult, img_path: `/uploads/${req.file.filename}` });
        }
    });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
