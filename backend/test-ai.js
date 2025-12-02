#!/usr/bin/env node

// Standalone test script to verify GEMINI_API_KEY and AI generation
require('dotenv').config();

console.log('=== EduAI Configuration Check ===\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('   PORT:', process.env.PORT || 'default (5000)');

console.log('\n2. Testing AI Generation...');

if (!process.env.GEMINI_API_KEY) {
  console.log('   ❌ ERROR: GEMINI_API_KEY is not set!');
  console.log('\n   SOLUTION: Add GEMINI_API_KEY to backend/.env file');
  console.log('   Get your key from: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

const { generateCourseContent, generateQuiz } = require('./utils/ai');

(async () => {
  try {
    console.log('   Generating test course for "JavaScript Basics"...');
    const course = await generateCourseContent('JavaScript Basics');
    
    console.log('\n   ✅ Course Generation Successful!');
    console.log('   Title:', course.title);
    console.log('   Modules:', course.modules?.length || 0);
    console.log('   First Module:', course.modules?.[0]?.moduleTitle || 'N/A');
    console.log('   First Lesson:', course.modules?.[0]?.lessons?.[0]?.lessonTitle || 'N/A');
    
    console.log('\n   Generating test quiz...');
    const quiz = await generateQuiz('JavaScript Basics');
    
    console.log('\n   ✅ Quiz Generation Successful!');
    console.log('   Quiz Title:', quiz.title);
    console.log('   Questions:', quiz.questions?.length || 0);
    
    console.log('\n=== ✅ All Systems Working! ===');
  } catch (error) {
    console.log('\n   ❌ ERROR:', error.message);
    console.log('\n   This might mean:');
    console.log('   1. Invalid GEMINI_API_KEY');
    console.log('   2. API quota exceeded');
    console.log('   3. Network connectivity issues');
    console.log('\n   Check your API key at: https://aistudio.google.com/app/apikey');
  }
})();
