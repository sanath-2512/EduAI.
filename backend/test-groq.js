const { generateCourseContent } = require('./utils/ai');
require('dotenv').config();

(async () => {
  console.log("🧪 Testing Groq AI Course Generation...");
  const topic = "Data Science";
  
  try {
    const course = await generateCourseContent(topic);
    
    console.log("\n✅ Course Generated:");
    console.log(`Title: ${course.title}`);
    console.log(`Modules: ${course.modules.length}`);
    
    if (course.modules.length > 0) {
      const firstLesson = course.modules[0].lessons[0];
      console.log(`\n📝 First Lesson: ${firstLesson.lessonTitle}`);
      console.log(`Explanation Length: ${firstLesson.explanation.length} chars`);
      console.log(`Excerpt: ${firstLesson.explanation.substring(0, 150)}...`);
      console.log(`Examples: ${firstLesson.examples.length}`);
    } else {
      console.log("❌ No modules found!");
    }
  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
})();
