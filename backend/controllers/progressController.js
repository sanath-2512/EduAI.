const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, quizId, score, completed } = req.body;
    const userId = req.user.userId;

    // Check if progress already exists
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId,
        ...(courseId && { courseId }),
        ...(quizId && { quizId })
      }
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          score: score !== undefined ? score : existingProgress.score,
          completed: completed !== undefined ? completed : existingProgress.completed
        }
      });
    } else {
      // Create new progress
      progress = await prisma.progress.create({
        data: {
          userId,
          courseId: courseId || null,
          quizId: quizId || null,
          score: score || 0,
          completed: completed || false
        }
      });
    }

    res.json(progress);
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId, quizId } = req.query;

    const where = { userId };
    if (courseId) where.courseId = courseId;
    if (quizId) where.quizId = quizId;

    const progress = await prisma.progress.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, topic: true }
        },
        quiz: {
          select: { id: true, topic: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(progress);
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [totalCourses, completedCourses, totalQuizzes, completedQuizzes] = await Promise.all([
      prisma.course.count({ where: { userId } }),
      prisma.progress.count({ where: { userId, courseId: { not: null }, completed: true } }),
      prisma.quiz.count({ where: { userId } }),
      prisma.progress.count({ where: { userId, quizId: { not: null }, completed: true } })
    ]);

    // Get average quiz score
    const quizProgress = await prisma.progress.findMany({
      where: { userId, quizId: { not: null }, score: { not: null } },
      select: { score: true }
    });

    const avgScore = quizProgress.length > 0
      ? quizProgress.reduce((sum, p) => sum + (p.score || 0), 0) / quizProgress.length
      : 0;

    res.json({
      totalCourses,
      completedCourses,
      totalQuizzes,
      completedQuizzes,
      averageQuizScore: Math.round(avgScore * 10) / 10
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
