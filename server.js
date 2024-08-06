const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const fs = require('fs');
const uploadsDir = 'public/uploads/';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

