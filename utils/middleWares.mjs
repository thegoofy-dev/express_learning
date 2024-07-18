import { animeCharac } from "./constants.mjs"; 
import { validationResult } from "express-validator";

// MIDDLEWARE
export const loggingMiddleware = (req, res, next) => {
    console.log(`MiddleWare 1 Used --> Method: ${req.method}, URL: ${req.url}`);
    next();
}

// MIDDLEWARE FOR USER's INDEX AND ID
export const resolveIndexByUserId = (req, res, next) => {
    const { params: {id} } = req;

    const ID = parseInt(id);
    // console.log(ID);
    
    // Check if ID is number or not
    if(isNaN(ID)) return res.status(400).send(`Please provide a valid ID!`);
    
    // Find the user index 
    const findUserIndex = animeCharac.findIndex((user) => user.id === ID);
    // console.log(`Index of id=${id} : ${findUserIndex}`);
    
    // Check if the findUserIndex is a valid or not
    if(findUserIndex === -1)
        return res.status(404).send({msg : "User Not Found!"});

    req.findUserIndex = findUserIndex;
    next();
}


