import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  description: { type: String },
  link: { type: String },
  nodeId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);

// import mongoose from 'mongoose';

// const problemSchema = mongoose.Schema({
//   // FIX: Changed 'title' to 'name' to match the incoming data from seedData.js
//   name: {
//     type: String,
//     required: true,
//   },
//   nodeId: {
//     type: String,
//     required: true,
//   },
//   difficulty: {
//     type: String,
//     required: true,
//   },
// });

// const Problem = mongoose.model('Problem', problemSchema);
// export default Problem;
