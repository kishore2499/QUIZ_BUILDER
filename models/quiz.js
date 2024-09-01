const mongoose = require("mongoose");

// Schema definition for quiz questions
const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ["Q&A", "Poll"],  // Valid options for the type of question
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: function () {
      return this.questionType === "Poll";
    },  // Choices are mandatory for "Poll" type questions
    default: function () {
      return this.questionType === "Q&A" ? undefined : [];
    },
  },
  answerIndex: {
    type: Number,
    required: function () {
      return this.questionType === "Q&A";
    },  // Answer index is mandatory for "Q&A" type questions
    validate: {
      validator: function (value) {
        return this.questionType !== "Q&A" || (value >= 0 && value < this.choices.length);
      },
      message: "Invalid answer index, it must correspond to a valid choice.",
    },
  },
  timeLimit: {
    type: Number,  // Time limit in seconds, optional
  },
});

// Schema definition for quizzes
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questionList: {
    type: [questionSchema],
    validate: [validateQuestionCount, "A quiz can have a maximum of 5 questions"],
  },
  format: {
    type: String,
    enum: ["Single Question", "Multiple Questions"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Q&A", "Poll"],
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Custom validator to ensure the quiz does not exceed 5 questions
function validateQuestionCount(questions) {
  return questions.length <= 5;
}

// Pre-save middleware to update the 'trending' field
quizSchema.pre("save", function (next) {
  if (this.viewCount > 10) {
    this.trending = true;
  }
  next();
});

module.exports = mongoose.model("Quiz", quizSchema);

