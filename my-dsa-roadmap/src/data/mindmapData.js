
// const createNode = (id, label, x, y, examples = [], w = 200, h = 80, level = 1, color = "#3b82f6", timeComplexity = "", spaceComplexity = "", keyInsight = "") => ({ id, label, x, y, w, h, examples, level, color, timeComplexity, spaceComplexity, keyInsight });

// export const nodes = [
//   createNode("root", "DSA Master Patterns", 650, 50, ["Master fundamentals first", "Identify pattern families"], 320, 90, 0, "#6366f1"),
//   createNode("arrays", "Arrays & Strings", 100, 200, ["Two pointers, sliding window"], 240, 85, 1, "#10b981", "O(n)", "O(1)", "Sequential processing"),
//   createNode("hashing", "Hash Tables", 380, 200, ["Fast lookups O(1)"], 240, 85, 1, "#f59e0b", "O(1) avg", "O(n)", "Constant time access"),
//   createNode("trees", "Trees & Graphs", 660, 200, ["DFS/BFS traversals"], 240, 85, 1, "#3b82f6", "O(V+E)", "O(V)", "Recursive structure"),
//   createNode("dynamic", "Dynamic Programming", 940, 200, ["Optimal substructure"], 240, 85, 1, "#8b5cf6", "O(n²)", "O(n)", "Build solutions bottom-up"),
//   createNode("search", "Search & Sort", 1220, 200, ["Binary search variations"], 240, 85, 1, "#ef4444", "O(log n)", "O(1)", "Divide search space"),
//   createNode("twoptr", "Two Pointers", 50, 350, ["Find pairs, move inward"], 180, 70, 2, "#059669"),
//   createNode("sliding", "Sliding Window", 250, 350, ["Track window, optimize"], 180, 70, 2, "#0891b2"),
//   createNode("hashmap", "Hash Map", 450, 350, ["Key-value storage"], 180, 70, 2, "#d97706"),
//   createNode("binary", "Binary Search", 650, 350, ["Divide and conquer"], 180, 70, 2, "#7c3aed"),
//   createNode("bfs", "BFS", 850, 350, ["Level-order traversal"], 180, 70, 2, "#dc2626"),
//   createNode("dfs", "DFS", 1050, 350, ["Depth-first traversal"], 180, 70, 2, "#1d4ed8"),
//   createNode("greedy", "Greedy", 150, 500, ["Best choice at each step"], 160, 60, 3, "#ca8a04"),
//   createNode("backtrack", "Backtracking", 350, 500, ["Try all possibilities"], 160, 60, 3, "#be123c"),
//   createNode("stack", "Stack", 550, 500, ["LIFO operations"], 160, 60, 3, "#7c2d12"),
//   createNode("queue", "Queue", 750, 500, ["FIFO operations"], 160, 60, 3, "#0c4a6e"),
//   createNode("heap", "Heap (Priority Queue)", 950, 500, ["Efficient min/max"], 200, 60, 3, "#166534"),
// ];

// export const edges = [
//   { from: "root", to: "arrays", type: "parent" }, { from: "root", to: "hashing", type: "parent" },
//   { from: "root", to: "trees", type: "parent" }, { from: "root", to: "dynamic", type: "parent" },
//   { from: "root", to: "search", type: "parent" }, { from: "arrays", to: "twoptr", type: "child" },
//   { from: "arrays", to: "sliding", type: "child" }, { from: "hashing", to: "hashmap", type: "child" },
//   { from: "search", to: "binary", type: "child" }, { from: "trees", to: "bfs", type: "child" },
//   { from: "trees", to: "dfs", type: "child" }, { from: "bfs", to: "queue", type: "child" },
//   { from: "dfs", to: "stack", type: "child" }, { from: "dfs", to: "backtrack", type: "child" },
//   { from: "dynamic", to: "greedy", type: "mix" }, { from: "twoptr", to: "sliding", type: "mix" },
//   { from: "bfs", to: "dfs", type: "mix" },
// ];