```javascript
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const clearData = async () => {
  try {
    console.log('🗑️ Clearing all data...');
    
    // Delete in order to respect foreign key constraints (though MongoDB doesn't enforce them strictly, it's good practice)
    await prisma.progress.deleteMany({});
    console.log('✅ Progress cleared');
    
    await prisma.quiz.deleteMany({});
    console.log('✅ Quizzes cleared');
    
    await prisma.course.deleteMany({});
    console.log('✅ Courses cleared');
    
    await prisma.user.deleteMany({});
    console.log('✅ Users cleared');

    console.log('✨ Database successfully cleared!');
  } catch (err) {
    console.error('❌ Error clearing data:', err);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
};

clearData();
```
