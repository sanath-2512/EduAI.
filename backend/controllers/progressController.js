const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, completedModuleId, completedLessonId, quizScore, quizId, finalAssessmentScore, totalQuestions } = req.body;
    let progress = await Progress.findOne({ userId: req.user.userId, courseId });

    if (!progress) {
      progress = new Progress({ 
        userId: req.user.userId, 
        courseId, 
        completedModules: [], 
        completedLessons: [],
        quizScores: [],
        sessionLogs: []
      });
    }

    if (completedModuleId && !progress.completedModules.includes(completedModuleId)) {
      progress.completedModules.push(completedModuleId);
    }

    if (completedLessonId && !progress.completedLessons.includes(completedLessonId)) {
      progress.completedLessons.push(completedLessonId);
    }

    if (quizId && quizScore !== undefined) {
      progress.quizScores.push({ quizId, score: quizScore });
    }

    if (finalAssessmentScore !== undefined && totalQuestions) {
      progress.finalAssessmentScore = {
        score: finalAssessmentScore,
        totalQuestions,
        takenAt: new Date()
      };
    }

    progress.lastAccessed = Date.now();
    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.trackSession = async (req, res) => {
  try {
    const { courseId, startTime, endTime, lessonId, moduleId } = req.body;
    let progress = await Progress.findOne({ userId: req.user.userId, courseId });

    if (!progress) {
      progress = new Progress({ 
        userId: req.user.userId, 
        courseId, 
        completedModules: [], 
        completedLessons: [],
        quizScores: [],
        sessionLogs: []
      });
    }

    const duration = Math.round((new Date(endTime) - new Date(startTime)) / 1000 / 60); // duration in minutes
    const hoursSpent = duration / 60; // convert to hours

    progress.sessionLogs.push({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      lessonId: lessonId || '',
      moduleId: moduleId || ''
    });

    progress.learningHours = (progress.learningHours || 0) + hoursSpent;
    progress.lastAccessed = Date.now();
    
    await progress.save();
    res.json({ 
      learningHours: progress.learningHours,
      sessionDuration: duration,
      message: 'Session tracked successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.userId, courseId: req.params.courseId });
    if (!progress) return res.json({ completedModules: [], quizScores: [] });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
