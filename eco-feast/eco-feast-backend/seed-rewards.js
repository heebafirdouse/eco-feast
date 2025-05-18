const mongoose = require('mongoose');
const Reward = require('./models/Reward');
const connectDB = require('./config/db');

const rewards = [
  {
    name: "Eco Warrior Badge",
    description: "A special badge for completing 5 eco-friendly activities",
    points: 100,
    image: "/rewards/eco-warrior-badge.png",
    isActive: true
  },
  {
    name: "Tree Planting Certificate",
    description: "Certificate for planting 10 trees",
    points: 200,
    image: "/rewards/tree-planting-cert.png",
    isActive: true
  },
  {
    name: "Recycling Champion",
    description: "Award for recycling 50kg of waste",
    points: 150,
    image: "/rewards/recycling-champion.png",
    isActive: true
  },
  {
    name: "Green Commuter",
    description: "Recognition for using eco-friendly transportation for 30 days",
    points: 120,
    image: "/rewards/green-commuter.png",
    isActive: true
  },
  {
    name: "Zero Waste Hero",
    description: "Achievement for maintaining zero waste lifestyle for a month",
    points: 180,
    image: "/rewards/zero-waste-hero.png",
    isActive: true
  },
  {
    name: "Ocean Guardian",
    description: "Award for participating in beach cleanup activities",
    points: 160,
    image: "/rewards/ocean-guardian.png",
    isActive: true
  },
  {
    name: "Energy Saver",
    description: "Recognition for reducing energy consumption by 20%",
    points: 140,
    image: "/rewards/energy-saver.png",
    isActive: true
  },
  {
    name: "Water Conservationist",
    description: "Award for implementing water-saving practices",
    points: 130,
    image: "/rewards/water-conservationist.png",
    isActive: true
  },
  {
    name: "Sustainable Foodie",
    description: "Recognition for maintaining a sustainable diet for 3 months",
    points: 170,
    image: "/rewards/sustainable-foodie.png",
    isActive: true
  },
  {
    name: "Eco Innovator",
    description: "Award for creating innovative eco-friendly solutions",
    points: 250,
    image: "/rewards/eco-innovator.png",
    isActive: true
  }
];

// Connect to MongoDB
connectDB();

// Function to seed rewards
async function seedRewards() {
  try {
    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('Cleared existing rewards');

    // Insert new rewards
    const insertedRewards = await Reward.insertMany(rewards);
    console.log('Successfully seeded rewards:', insertedRewards.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding rewards:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedRewards(); 