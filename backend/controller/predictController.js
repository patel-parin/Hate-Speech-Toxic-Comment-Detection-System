const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const jwt = require("jsonwebtoken");
const Analysis = require("../model/analysis");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../model/user");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalAnalyzed = await Analysis.countDocuments();
        const toxicDetected = await Analysis.countDocuments({ 'results.overallScore': { $gte: 50 } });
        const activeUsers = await User.countDocuments();
      
        // Get analyses from the start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayAnalyzed = await Analysis.countDocuments({ createdAt: { $gte: startOfToday } });

        // 1. Analysis Volume for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyAnalyses = await Analysis.aggregate([
            { $match: { createdAt: { $exists: true, $gte: sevenDaysAgo } } },
            {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            toxicCount: {
                $sum: {
                    $cond: [{ $gte: ["$results.overallScore", 50] }, 1, 0]
                }
            }
        }
    },
            { $sort: { _id: 1 } }
        ]);
        
        // 2. Toxicity Category Breakdown (sum of all scores)
        const categoryBreakdown = await Analysis.aggregate([
            {
                $group: {
                    _id: null,
                    toxic: { $sum: "$results.categories.toxic" },
                    severe_toxic: { $sum: "$results.categories.severe_toxic" },
                    obscene: { $sum: "$results.categories.obscene" },
                    threat: { $sum: "$results.categories.threat" },
                    insult: { $sum: "$results.categories.insult" },
                    identity_hate: { $sum: "$results.categories.identity_hate" },
                }
            }
        ]);

        res.status(200).json({
            totalAnalyzed,
            toxicDetected,
            activeUsers,
            todayAnalyzed,
            dailyAnalyses: dailyAnalyses, // Add to response
            categoryBreakdown: categoryBreakdown[0] || {} // Add to response
        });

    } catch (error) {
        console.error("❌ Failed to fetch dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard statistics." });
    }
};


exports.predictText = (req, res) => {
  const { text } = req.body;

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
      const token = req.cookies.token;
      // ✅ Save to history if user is logged in
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const userId = decoded.id;
          
          console.log(`✅ User is logged in. Saving analysis for userId: ${userId}`);
          const newAnalysis = new Analysis({
            userId,
            inputText: text,
            results: result,
          });
          await newAnalysis.save();

        } catch (err) {
          // This can happen if the token is invalid or expired.
          // We don't want to block the analysis, so we just log it.
          console.log("⚠️ Could not verify token to save history. Continuing without saving.");
        }
      } else {
        console.log("ℹ️ User is not logged in. Analysis will not be saved to history.");
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