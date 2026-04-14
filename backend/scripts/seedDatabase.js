import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { nodesData, edgesData, problemsData } from '../utils/seedData.js';
import Problem from '../models/Problem.js';
import MindmapNode from '../models/MindmapNode.js';
import Edge from '../models/Edge.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Problem.deleteMany({}),
      MindmapNode.deleteMany({}),
      Edge.deleteMany({})
    ]);
    console.log('Existing data cleared');

    // Insert new data
    console.log('Inserting nodes...');
    await MindmapNode.insertMany(nodesData);
    console.log(`${nodesData.length} nodes inserted`);

    console.log('Inserting edges...');
    await Edge.insertMany(edgesData);
    console.log(`${edgesData.length} edges inserted`);

    console.log('Inserting problems...');
    await Problem.insertMany(problemsData);
    console.log(`${problemsData.length} problems inserted`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();