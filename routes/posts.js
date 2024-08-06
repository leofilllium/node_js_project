const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const newLocal = '../models/Post';
const Post = require(newLocal);
const newLocalLocal = '../models/User';
const User = require(newLocalLocal);

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const username = token.split(' ')[1];
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, topic } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  const userId = req.user.id;
  const username = req.user.username;

  try {
    const newPost = new Post({ title, description, topic, imageUrl, user: userId, username });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const { title, description, topic, username } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const userId = req.user.id;


  try {
    const post = await Post.findById(postId);
    if (!post || post.user.toString() !== userId) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.title = title;
    post.description = description;
    post.topic = topic;
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
    
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post || post.user.toString() !== userId) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.remove();
    res.json(post);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;