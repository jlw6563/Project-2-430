const models = require('../models');

const { Post } = models;

const Feed = (req, res) => res.render('app'); // Need to fix this

// This is good
const makePost = async (req, res) => {
  // This is good
  if (!req.body.text) {
    return res.status(400).json({ error: 'Text required' });
  }

  // This is good
  const postData = {
    text: req.body.text,
    owner: req.session.account._id,
  };

  try {
    const newPost = new Post(postData);
    await newPost.save();
    return res.status(201).json({
      text: newPost.text,
      owner: newPost.owner,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured making post!' });
  }
};

// Need to rework this for followers
const getPosts = async (req, res) => {
  try {
    const docs = await Post.find({})
      .sort({ createdDate: -1 }) // Get the newest post
      .populate('owner') // Will take the Owner aspect and return it as the username instead https://www.geeksforgeeks.org/mongodb/mongoose-populate-method/
      .lean()
      .exec();
    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

// Maybe make a different function for getting followers posts

module.exports = {
  Feed,
  makePost,
  getPosts,
};
