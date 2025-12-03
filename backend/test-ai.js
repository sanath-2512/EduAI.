const { generateCourseContent } = require('./utils/ai');
require('dotenv').config();

async function testAI() {
  console.log('🧪 Testing AI Generation...');
  const start = Date.now();
  
  try {
    const topic = 'React Hooks';
    console.log(`📝 Topic: ${topic}`);
    
    const content = await generateCourseContent(topic);
    
    const duration = (Date.now() - start) / 1000;
    console.log(`\n✅ AI Generation Successful!`);
    console.log(`⏱️ Time taken: ${duration} seconds`);
    console.log(`📚 Modules generated: ${content.modules.length}`);
    console.log(`📄 Title: ${content.title}`);
    
  } catch (error) {
    console.error('\n❌ AI Generation Failed:', error.message);
  }
}

testAI();
