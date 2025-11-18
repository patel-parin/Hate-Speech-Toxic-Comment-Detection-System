const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required:false },
  inputText: { type: String, required: true },
  results: {
    overallScore: Number,
    categories: {
      toxic: Number,
      severe_toxic: Number,
      obscene: Number,
      threat: Number,
      insult: Number,
      identity_hate: Number
    },
    analysisTime: Number
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analysis", AnalysisSchema);
