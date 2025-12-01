const { text } = require('express');
const models = require('../models');

const { Post } = models;


const Feed = (req, res) => res.render('app'); //Need to fix this

//This needs to be updated
const makePost = async (req, res) => {
    //This is good
    if (!req.body.text) {
        return res.status(400).json({ error: 'Text required' });
    }

    //This is good
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
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
};

//Need to rework this
const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age personality').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

module.exports = {
    Feed,
    makePost,
    getDomos,
};
