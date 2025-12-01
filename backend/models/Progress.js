const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [String], // IDs or indices of completed modules
  quizScores: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    takenAt: { type: Date, default: Date.now }
  }],
  lastAccessed: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
