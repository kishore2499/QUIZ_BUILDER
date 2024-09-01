const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz.questions",  // Reference to a specific question within a quiz
    required: true,
  },
  selectedOption: {
    type: Number,
    required: true,
  },
});

const responseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional field for anonymous responses
  },
  answers: {
    type: [answerSchema],
    default: [],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Response", responseSchema);
