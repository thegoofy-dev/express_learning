import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';

mongoose.connect('mongodb://localhost:27017/express_tutorial')
.then(() => console.log('MongoDB connected to Database'))
.catch((err) => console.log(`Error : ${err}`));

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});