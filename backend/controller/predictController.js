const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const jwt = require("jsonwebtoken");
const Analysis = require("../model/analysis");
const JWT_SECRET = process.env.JWT_SECRET;

exports.predictText = (req, res) => {
  const { text, userId } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text input is required." });
  }

  // ✅ Correct Python script path no matter where the server is started from
  const pythonScriptPath = path.join(__dirname, "..", "ml", "predict.py");

  // ✅ Spawn Python process with correct script path and text argument
  const pythonProcess = spawn("python", [pythonScriptPath, text], {
    cwd: path.join(__dirname, "..", "ml"), // Ensures working directory is correct
  });

  let resultData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
  });

  pythonProcess.on("close", async (code) => {
    if (code !== 0) {
      console.error(`❌ Python Script Error: ${errorData}`);
      return res.status(500).json({ error: "Prediction failed", details: errorData });
    }

    try {
      const result = JSON.parse(resultData);

      // ✅ Save to history if user is logged in
      if (userId) {
        const newAnalysis = new Analysis({
          userId,
          inputText: text,
          results: result,
        });
        await newAnalysis.save();
      }

      res.json(result);
    } catch (e) {
      console.error("❌ Failed to parse prediction result:", e);
      res.status(500).json({ error: "Failed to parse prediction result" });
    }
  });
};

exports.getHistory = async (req, res) => {
  try {
    // 1. Get the token from the cookie
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated, please log in." });
    }

    // 2. Verify the token and get the user's ID
   let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Your session is invalid. Please log in again." });
    }

    const userId = decoded.id;
    // 3. Fetch history for that specific user ID
    const history = await Analysis.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    // This will catch invalid/expired tokens
    res.status(401).json({ message: "Your session is invalid. Please log in again." });
  }
};


exports.getStats = async (req, res) => {
    try {
        // 1. Get total number of documents in the Analysis collection
        const totalAnalyzed = await Analysis.countDocuments();

        // 2. Get the number of documents considered toxic
        // We define "toxic" as any entry where the overallScore is >= 50
        const toxicDetected = await Analysis.countDocuments({ 
            'results.overallScore': { $gte: 50 } 
        });

        res.status(200).json({
            totalAnalyzed,
            toxicDetected
        });

    } catch (error) {
        console.error("❌ Failed to fetch stats:", error);
        res.status(500).json({ message: "Failed to fetch statistics." });
    }
};


exports.getExampleComment = (req, res) => {
    const results = [];
    const csvFilePath = path.join(__dirname, '..','ml' ,'data', 'train.csv');

    if (!fs.existsSync(csvFilePath)) {
        console.error('❌ train.csv not found at', csvFilePath || './ml/data/train.csv');
        return res.status(500).json({ message: 'Example dataset not found on server.' });
    }

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            if (results.length === 0) {
                return res.status(500).json({ message: 'No data in example dataset.' });
            }
            // Select a random row
            const randomIndex = Math.floor(Math.random() * results.length);
            const randomComment = results[randomIndex];
            
            // Send back only the comment text
            res.status(200).json({ comment_text: randomComment.comment_text });
        })
        .on('error', (error) => {
            console.error('❌ Error reading CSV file:', error);
            res.status(500).json({ message: 'Failed to read example dataset.' });
        });
};