import express from 'express'; // || const express = require('express');
const router = express.Router();

let posts = [
    {id:1,name: 'John Doe', title : 'Post One'},
    {id:2,name: 'Jack Smith', title : 'Post Two'},
    {id:3,name: 'Alex Reyu', title : 'Post Three'},
];

const logger = (req,res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next();
}

// GET all posts
router.get('/', logger,(req, res) => {
    // console.log(req.query);
    const limit =  parseInt(req.query.limit);
    
    if(!isNaN(limit) && limit>0) {
        return res.status(200).json(posts.slice(0, limit));
    }

    res.status(200).json(posts)
});

// GET single posts
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const post =  posts.find((post) => post.id === id);
    if(!post) {
        return res.status(404).json({Message:`A post with id of ${id} was not found.`})
    }

    res.status(200).json(post);
});

// Create new post
router.post('/', (req,res) => {
    const newPost = {
        id : posts.length+1,
        name: req.body.name,
        title : req.body.title,        
    }
    if(!newPost.title || !newPost.name) {
        return res.status(400).json({Message: `Please include title or name both!`})
    }
    posts.push(newPost);
    res.status(201).json(posts);
})

// Update Post
router.put('/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if(!post) {
        return res.status(404).json({msg:`The request id of ${id} is not found`})
    }
    post.title = req.body.title;
    post.name = req.body.name;
    res.status(200).json(posts);
});

// Delete Post
router.delete('/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if(!post) {
        return res.status(404).json({msg:`The request id of ${id} is not found`})
    }
    posts = posts.filter((post) => post.id !== id);  
    res.status(200).json(posts);
});

export default router;// || module.exports = router;