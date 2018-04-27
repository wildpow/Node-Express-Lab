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

server.get('/posts', (req, res) => {
  if (req.query.term) {
    const filterPosts = posts.filter((post) => {
      return post.title.includes(req.query.term) || post.contents.includes(req.query.term);
    });
    res.status(200).json(filterPosts);
  } else {
    res.status(200).json(posts);
  }
});

server.post('/posts', (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    const id = getNextId();
    const post = req.body; // { title, contents }
    post.id = id;

    Object.assign({}, req.body, { id });

    // const post = { ...req.body, id }
    posts.push(post);

    res.status(200).json(post);
  } else {
    res.status(STATUS_USER_ERROR).json({ error: 'Please provid title and contents' });
  }
});

server.put('/posts', (req, res) => {
  const { id, title, contents } = req.body;

  if (id && title && contents) {
    const post = posts.find(p => p.id === Number(id));

    if (post) {
      Object.assign(post, req.body);
      res.status(200).json(post);
    } else {
      res.status(STATUS_USER_ERROR).json({ error: 'The post does not exist' });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({ error: 'Please provide a ll the infomation' });
  }
});

server.delete('/posts', (req, res) => {
  const { id } = req.body;

  if (id) {
    const postIndex = posts.findIndex(p => p.id === Number(id));
    if (postIndex > -1) {
      posts.splice(postIndex, 1);
      res.status(200).json({ success: true });
    } else {
      res.status(STATUS_USER_ERROR).json({ error: 'The post doe ot exist' });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({ error: 'PLeae provide a valid id' });
  }
});


module.exports = { posts, server };

// TODO: your code to handle requests
// server.get('/posts', (req, res) => {
//   if (req.query.term) {
//     const term = req.query.term;
//     const post = posts.filter(p => p.title === true || p.content === true);
//     res.status(200).json(post);
//   } else {
//     res.status(200).json(posts);
//   }
// });
// server.delete('/posts', (req, res) => {
//   const { id } = req.body;
//   if (!id) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'Must provide a post id' });
//     return;
//   }
//   posts = posts.filter(p => p.id !== id);
//   res.json({ success: true });
// });

// server.put('/posts', (req, res) => {
//   const { id, title, contents } = req.body;

//   if (!id) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'Must provide a post id' });
//     return;
//   }
//   if (!title) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'Must provide a post title' });
//     return;
//   }
//   if (!contents) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'Must provide post contents' });
//     return;
//   }
//   const post = posts.find(p => p.id === Number(id));
//   if (!post) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: `Couldn't find a post with id ${id}` });
//     return;
//   }
//   post.title = title;
//   post.contents = contents;
//   res.json(post);
// });

// server.post('/posts', (req, res) => {
//   res.json(posts);
// });
