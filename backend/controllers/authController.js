const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, email: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: { id: true, username: true, email: true }
    });
    
    res.json({ 
      message: 'Profile updated', 
      user 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
