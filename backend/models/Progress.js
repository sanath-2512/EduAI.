const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [String], // IDs or indices of completed modules
  completedLessons: [String], // IDs or indices of completed lessons
  completedHours: { type: Number, default: 0 }, // Total hours completed
  learningHours: { type: Number, default: 0 }, // Total hours spent learning
  quizScores: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    takenAt: { type: Date, default: Date.now }
  }],
  finalAssessmentScore: {
    score: Number,
    totalQuestions: Number,
    takenAt: Date
  },
  lastAccessed: { type: Date, default: Date.now },
  sessionLogs: [{
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    lessonId: String,
    moduleId: String
  }]
});

module.exports = mongoose.model('Progress', progressSchema);
