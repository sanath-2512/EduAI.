#!/usr/bin/env node

// Demo script to show course creation works with rich content
require('dotenv').config();
const { generateCourseContent, generateQuiz } = require('./utils/ai');

(async () => {
  console.log('🎓 EduAI Course Generation Demo\n');
  console.log('Creating a course on "Web Development"...\n');
  
  const course = await generateCourseContent('Web Development');
  
  console.log('✅ COURSE CREATED!\n');
  console.log('═'.repeat(60));
  console.log(`📚 Title: ${course.title}`);
  console.log(`📝 Description: ${course.description}`);
  console.log(`⏱️  Duration: ${course.estimatedDuration}`);
  console.log(`🎯 Learning Outcomes (${course.learningOutcomes.length}):`);
  course.learningOutcomes.forEach((outcome, i) => {
    console.log(`   ${i + 1}. ${outcome}`);
  });
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📖 MODULES: ${course.modules.length}`);
  console.log('═'.repeat(60) + '\n');
  
  course.modules.forEach((module, i) => {
    console.log(`\n📌 ${module.moduleTitle}`);
    console.log(`   Level: ${module.level}`);
    console.log(`   Overview: ${module.moduleOverview}`);
    console.log(`   Lessons: ${module.lessons.length}`);
    
    module.lessons.forEach((lesson, j) => {
      console.log(`\n   ${i + 1}.${j + 1} ${lesson.lessonTitle}`);
      console.log(`   ${'─'.repeat(50)}`);
      console.log(`   📝 Explanation: ${lesson.explanation.substring(0, 200)}...`);
      console.log(`   💡 Examples: ${lesson.examples.length}`);
      console.log(`   🧠 Analogies: ${lesson.analogies.length}`);
      console.log(`   🌍 Real-World Apps: ${lesson.realWorldApplications.length}`);
      console.log(`   ❓ Practice Questions: ${lesson.quickPractice.length}`);
    });
  });
  
  console.log('\n\n' + '═'.repeat(60));
  console.log('🎯 GENERATING QUIZ...');
  console.log('═'.repeat(60) + '\n');
  
  const quiz = await generateQuiz('Web Development');
  
  console.log(`✅ Quiz: ${quiz.title}`);
  console.log(`   Questions: ${quiz.questions.length}\n`);
  
  quiz.questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    q.options.forEach((opt) => {
      const marker = opt === q.correctAnswer ? '✓' : ' ';
      console.log(`   [${marker}] ${opt}`);
    });
    console.log(`   💡 ${q.explanation}\n`);
  });
  
  console.log('═'.repeat(60));
  console.log('🎉 Demo Complete!');
  console.log('═'.repeat(60));
  console.log('\n✨ As you can see, courses have RICH, DETAILED content!');
  console.log('✨ This content is available even without AI working.');
  console.log('\n📝 To use in the app:');
  console.log('   1. Login at http://localhost:5174/login');
  console.log('   2. Create a course');
  console.log('   3. Click "Start Lesson" to see full content');
  console.log('   4. Take the quiz to test knowledge\n');
})();
