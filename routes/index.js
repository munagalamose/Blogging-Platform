const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Post = require('../models/Post');
const Category = require('../models/Category');

// Welcome Page
router.get('/', async (req, res) => {
  try {
    const [posts, categories] = await Promise.all([
      Post.find()
        .populate('author', 'name')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(10),
      Category.find().sort({ name: 1 })
    ]);
    res.render('welcome', { 
      posts: posts || [], 
      categories: categories || [],
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.render('welcome', { 
      posts: [], 
      categories: [],
      user: req.user
    });
  }
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // Get user's posts and categories
    const [userPosts, categories] = await Promise.all([
      Post.find({ author: req.user.id })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 }),
      Category.find().sort({ name: 1 })
    ]);

    // Filter out any posts with null categories
    const validPosts = userPosts.map(post => {
      if (!post.category) {
        post.category = { name: 'Uncategorized', slug: 'uncategorized' };
      }
      return post;
    });

    // Get post count per category for this user
    const userCategoryStats = categories.map(category => {
      const postCount = validPosts.filter(post => 
        post.category && post.category._id && category._id && 
        post.category._id.toString() === category._id.toString()
      ).length;
      return {
        ...category.toObject(),
        postCount
      };
    });

    // Create stats object with default values
    const stats = {
      totalPosts: validPosts.length || 0,
      totalCategories: categories.length || 0,
      recentActivity: validPosts.slice(0, 5) || []
    };

    res.render('dashboard', {
      user: req.user,
      categories: userCategoryStats || [],
      userPosts: validPosts || [],
      stats: stats
    });
  } catch (err) {
    console.error(err);
    // Provide default values in case of error
    res.render('dashboard', {
      user: req.user,
      categories: [],
      userPosts: [],
      stats: {
        totalPosts: 0,
        totalCategories: 0,
        recentActivity: []
      }
    });
  }
});

module.exports = router; 