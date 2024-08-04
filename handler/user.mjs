import { User } from '../mongoose/schemas/user.mjs';  // Adjust the path to your model
import { validationResult } from 'express-validator';


export const getUserByIdHandler  = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send({ message: 'User Not Found' });
      return res.status(200).send(user);
  } catch (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
  }
}