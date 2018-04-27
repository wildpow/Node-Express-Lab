const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];
let nextId = 1;

function getNextId() {
  return nextId++;
}

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests
server.get('/posts', function(req, res) {
  // req.query.term
  const searchTerm = req.query.term;
  if (searchTerm) {
    // filter the collection
    const filteredPosts = posts.filter(post => {
      return (
        post.title.includes(searchTerm) || post.contents.includes(searchTerm)
      );
    });
    res.status(200).json(filteredPosts);
  } else {
    res.status(200).json(posts);
  }
});

server.post('/posts', function(req, res) {
  const { title, contents } = req.body;
  
  if (title && contents) {
    const id = getNextId();
    const post = { ...req.body, id }
  
    posts.push(post);
  
    res.status(200).json(post);
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: 'Please provide title and contents.' });
  }
});

server.put('/posts', function(req, res) {
  const { id, title, contents } = req.body;

  if (id && title && contents) {
    let post = posts.find(p => p.id === Number(id));
    if (post) {
      Object.assign(post, req.body);
      res.status(200).json(post);
    } else {
      res.status(STATUS_USER_ERROR).json({ error: 'The post does not exist.' });
    }
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: 'Please provide all the information.' });
  }
});

server.delete('/posts', function(req, res) {
  const { id } = req.body;

  if (id) {
    let postIndex = posts.findIndex(p => p.id === Number(id));

    if (postIndex > -1) {
      posts.splice(postIndex, 1);
      res.status(200).json({ success: true });
    } else {
      res.status(STATUS_USER_ERROR).json({ error: 'The post does not exist.' });
    }
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: 'Please provide a valid id.' });
  }
});



module.exports = { posts, server };