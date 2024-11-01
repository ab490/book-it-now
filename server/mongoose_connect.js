// To connect to the MongoDB database
import mongoose from 'mongoose';

const uri = "mongodb+srv://anobajaj:mKKmFb5ISXB6Gmc4@bookitnow.onfe9.mongodb.net/";

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
