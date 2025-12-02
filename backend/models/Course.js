const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learningOutcomes: { type: [String], default: [] },
  estimatedDuration: { type: String },
  estimatedLearningHours: { type: Number, default: 0 },
  content: { 
    type: Array, 
    default: [] 
    // Structure: [{ 
    //   moduleTitle, 
    //   level, 
    //   moduleOverview, 
    //   estimatedHours,
    //   lessons: [{ 
    //     lessonTitle, 
    //     beginnerExplanation,
    //     deepTheory,
    //     practicalExamples: [{ title, description, commonMistakes, correction }],
    //     handsOnExercises: [{ exercise, difficulty, solution }],
    //     caseStudy: { title, scenario, steps, outcome },
    //     chapterQuiz: { questions: [{ question, options, correctAnswer, explanation }] },
    //     estimatedHours
    //   }] 
    // }]
  },
  projects: {
    miniProject: {
      title: String,
      description: String,
      requirements: [String],
      sampleSolution: String,
      improvementIdeas: [String]
    },
    finalProject: {
      title: String,
      description: String,
      requirements: [String],
      sampleSolution: String,
      improvementIdeas: [String]
    }
  },
  revisionNotes: { type: String },
  finalAssessment: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: String,
      explanation: String
    }]
  },
  resources: {
    youtubePlaylists: [{
      title: String,
      playlistId: String,
      description: String
    }],
    recommendedBooks: [{
      title: String,
      author: String,
      description: String,
      link: String
    }],
    articles: [{
      title: String,
      url: String,
      description: String
    }],
    documentation: [{
      title: String,
      url: String,
      description: String
    }],
    tools: [{
      name: String,
      url: String,
      description: String
    }],
    courses: [{
      title: String,
      platform: String,
      url: String,
      description: String
    }]
  },
  generatedByAI: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
