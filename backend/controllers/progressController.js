const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, completedModuleId, quizScore, quizId } = req.body;
    let progress = await Progress.findOne({ userId: req.user.userId, courseId });

    if (!progress) {
      progress = new Progress({ userId: req.user.userId, courseId, completedModules: [], quizScores: [] });
    }

    if (completedModuleId && !progress.completedModules.includes(completedModuleId)) {
      progress.completedModules.push(completedModuleId);
    }

    if (quizId && quizScore !== undefined) {
      progress.quizScores.push({ quizId, score: quizScore });
    }

    progress.lastAccessed = Date.now();
    await progress.save();
    res.json(progress);
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
