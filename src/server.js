const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests
server.get('/posts', (req, res) => {
  if (req.query.term) {
    const term = req.query.term;
    const post = posts.filter(p => p.title === true || p.content === true);
    res.status(200).json(post);
  } else {
    res.status(200).json(posts);
  }
});

server.put('/posts', (req, res) => {
  const { id, title, contents } = req.body;

  if (!id) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a post id' });
    return;
  }
  if (!title) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a post title' });
    return;
  }
  if (!contents) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide post contents' });
    return;
  }
  const post = posts.find(p => p.id === Number(id));
  if (!post) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: `Couldn't find a post with id ${id}` });
    return;
  }
  post.title = title;
  post.contents = contents;
  res.json(post);
});

server.post('/posts', (req, res) => {
  res.json(posts);
});

server.delete('/posts', (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a post id' });
    return;
  }
  posts = posts.filter(p => p.id !== id);
  res.json({ success: true });
});
module.exports = { posts, server };
