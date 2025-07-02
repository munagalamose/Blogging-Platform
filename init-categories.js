require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const defaultCategories = [
  { 
    name: 'Music',
    description: 'Music news, reviews, and artists',
    slug: 'music'
  },
  { 
    name: 'Movies',
    description: 'Film reviews and entertainment news',
    slug: 'movies'
  },
  { 
    name: 'Sports',
    description: 'Sports news and updates',
    slug: 'sports'
  },
  { 
    name: 'Tech',
    description: 'Technology news and reviews',
    slug: 'tech'
  },
  { 
    name: 'Fashion',
    description: 'Fashion trends and style guides',
    slug: 'fashion'
  }
];

async function initCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegant-blog');
    console.log('MongoDB Connected');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Existing categories cleared');

    // Insert categories one by one
    for (const category of defaultCategories) {
      const newCategory = new Category(category);
      await newCategory.save();
    }
    console.log('Default categories initialized');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Run the initialization
initCategories(); 