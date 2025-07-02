const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');
const Post = require('../models/Post');
const Category = require('../models/Category');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { search, category, myPosts } = req.query;
    let query = {};
    let selectedCategory = null;
    let categories = [];
    
    // Get categories first
    try {
      categories = await Category.find().sort({ name: 1 });
    } catch (err) {
      console.error('Error fetching categories:', err);
    }

    // Filter by user's posts if myPosts is true or user is viewing their dashboard
    if ((myPosts === 'true' || req.path === '/dashboard') && req.user) {
      query.author = req.user._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      selectedCategory = categories.find(cat => cat.slug === category);
      if (selectedCategory) {
        query.category = selectedCategory._id;
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    // Handle posts with null categories
    const validPosts = posts.map(post => {
      if (!post.category) {
        post.category = { name: 'Uncategorized', slug: 'uncategorized' };
      }
      return post;
    });

    res.render('posts/index', { 
      posts: validPosts, 
      search: search || '', 
      categories: categories || [],
      selectedCategory: selectedCategory || null,
      user: req.user,
      myPosts: myPosts === 'true'
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching posts');
    res.redirect('/');
  }
});

// New post form
router.get('/new', ensureAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('posts/new', { categories });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading categories');
    res.redirect('/dashboard');
  }
});

// Create post
router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newPost = new Post({
      title,
      content,
      category,
      author: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    await newPost.save();
    req.flash('success_msg', 'Post created successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error creating post');
    res.redirect('/posts/new');
  }
});

// Show single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug');
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/');
    }

    // Check if the post belongs to the logged-in user
    const isAuthor = req.user && post.author._id.toString() === req.user._id.toString();
    
    res.render('posts/show', { 
      post,
      isAuthor,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching post');
    res.redirect('/');
  }
});

// Edit post form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const [post, categories] = await Promise.all([
      Post.findById(req.params.id),
      Category.find().sort({ name: 1 })
    ]);

    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/');
    }
    if (post.author.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }
    res.render('posts/edit', { post, categories });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching post');
    res.redirect('/');
  }
});

// Update post
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/');
    }
    if (post.author.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }
    
    const { title, content, category } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content, category });
    req.flash('success_msg', 'Post updated successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating post');
    res.redirect('/dashboard');
  }
});

// Delete post
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/');
    }
    if (post.author.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }
    
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting post');
    res.redirect('/dashboard');
  }
});

module.exports = router; 