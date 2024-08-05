import { User } from '../mongoose/schemas/user.mjs';  // Adjust the path to your model
import { matchedData, validationResult } from 'express-validator';
import { hashPassword } from "../utils/helpers.mjs";


export const getUserByIdHandler  = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ msg : errors.array() });

  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send({ message: 'User Not Found' });
      return res.status(200).send(user);
  } catch (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const createUserHandler = async (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()) return res.status(400).send({ msg: error.array()});
  
  const data = matchedData(req);
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
  }
  catch (err) {
      console.log(err);
      return res.sendStatus(400);
  }
}