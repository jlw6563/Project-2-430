const models = require('../models');

const { Post } = models;

// Serves the feed page
const Feed = (req, res) => res.render('app'); // Need to fix this

// Creates a new post and stores it in the database
const makePost = async (req, res) => {
  // Errors out if there is no body in the text
  if (!req.body.text) {
    return res.status(400).json({ error: 'Text required' });
  }

  // Creates the post as js object
  const postData = {
    text: req.body.text,
    owner: req.session.account._id,
  };

  // Attempts to add post to database
  try {
    // Makes post and saves it to the database
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

// Gets all the posts from the database
const getPosts = async (req, res) => {
  try {
    // Get the logged in user
    const account = await models.Account.findOne({ username: req.session.account.username })
      .lean().exec();

    // Goes through all the posts
    const posts = await models.Post.aggregate([
      { $sort: { createdDate: -1 } },
      {
        // Links the data from the owner id to the Account it is connected to
        // Relational data
        $lookup: {
          from: 'accounts',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      // Makes the owner value no longer an array so we can send it back
      { $unwind: '$owner' },
      {
        // Sends this part along using project
        $project:
        {
          // Keep text the same
          text: 1,

          // We add in new values based on the posters Account
          // add username verified, and owner id
          username: '$owner.username',
          verified: '$owner.verified',
          ownerId: '$owner._id',

          // Adds boolean if the current logged in account is following the poster
          following: {
            $in: ['$owner._id', account.following],
          },

          // Adds a bool if the current logged in account made this posts
          owns: {
            $eq: ['$owner._id', account._id],
          },
        },
      },
    ]);
    return res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// Reworked version of the getPosts that adds a match to only get posts of accounts the user follows
const getFollowingPosts = async (req, res) => {
  try {
    const account = await models.Account.findOne({ username: req.session.account.username })
      .lean().exec();
    const posts = await models.Post.aggregate([
      {
        $match: {
          owner: { $in: account.following },
        },
      },

      { $sort: { createdDate: -1 } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },

      {
        $project:
        {
          text: 1,
          username: '$owner.username',
          verified: '$owner.verified',
          ownerId: '$owner._id',
          following: {
            $in: ['$owner._id', account.following],
          },
          owns: {
            $eq: ['$owner._id', account._id],
          },
        },
      },
    ]);
    return res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

module.exports = {
  Feed,
  makePost,
  getPosts,
  getFollowingPosts,
};
