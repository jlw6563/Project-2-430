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
    const account = await models.Account.findOne({ username: req.session.account.username }).lean().exec();
    let posts = await models.Post.aggregate([
      {$sort : {createdDate: -1}},
      {
        $project:
        {
          text: 1,
          owner: 1,
          following: {
            $in: ['$owner', account.following],
          },
        },
      },
    ]);

    
    return res.json({ posts: models.Account.populate(posts, "owner") });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// Maybe make a different function for getting followers posts

module.exports = {
  Feed,
  makePost,
  getPosts,
};
