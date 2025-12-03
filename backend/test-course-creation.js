const axios = require('axios');

async function testCourseCreation() {
  try {
    // First, register a user
    console.log('1. Registering user...');
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('✅ User registered');
    } catch (regError) {
      console.log('ℹ️  User might already exist, trying login...');
    }
    
    // Login to get a token
    console.log('\n2. Logging in...');
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful, token received');
    
    // Create a course with AI
    console.log('\n3. Creating AI course...');
    const courseRes = await axios.post(
      'http://localhost:3000/api/courses',
      {
        topic: 'React Hooks',
        useAI: true
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Course created successfully:');
    console.log('ID:', courseRes.data.id);
    console.log('Title:', courseRes.data.title);
    console.log('Has content:', !!courseRes.data.content);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testCourseCreation();
