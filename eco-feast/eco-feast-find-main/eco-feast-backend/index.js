import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'eco-feast-secret';

// In-memory data (replace with DB in production)
let users = [];
let orders = [];
let activities = [];
let rewards = [
  { id: "1", name: "10% Off", pointsRequired: 100 },
  { id: "2", name: "Free Dessert", pointsRequired: 50 }
];
let menu = [
  { id: "1", name: "Paneer Butter Masala", price: 12.99, category: "main" },
  { id: "2", name: "Vegetable Biryani", price: 14.99, category: "main" },
  // ...add more
];

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash, points: 0 });
  res.json({ success: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Get menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// Place order
app.post('/api/order', auth, (req, res) => {
  const { cart, date, timeSlot, guests } = req.body;
  orders.push({ user: req.user.email, cart, date, timeSlot, guests });
  res.json({ success: true });
});

// Submit eco activity
app.post('/api/activity', auth, (req, res) => {
  const { type, proof } = req.body;
  // Example: type = "plant-tree", proof = image url or base64
  activities.push({ user: req.user.email, type, proof, status: "pending" });
  res.json({ success: true });
});

// Get rewards
app.get('/api/rewards', (req, res) => {
  res.json(rewards);
});

// Redeem reward
app.post('/api/redeem', auth, (req, res) => {
  const { rewardId } = req.body;
  const user = users.find(u => u.email === req.user.email);
  const reward = rewards.find(r => r.id === rewardId);
  if (!user || !reward) return res.status(400).json({ error: 'Invalid' });
  if (user.points < reward.pointsRequired) return res.status(400).json({ error: 'Not enough points' });
  user.points -= reward.pointsRequired;
  res.json({ success: true });
});

// Get user info (points, activities, etc.)
app.get('/api/user', auth, (req, res) => {
  const user = users.find(u => u.email === req.user.email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ email: user.email, points: user.points });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));