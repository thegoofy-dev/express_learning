import express from 'express'; // || const express = require('express');
import path from 'path'; // || const path = require('path');
import posts from './routes/posts.js';// || const posts = require('./routes/posts')


const PORT = process.env.PORT || 8080;
const app = express();

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// setup static folder
// app.use(express.static(path.join(__dirname, 'public'))); 

// app.get('/', (req,res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get("/about", (req,res) => {
//     res.sendFile(path.join(__dirname, 'public', 'about.html'));
// })

// JSON API ROUTE
app.use('/api/posts', posts);



app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))