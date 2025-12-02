#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('🔍 Fetching available Gemini models...\n');

(async () => {
  try {
    // Try to list models using the API
    const models = await genAI.listModels();
    
    console.log('✅ Available Models:\n');
    for await (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('');
    }
  } catch (error) {
    console.log('❌ Error listing models:', error.message);
    console.log('\nTrying common model names directly...\n');
    
    // Try common model names
    const testModels = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello"');
        const text = await result.response.text();
        console.log(`✅ ${modelName}: WORKS! Response: ${text.substring(0, 50)}`);
      } catch (err) {
        console.log(`❌ ${modelName}: ${err.message.split('\n')[0]}`);
      }
    }
  }
})();
