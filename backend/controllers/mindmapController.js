import mongoose from 'mongoose';
import Edge from '../models/Edge.js';
import MindmapNode from '../models/MindmapNode.js';
import Problem from '../models/Problem.js';

export async function getMindmapData(req, res) {
  try {
    const nodes = await MindmapNode.find();
    const edges = await Edge.find();

    const defaultNodes = [
        { id: 'root', label: 'DSA Master Patterns', x: 650, y: 50, w: 320, h: 90, color: '#6366f1', examples: ['Master fundamentals first'], level: 0 },
        { id: 'arrays', label: 'Arrays & Strings', x: 100, y: 200, w: 240, h: 85, color: '#10b981', examples: ['Two pointers, sliding window'], level: 1, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
        { id: 'hashing', label: 'Hash Tables', x: 380, y: 200, w: 240, h: 85, color: '#f59e0b', examples: ['Fast lookups O(1)'], level: 1, timeComplexity: 'O(1) avg' },
        { id: 'trees', label: 'Trees & Graphs', x: 660, y: 200, w: 240, h: 85, color: '#3b82f6', examples: ['DFS/BFS traversals'], level: 1, timeComplexity: 'O(V+E)' },
        { id: 'dynamic', label: 'Dynamic Programming', x: 940, y: 200, w: 240, h: 85, color: '#8b5cf6', examples: ['Optimal substructure'], level: 1, timeComplexity: 'O(n²)' },
        { id: 'search', label: 'Search & Sort', x: 1220, y: 200, w: 240, h: 85, color: '#ef4444', examples: ['Binary search variations'], level: 1, timeComplexity: 'O(log n)' },
        { id: 'twoptr', label: 'Two Pointers', x: 50, y: 350, w: 180, h: 70, color: '#059669', examples: ['Find pairs, move inward'], level: 2 },
        { id: 'sliding', label: 'Sliding Window', x: 250, y: 350, w: 180, h: 70, color: '#0891b2', examples: ['Track window, optimize'], level: 2 },
        { id: 'hashmap', label: 'Hash Map', x: 450, y: 350, w: 180, h: 70, color: '#d97706', examples: ['Key-value storage'], level: 2 },
        { id: 'binary', label: 'Binary Search', x: 650, y: 350, w: 180, h: 70, color: '#7c3aed', examples: ['Divide and conquer'], level: 2 },
        { id: 'bfs', label: 'BFS', x: 850, y: 350, w: 180, h: 70, color: '#dc2626', examples: ['Level-order traversal'], level: 2 },
        { id: 'dfs', label: 'DFS', x: 1050, y: 350, w: 180, h: 70, color: '#1d4ed8', examples: ['Depth-first traversal'], level: 2 },
        { id: 'greedy', label: 'Greedy', x: 150, y: 500, w: 160, h: 60, color: '#ca8a04', examples: ['Best choice at each step'], level: 3 },
        { id: 'backtrack', label: 'Backtracking', x: 350, y: 500, w: 160, h: 60, color: '#be123c', examples: ['Try all possibilities'], level: 3 },
        { id: 'stack', label: 'Stack', x: 550, y: 500, w: 160, h: 60, color: '#7c2d12', examples: ['LIFO operations'], level: 3 },
        { id: 'queue', label: 'Queue', x: 750, y: 500, w: 160, h: 60, color: '#0c4a6e', examples: ['FIFO operations'], level: 3 },
        { id: 'heap', label: 'Heap (Priority Queue)', x: 950, y: 500, w: 200, h: 60, color: '#166534', examples: ['Efficient min/max'], level: 3 },
        { id: 'linkedlist', label: 'Linked List', x: 250, y: 200, w: 220, h: 80, color: '#0ea5a4', examples: ['Pointers, slow/fast'], level: 1 },
        { id: 'graphs', label: 'Graphs', x: 860, y: 200, w: 260, h: 90, color: '#ef8354', examples: ['Nodes + edges, many algorithms'], level: 1 },
        { id: 'trie', label: 'Trie (Prefix Tree)', x: 1040, y: 200, w: 220, h: 80, color: '#06b6d4', examples: ['Prefix search, autocomplete'], level: 1 },
        { id: 'matrix', label: 'Matrix', x: 1220, y: 350, w: 220, h: 80, color: '#8b5cf6', examples: ['2D traversal, DP on grids'], level: 2 },
        { id: 'bit', label: 'Bit Manipulation', x: 50, y: 500, w: 180, h: 70, color: '#2563eb', examples: ['XOR, shifts, masks'], level: 3 },
        { id: 'unionfind', label: 'Union-Find', x: 450, y: 500, w: 200, h: 70, color: '#334155', examples: ['Disjoint set, connected components'], level: 3 },
        { id: 'segment', label: 'Segment Tree / BIT', x: 950, y: 500, w: 220, h: 70, color: '#16a34a', examples: ['Range queries, updates'], level: 3 },
        { id: 'prefix', label: 'Prefix Sum', x: 350, y: 650, w: 180, h: 60, color: '#db2777', examples: ['Cumulative sums for ranges'], level: 4 },
        { id: 'topo', label: 'Topological Sort', x: 1150, y: 500, w: 200, h: 60, color: '#ef4444', examples: ['Order DAG nodes'], level: 3 },
        { id: 'geometry', label: 'Geometry', x: 1250, y: 500, w: 220, h: 60, color: '#0ea5a4', examples: ['Coordinates, convex hull'], level: 3 },
      ];

    const defaultEdges = [
        { from: 'root', to: 'arrays', type: 'parent' }, { from: 'root', to: 'hashing', type: 'parent' },
        { from: 'root', to: 'trees', type: 'parent' }, { from: 'root', to: 'dynamic', type: 'parent' },
        { from: 'root', to: 'search', type: 'parent' }, { from: 'arrays', to: 'twoptr', type: 'child' },
        { from: 'arrays', to: 'sliding', type: 'child' }, { from: 'hashing', to: 'hashmap', type: 'child' },
        { from: 'search', to: 'binary', type: 'child' }, { from: 'trees', to: 'bfs', type: 'child' },
        { from: 'trees', to: 'dfs', type: 'child' }, { from: 'bfs', to: 'queue', type: 'child' },
        { from: 'dfs', to: 'stack', type: 'child' }, { from: 'dfs', to: 'backtrack', type: 'child' },
        { from: 'dynamic', to: 'greedy', type: 'mix' }, { from: 'twoptr', to: 'sliding', type: 'mix' },
        { from: 'bfs', to: 'dfs', type: 'mix' }, { from: 'arrays', to: 'linkedlist', type: 'sibling' },
        { from: 'root', to: 'linkedlist', type: 'parent' }, { from: 'root', to: 'graphs', type: 'parent' },
        { from: 'graphs', to: 'bfs', type: 'child' }, { from: 'graphs', to: 'dfs', type: 'child' },
        { from: 'graphs', to: 'unionfind', type: 'child' }, { from: 'search', to: 'matrix', type: 'related' },
        { from: 'root', to: 'trie', type: 'parent' }, { from: 'root', to: 'bit', type: 'parent' },
        { from: 'root', to: 'segment', type: 'parent' }, { from: 'dynamic', to: 'prefix', type: 'related' },
        { from: 'graphs', to: 'topo', type: 'related' }, { from: 'matrix', to: 'segment', type: 'mix' },
      ];

    // Helper to compute stable node key (prefer explicit id; fallback to slugified label)
    const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const nodeKey = (n) => n.id || slug(n.label || n.title || n._id);

    // Convert DB docs to plain objects and index by key
    const dbNodes = (nodes || []).map(n => (typeof n.toObject === 'function' ? n.toObject() : n));
    const dbEdges = (edges || []).map(e => (typeof e.toObject === 'function' ? e.toObject() : e));

    const nodeMap = new Map();
    // Add DB nodes first (preserve user/saved nodes)
    dbNodes.forEach(n => nodeMap.set(nodeKey(n), { ...n, id: n.id || nodeKey(n) }));
    // Add default nodes if missing
    defaultNodes.forEach(n => { const k = nodeKey(n); if (!nodeMap.has(k)) nodeMap.set(k, n); });

    const mergedNodes = Array.from(nodeMap.values());

    // Merge edges, deduplicate by a key
    const edgeKey = (e) => `${e.from}->${e.to}->${e.type}`;
    const edgeMap = new Map();
    dbEdges.forEach(e => edgeMap.set(edgeKey(e), e));
    defaultEdges.forEach(e => { const k = edgeKey(e); if (!edgeMap.has(k)) edgeMap.set(k, e); });
    const mergedEdges = Array.from(edgeMap.values());

    return res.status(200).json({ mindmap: { nodes: mergedNodes, edges: mergedEdges } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mindmap data', error });
  }
}

export async function createNode(req, res) {
  try {
    const node = await MindmapNode.create(req.body);
    res.status(201).json(node);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create node', error: err.message });
  }
}

export async function updateNode(req, res) {
  try {
    const node = await MindmapNode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(node);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update node', error: err.message });
  }
}

export async function deleteNode(req, res) {
  try {
    await MindmapNode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Node deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete node', error: err.message });
  }
}

// export async function getProblems(req, res) {
//   try {
//     console.log('Getting problems...');
    
//     // Try to get problems from database first
//     let problems = await Problem.find();
//     console.log(`Found ${problems?.length || 0} problems in database`);
    
//     // If no problems in database, load from seedData
//     if (!problems || problems.length === 0) {
//       console.log('No problems in database, loading from seedData...');
//       try {
//         // Import the seed data
//         const { problemsData } = await import('../utils/seedData.js');
        
//         // Directly use the problemsData array which is already in the correct format
//         if (problemsData && problemsData.length > 0) {
//           console.log('Seeding database with', problemsData.length, 'problems');
        
//         // Convert rawProblems into the format expected by the frontend
//         const defaultProblems = [];
//         for (const [nodeId, problemList] of Object.entries(rawProblems)) {
//           console.log(`Processing ${problemList.length} problems for node ${nodeId}`);
//           for (const problem of problemList) {
//             defaultProblems.push({
//               nodeId,
//               name: problem.name,
//               title: problem.name,
//               difficulty: problem.difficulty,
//               description: problem.description || '',
//               link: problem.link || ''
//             });
//           }
//         }

//         console.log(`Created ${defaultProblems.length} problem objects to insert`);

//         // Save all problems to database
//         if (defaultProblems.length > 0) {
//           problems = await Problem.insertMany(defaultProblems);
//           console.log(`Successfully seeded ${problems.length} problems to database`);
//         }
//       } catch (seedErr) {
//         console.error('Error seeding problems:', seedErr);
//         return res.status(500).json({ message: 'Error seeding problems from data file', error: seedErr.message });
//       }
//     }

//     console.log(`Sending ${problems?.length || 0} problems to frontend`);
//     // Send response even if empty (but after trying to seed)
//     res.json(problems || []);
//   } catch (err) {
//     console.error('Error in getProblems:', err);
//     res.status(500).json({ message: 'Failed to get problems', error: err.message });
//   }
// }
export async function getProblems(req, res) {
  try {
    console.log('Getting problems...');
    console.log('MongoDB Connection State:', mongoose.connection.readyState);
    console.log('MongoDB Connection String:', process.env.MONGO_URI);
    
    // Check MongoDB connection
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected. Current state:', mongoose.connection?.readyState);
      throw new Error('Database connection is not ready');
    }

    // Try to get problems from database first
    let problems = await Problem.find();
    console.log(`Found ${problems?.length || 0} problems in database`);
    
    // If no problems in database, load from seedData
    if (!problems || problems.length === 0) {
      console.log('No problems in database, loading from seedData...');
      try {
        const { problemsData } = await import('../utils/seedData.js');
        console.log('Loaded seed data, problems found:', problemsData?.length);
        
        if (problemsData && problemsData.length > 0) {
          console.log('Attempting to insert problems...');
          // Save all problems to database
          problems = await Problem.insertMany(problemsData);
          console.log(`Successfully seeded ${problems.length} problems to database`);
        } else {
          console.log('No problems found in seed data');
          return res.json([]);
        }
      } catch (seedError) {
        console.error('Error loading seed data:', seedError);
        console.error('Full error:', seedError);
        throw new Error('Failed to load seed data: ' + seedError.message);
      }
    }

    // Convert problems to plain objects and ensure all required fields
    const processedProblems = problems.map(p => {
      const problem = p.toObject ? p.toObject() : p;
      return {
        ...problem,
        name: problem.name || '',
        title: problem.title || problem.name || '',
        difficulty: problem.difficulty || 'Medium',
        description: problem.description || '',
        nodeId: problem.nodeId || ''
      };
    });

    console.log(`Sending ${processedProblems.length} problems to frontend`);
    console.log('Sample problem:', processedProblems[0]);
    res.json(processedProblems);
  } catch (err) {
    console.error('Error in getProblems:', err);
    console.error('Full error object:', err);
    res.status(500).json({ 
      message: 'Failed to get problems',
      error: err.message,
      connectionState: mongoose.connection.readyState,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
export async function createProblem(req, res) {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create problem', error: err.message });
  }
}

export async function updateProblem(req, res) {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(problem);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update problem', error: err.message });
  }
}

export async function deleteProblem(req, res) {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete problem', error: err.message });
  }
}




