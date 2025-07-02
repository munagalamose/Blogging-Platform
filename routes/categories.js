const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { ensureAuthenticated } = require('../config/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('categories/index', { categories });
  } catch (err) {
    req.flash('error_msg', 'Error loading categories');
    res.redirect('/');
  }
});

// Add new category form (admin only)
router.get('/new', ensureAuthenticated, (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }
  res.render('categories/new');
});

// Create new category (admin only)
router.post('/', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }

  try {
    const { name, description } = req.body;
    const newCategory = new Category({
      name,
      description
    });
    await newCategory.save();
    req.flash('success_msg', 'Category created successfully');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error_msg', 'Error creating category');
    res.redirect('/categories/new');
  }
});

// Initialize default categories
router.post('/init', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }

  const defaultCategories = [
    { name: 'Music', description: 'Music news, reviews, and artists' },
    { name: 'Movies', description: 'Film reviews and entertainment news' },
    { name: 'Sports', description: 'Sports news and updates' },
    { name: 'Tech', description: 'Technology news and reviews' },
    { name: 'Fashion', description: 'Fashion trends and style guides' }
  ];

  try {
    await Category.insertMany(defaultCategories);
    req.flash('success_msg', 'Default categories initialized');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error_msg', 'Error initializing categories');
    res.redirect('/categories');
  }
});

// Edit category form (admin only)
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }

  try {
    const category = await Category.findById(req.params.id);
    res.render('categories/edit', { category });
  } catch (err) {
    req.flash('error_msg', 'Category not found');
    res.redirect('/categories');
  }
});

// Update category (admin only)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }

  try {
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name, description });
    req.flash('success_msg', 'Category updated successfully');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error_msg', 'Error updating category');
    res.redirect('/categories');
  }
});

// Delete category (admin only)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/categories');
  }

  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Category deleted successfully');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error_msg', 'Error deleting category');
    res.redirect('/categories');
  }
});

module.exports = router; 