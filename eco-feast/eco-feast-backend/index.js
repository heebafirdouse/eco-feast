const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Order = require('./models/Order');
const Activity = require('./models/Activity');
const Reward = require('./models/Reward');
const connectDB = require('./config/db');

const app = express();
const port = 4002;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Activity points mapping with descriptions
const activityPoints = {
  'plant_tree': {
    points: 50,
    description: 'Planting a new tree',
    requiredImage: 'Tree planting activity'
  },
  'recycle': {
    points: 20,
    description: 'Recycling waste materials',
    requiredImage: 'Recycling activity'
  },
  'cycle': {
    points: 30,
    description: 'Using bicycle for transportation',
    requiredImage: 'Cycling activity'
  },
  'compost': {
    points: 25,
    description: 'Creating compost from organic waste',
    requiredImage: 'Composting activity'
  },
  'cleanup': {
    points: 40,
    description: 'Cleaning up public spaces',
    requiredImage: 'Cleanup activity'
  }
};

const SECRET = 'eco-feast-secret';

// Connect to MongoDB
connectDB();

// Auth middleware
function auth(req, res, next) {
  console.log('Auth middleware - Headers:', req.headers);
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ success: false, error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token in authorization header');
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('Token decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    console.log('Registration attempt for:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      points: 0
    });

    await user.save();
    console.log('New user registered:', email);

    // Generate token
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1d' });
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create booking route
app.post('/api/bookings', auth, async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.body;
    console.log('New booking request:', { date, timeSlot, guests, userId: req.user.userId });
    
    const booking = new Booking({
      userId: req.user.userId,
      date: new Date(date),
      timeSlot,
      guests,
      status: 'pending'
    });

    await booking.save();
    console.log('Booking created:', booking._id);
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// Create order route
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { cart, date, timeSlot, guests } = req.body;
    console.log('New order request:', { date, timeSlot, guests, userId: req.user.userId });
    
    // Create booking first
    const booking = new Booking({
      userId: req.user.userId,
      date: new Date(date),
      timeSlot,
      guests,
      status: 'pending'
    });

    await booking.save();
    console.log('Booking created for order:', booking._id);

    // Get user details for order name
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create order name using user's name and date
    const orderDate = new Date(date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const orderName = `${user.name}'s Order - ${formattedDate}`;

    // Process cart items with detailed information
    const processedItems = cart.map(item => ({
      itemId: item.item.id,
      name: item.item.name,
      description: item.item.description,
      price: item.item.price,
      quantity: item.quantity,
      category: item.item.category,
      image: item.item.image,
      itemTotal: item.item.price * item.quantity
    }));

    // Calculate total amount
    const totalAmount = processedItems.reduce((total, item) => total + item.itemTotal, 0);

    // Create order with detailed items
    const order = new Order({
      userId: req.user.userId,
      bookingId: booking._id,
      orderName,
      items: processedItems,
      totalAmount,
      status: 'pending'
    });

    await order.save();
    console.log('Order created:', {
      orderId: order._id,
      orderName: orderName,
      items: processedItems.map(item => `${item.quantity}x ${item.name}`).join(', '),
      totalAmount: totalAmount
    });

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      order,
      booking 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, error: 'Failed to place order' });
  }
});

// Submit eco-friendly activity
app.post('/api/activities', auth, upload.single('image'), async (req, res) => {
  try {
    const { activityType, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image is required' 
      });
    }

    // Validate activity type
    if (!activityPoints[activityType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid activity type',
        validActivities: Object.keys(activityPoints).map(type => ({
          type,
          points: activityPoints[type].points,
          description: activityPoints[type].description,
          requiredImage: activityPoints[type].requiredImage
        }))
      });
    }

    // Get points for activity type
    const points = activityPoints[activityType].points;

    // Create activity
    const activity = new Activity({
      userId: req.user.userId,
      activityType,
      description,
      imageUrl,
      points,
      status: 'pending'
    });

    await activity.save();

    // Update user points
    const user = await User.findById(req.user.userId);
    if (user) {
      user.points += points;
      await user.save();
    }

    console.log('Activity submitted:', {
      userId: req.user.userId,
      activityType,
      points,
      imageUrl,
      description: activityPoints[activityType].description
    });

    res.status(201).json({
      success: true,
      message: 'Activity submitted successfully',
      activity,
      pointsEarned: points,
      totalPoints: user.points,
      activityDetails: {
        type: activityType,
        description: activityPoints[activityType].description,
        requiredImage: activityPoints[activityType].requiredImage
      }
    });
  } catch (error) {
    console.error('Activity submission error:', error);
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({ 
        success: false, 
        error: 'Only image files (jpg, jpeg, png, gif) are allowed' 
      });
    }
    res.status(500).json({ success: false, error: 'Failed to submit activity' });
  }
});

// Get user's activities
app.get('/api/activities', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activities' });
  }
});

// Get user's points
app.get('/api/user/points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      points: user.points
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch points' });
  }
});

// Get available activities
app.get('/api/activities/types', (req, res) => {
  const activityTypes = Object.keys(activityPoints).map(type => ({
    type,
    points: activityPoints[type].points,
    description: activityPoints[type].description,
    requiredImage: activityPoints[type].requiredImage
  }));
  
  res.json({
    success: true,
    activities: activityTypes
  });
});

// Get user profile
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user's activities
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's orders
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        points: user.points,
        createdAt: user.createdAt
      },
      recentActivities: activities,
      recentOrders: orders
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
});

// Get all rewards
app.get('/api/rewards', auth, async (req, res) => {
  try {
    console.log('Fetching rewards for user:', req.user.userId);
    const rewards = await Reward.find({ isActive: true });
    console.log('Found rewards:', rewards.length);
    res.json({
      success: true,
      rewards
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch rewards' });
  }
});

// Get specific reward
app.get('/api/rewards/:id', auth, async (req, res) => {
  try {
    console.log('Fetching reward:', req.params.id, 'for user:', req.user.userId);
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      console.log('Reward not found:', req.params.id);
      return res.status(404).json({ success: false, error: 'Reward not found' });
    }
    console.log('Found reward:', reward);
    res.json({
      success: true,
      reward
    });
  } catch (error) {
    console.error('Error fetching reward:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reward' });
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



