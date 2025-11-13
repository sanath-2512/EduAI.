require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: "https://eduai-25.netlify.app/", // allow Vite frontend
    credentials: true,
  }));
  


app.use(express.json());


app.get("/", (req, res) => {
    res.send("working!");
});



app.post('/signup',async (req,res)=>{
    try{
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({'error':'All the inputs fields are required'})
        }

        const existingEmail = await prisma.user.findUnique({where : {email}})
        if(existingEmail){
            return res.status(400).json({'error':'Email already exist'})
        }

        const existingUser =  await prisma.user.findUnique({where : {username}})
        if(existingUser){
            return res.status(400).json({'error':'Username already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: { username, email, password: hashedPassword },
        });
        res.status(201).json({'message':'Signup Successful', 'userId':user.id})
    }catch(err){
        return res.status(500).json({'message':err})
    }
})

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'All input fields are required' });
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));