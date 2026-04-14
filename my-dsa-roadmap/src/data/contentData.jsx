
import React from 'react';
import { Github, ShieldQuestion, Code, BookOpen, Lightbulb, Target, ChevronRight, ExternalLink, Zap, TrendingUp, Star, Award } from "lucide-react";

export function getDetailedNodeContent(nodeId) {
    const ContentCard = ({ icon: Icon, title, children, bgColor = "bg-gradient-to-br from-white to-gray-50", borderColor = "border-gray-200" }) => (
        <div className={`${bgColor} rounded-xl p-6 shadow-lg border ${borderColor} mb-6`}>
            <h3 className="font-bold text-gray-800 flex items-center gap-3 mb-4 text-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                {title}
            </h3>
            {children}
        </div>
    );

    const TechniqueItem = ({ technique, description, gradient = "from-blue-50 to-indigo-50" }) => (
        <div className={`bg-gradient-to-r ${gradient} rounded-lg p-4 border-l-4 border-blue-500 mb-3 transition-all hover:shadow-md hover:scale-[1.01]`}>
            <div className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                    <span className="font-semibold text-gray-800">{technique}:</span>
                    <p className="text-gray-600 mt-1 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );

    const ProTip = ({ children, color = "blue" }) => {
        const colors = {
            blue: "bg-blue-50 border-blue-400 text-blue-800",
            green: "bg-green-50 border-green-400 text-green-800",
            purple: "bg-purple-50 border-purple-400 text-purple-800",
            orange: "bg-orange-50 border-orange-400 text-orange-800",
            teal: "bg-teal-50 border-teal-400 text-teal-800"
        };
        return (
            <div className={`${colors[color]} p-4 rounded-lg border-l-4 mt-4`}>
                <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium leading-relaxed">{children}</p>
                </div>
            </div>
        );
    };

    const content = {
        root: (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-xl">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Master DSA Patterns</h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        Transform your coding skills by mastering these fundamental patterns. Each pattern is a key that unlocks hundreds of similar problems.
                    </p>
                </div>
                
                <ContentCard 
                    icon={Target} 
                    title="Why Pattern-Based Learning?" 
                    bgColor="bg-gradient-to-br from-purple-50 to-pink-50" 
                    borderColor="border-purple-200"
                >
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Instead of memorizing hundreds of solutions, learn the underlying techniques that solve entire classes of problems. 
                            This approach builds intuition and helps you tackle new problems confidently.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                                <h4 className="font-semibold text-gray-800 mb-2">Pattern Recognition</h4>
                                <p className="text-gray-600 text-sm">Learn to identify which pattern applies to new problems instantly</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                                <h4 className="font-semibold text-gray-800 mb-2">Exponential Growth</h4>
                                <p className="text-gray-600 text-sm">Master one pattern, solve dozens of related problems</p>
                            </div>
                        </div>
                    </div>
                </ContentCard>

                <div className="text-center">
                    <a 
                        href="https://github.com/Guptaditya27/DSA-mastery-project" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl hover:from-gray-800 hover:to-gray-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                        <Github className="w-6 h-6" /> 
                        <span>Explore Complete Repository</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>
        ),

        arrays: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Foundation of Computing">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Arrays store elements in contiguous memory locations, providing lightning-fast O(1) access by index. 
                            This contiguous storage makes sequential iteration extremely efficient due to CPU cache locality benefits.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Key Insight:</strong> Strings are essentially immutable arrays of characters, so most array techniques 
                            directly apply to string manipulation problems.
                        </p>
                        <ProTip color="blue">
                            Array problems often have multiple solutions with different time-space tradeoffs. Always consider if you can 
                            trade O(1) space for O(n) time or vice versa.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Essential Techniques" bgColor="bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Two Pointers" 
                            description="Use two indices to traverse the array, often from opposite ends or at different speeds. Perfect for finding pairs, checking palindromes, or removing duplicates in O(n) time with O(1) space."
                            gradient="from-blue-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="Sliding Window" 
                            description="Maintain a dynamic subarray that expands and contracts based on conditions. Transforms nested loop problems (O(n²)) into single-pass solutions (O(n)). Ideal for subarray optimization problems."
                            gradient="from-green-50 to-emerald-50"
                        />
                        <TechniqueItem 
                            technique="Prefix Sum" 
                            description="Pre-calculate cumulative sums to answer range sum queries in O(1) time after O(n) preprocessing. Extends to prefix XOR, prefix products, and 2D prefix sums for matrix problems."
                            gradient="from-purple-50 to-violet-50"
                        />
                        <TechniqueItem 
                            technique="Dutch National Flag" 
                            description="Partition arrays into three sections using two pointers. Classic for sorting arrays with three distinct values or colors in a single pass."
                            gradient="from-orange-50 to-red-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        hashing: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="The Speed Multiplier">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Hash Tables use hash functions to map keys to array indices, providing average-case O(1) time complexity 
                            for insertions, deletions, and lookups. They're the secret weapon for transforming slow algorithms into fast ones.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Trade-off:</strong> Exchange space for time. Most O(n²) brute force solutions can be optimized 
                            to O(n) using hash tables by storing what you've seen.
                        </p>
                        <ProTip color="green">
                            When you find yourself writing nested loops to search for something you've seen before, 
                            think hash table! The pattern is: "For each element, check if its complement exists."
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Power Patterns" bgColor="bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Frequency Counting" 
                            description="Track occurrences of elements to solve anagram detection, character permutations, and duplicate finding. The foundation for many string and array problems."
                            gradient="from-green-50 to-emerald-50"
                        />
                        <TechniqueItem 
                            technique="Two-Sum Pattern" 
                            description="For each element X, check if 'target - X' exists in the hash map. This pattern extends to 3Sum, 4Sum, and complex combination problems. Store elements as you iterate."
                            gradient="from-orange-50 to-red-50"
                        />
                        <TechniqueItem 
                            technique="Sliding Window with HashMap" 
                            description="Combine sliding window with frequency maps to handle complex substring problems with conditions like 'at most K distinct characters' or 'longest substring without repeating characters'."
                            gradient="from-purple-50 to-violet-50"
                        />
                        <TechniqueItem 
                            technique="Memoization" 
                            description="Store results of expensive function calls to avoid recalculation. Essential for optimizing recursive algorithms and dynamic programming solutions."
                            gradient="from-blue-50 to-cyan-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        trees: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Hierarchical Thinking">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Trees represent hierarchical relationships with a root node and child nodes. They naturally model 
                            recursive problems and are fundamental to many algorithms and data structures.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Key Types:</strong> Binary Trees (≤2 children), Binary Search Trees (ordered), N-ary trees, 
                            and specialized trees like Heaps, Tries, and Segment Trees.
                        </p>
                        <ProTip color="orange">
                            Most tree problems have elegant recursive solutions. Think: "What do I do at this node, 
                            and how do I combine results from my children?" Always define your base case first!
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Traversal Mastery" bgColor="bg-gradient-to-br from-orange-50 to-red-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Depth-First Search (DFS)" 
                            description="Three flavors: In-order (left→root→right) gives sorted order in BST, Pre-order (root→left→right) for tree copying, Post-order (left→right→root) for deletion and calculations."
                            gradient="from-orange-50 to-red-50"
                        />
                        <TechniqueItem 
                            technique="Breadth-First Search (BFS)" 
                            description="Level-order traversal using a queue. Perfect for finding shortest paths, calculating tree width, level-based operations, and tree serialization."
                            gradient="from-blue-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="Tree DP" 
                            description="Dynamic programming on trees. Calculate answers for subtrees and combine them. Classic examples: tree diameter, maximum path sum, and subtree problems."
                            gradient="from-purple-50 to-violet-50"
                        />
                        <TechniqueItem 
                            technique="Tree Construction" 
                            description="Build trees from traversals, serialize/deserialize trees, and validate tree properties. Understanding how trees are represented is crucial for many problems."
                            gradient="from-green-50 to-emerald-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        dynamic: (
            <div className="space-y-6">
                <ContentCard icon={Zap} title="Optimization Through Memory">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Dynamic Programming solves complex problems by breaking them into simpler, overlapping subproblems. 
                            By storing solutions, we avoid redundant calculations and achieve dramatic performance improvements.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Recognition:</strong> Look for problems with optimal substructure (optimal solution contains 
                            optimal solutions to subproblems) and overlapping subproblems (same subproblems solved multiple times).
                        </p>
                        <ProTip color="purple">
                            DP Formula: Identify states → Define recurrence relation → Handle base cases → Optimize space. 
                            Start with recursive solution, add memoization, then convert to iterative if needed.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="DP Strategies" bgColor="bg-gradient-to-br from-yellow-50 to-orange-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Memoization (Top-Down)" 
                            description="Start from the main problem and recursively break it down, caching results in a hash map or array. Natural approach that follows problem thinking but may have recursion overhead."
                            gradient="from-yellow-50 to-orange-50"
                        />
                        <TechniqueItem 
                            technique="Tabulation (Bottom-Up)" 
                            description="Start from base cases and build up to the final solution iteratively using a DP table. Often more space-efficient and avoids recursion stack limitations."
                            gradient="from-green-50 to-emerald-50"
                        />
                        <TechniqueItem 
                            technique="Space Optimization" 
                            description="Many DP solutions only need the previous row/column of the table. Use rolling arrays or variables to reduce O(n²) space to O(n) or even O(1)."
                            gradient="from-blue-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="State Compression" 
                            description="Use bitmasks to represent states efficiently when dealing with subsets or boolean states. Common in problems involving visiting cities, selecting items, or toggling switches."
                            gradient="from-purple-50 to-violet-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        search: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Finding Needles in Haystacks">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Search algorithms efficiently locate specific elements or determine optimal solutions. Binary Search 
                            stands out as the most versatile pattern - it's not just for sorted arrays!
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Binary Search Insight:</strong> Works on any monotonic function where you can determine 
                            if you're too high or too low. Use it to search answer spaces, not just sorted arrays.
                        </p>
                        <ProTip color="teal">
                            Binary search template: while (left &lt; right) → Always converges. Think about invariants: 
                            what properties does your search space maintain?
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Search Techniques" bgColor="bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Binary Search on Arrays" 
                            description="Classic O(log n) search in sorted arrays. Variations include finding first/last occurrence, searching in rotated arrays, and finding peak elements."
                            gradient="from-indigo-50 to-purple-50"
                        />
                        <TechniqueItem 
                            technique="Binary Search on Answer" 
                            description="When answer lies in a range and you can verify if a value works, binary search the answer space. Common in optimization problems: 'minimum maximum' or 'maximum minimum'."
                            gradient="from-green-50 to-emerald-50"
                        />
                        <TechniqueItem 
                            technique="Sorting Fundamentals" 
                            description="Merge Sort (stable, O(n log n), good for external sorting), Quick Sort (in-place, average O(n log n)), Heap Sort (O(n log n) worst case). Know when to use each."
                            gradient="from-blue-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="Custom Comparators" 
                            description="Define custom sorting logic for complex objects. Essential for interval problems, string sorting by length, and multi-criteria sorting."
                            gradient="from-orange-50 to-red-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        twoptr: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Double the Power">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Two Pointers is one of the most elegant patterns in programming. By using two indices strategically, 
                            we can solve complex problems with linear time complexity and constant space.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Universal Power:</strong> Reduces O(n²) nested loop solutions to O(n) single-pass solutions. 
                            Works on arrays, strings, linked lists, and even conceptual spaces.
                        </p>
                        <ProTip color="blue">
                            Two pointers work when you can make progress by moving one pointer based on some condition. 
                            The key insight: moving pointers eliminates possibilities, making the search efficient.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Pointer Strategies" bgColor="bg-gradient-to-br from-pink-50 to-rose-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Opposite Direction" 
                            description="Pointers start at opposite ends and move toward each other. Perfect for pair finding (Two Sum in sorted array), palindrome checking, and container with most water problems."
                            gradient="from-pink-50 to-rose-50"
                        />
                        <TechniqueItem 
                            technique="Same Direction (Fast & Slow)" 
                            description="Both pointers move in the same direction at different speeds. Floyd's cycle detection, finding middle of linked list, and removing duplicates. Also called 'tortoise and hare'."
                            gradient="from-cyan-50 to-blue-50"
                        />
                        <TechniqueItem 
                            technique="Sliding Window Pointers" 
                            description="Left and right pointers define a window that slides through the data. The window expands (move right) or contracts (move left) based on conditions."
                            gradient="from-green-50 to-emerald-50"
                        />
                        <TechniqueItem 
                            technique="Partition Pointers" 
                            description="Use pointers to partition arrays around pivot elements. Essential for quicksort, Dutch national flag problem, and moving zeros to end."
                            gradient="from-purple-50 to-violet-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        sliding: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Dynamic Windows of Opportunity">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Sliding Window creates a dynamic "frame" that moves through data to efficiently find optimal 
                            contiguous sections. It's like having a smart magnifying glass that resizes based on what you're looking for.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Efficiency Boost:</strong> Transforms O(n³) or O(n²) brute force solutions into O(n) 
                            linear solutions by avoiding redundant calculations when the window moves.
                        </p>
                        <ProTip color="teal">
                            Sliding window works when the problem asks for contiguous elements and you can maintain 
                            some information about the current window (sum, count, max, etc.) as it slides.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Window Variations" bgColor="bg-gradient-to-br from-teal-50 to-cyan-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Fixed Size Window" 
                            description="Window size remains constant as it slides. Perfect for problems asking about exactly K elements: maximum sum of K elements, average of K elements, or K-distinct character windows."
                            gradient="from-teal-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="Variable Size Window" 
                            description="Window grows and shrinks based on conditions. Use two pointers: expand right when possible, contract left when necessary. Great for 'longest/shortest subarray with condition'."
                            gradient="from-emerald-50 to-green-50"
                        />
                        <TechniqueItem 
                            technique="String Pattern Matching" 
                            description="Use sliding window with hash maps to find anagrams, permutations, or patterns in strings. Track character frequencies in current window and compare with target."
                            gradient="from-purple-50 to-violet-50"
                        />
                        <TechniqueItem 
                            technique="Multiple Windows" 
                            description="Sometimes you need multiple sliding windows or a window that 'jumps' to new positions. Advanced technique for complex optimization problems."
                            gradient="from-orange-50 to-red-50"
                        />
                    </div>
                </ContentCard>
            </div>
        ),

        backtrack: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Systematic Exploration">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Backtracking is intelligent brute force - it builds solutions incrementally and abandons 
                            ("backtracks from") partial solutions that cannot lead to a complete solution.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>When to Use:</strong> Constraint satisfaction problems, finding all solutions 
                            (not just optimal), combinatorial problems like permutations, combinations, and puzzles.
                        </p>
                        <ProTip color="purple">
                            Backtracking template: Make a choice → Explore consequences → Undo choice → Try next option. 
                            Always think about what constitutes a "choice" in your problem space.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Award} title="The Sacred Algorithm" bgColor="bg-gradient-to-br from-violet-50 to-purple-50">
                    <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-8 rounded-2xl border-2 border-violet-300 shadow-lg">
                        <div className="text-center">
                            <h4 className="text-3xl font-bold text-violet-800 mb-6">Choose → Explore → Unchoose</h4>
                            <div className="space-y-4 text-left">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <span className="font-bold text-violet-700">Choose:</span>
                                    <span className="text-gray-700 ml-2">Make a decision (add element, place queen, etc.)</span>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <span className="font-bold text-violet-700">Explore:</span>
                                    <span className="text-gray-700 ml-2">Recursively explore this path</span>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <span className="font-bold text-violet-700">Unchoose:</span>
                                    <span className="text-gray-700 ml-2">Undo the choice to try alternatives</span>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4 italic">
                                This three-step dance solves permutations, combinations, N-Queens, Sudoku, and countless other problems!
                            </p>
                        </div>
                    </div>
                </ContentCard>
            </div>
        ),

        heap: (
            <div className="space-y-6">
                <ContentCard icon={ShieldQuestion} title="Priority Management">
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Heaps are specialized binary trees that maintain parent-child ordering (heap property). 
                            They're the engine behind Priority Queues, enabling efficient access to minimum or maximum elements.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Key Operations:</strong> Insert O(log n), Extract-min/max O(log n), Peek O(1). 
                            Perfect for problems requiring repeated access to extreme values.
                        </p>
                        <ProTip color="green">
                            Think "heap" when you see "top K", "median", "merge K sorted", or any problem requiring 
                            efficient priority-based access. Heaps turn O(n²) problems into O(n log k) solutions.
                        </ProTip>
                    </div>
                </ContentCard>

                <ContentCard icon={Code} title="Heap Applications" bgColor="bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="space-y-4">
                        <TechniqueItem 
                            technique="Top K Problems" 
                            description="Use a min-heap of size K to find K largest elements, or max-heap of size K for K smallest. Efficiently handles streaming data where you can't store everything."
                            gradient="from-emerald-50 to-teal-50"
                        />
                        <TechniqueItem 
                            technique="Running Median" 
                            description="Use two heaps: max-heap for smaller half, min-heap for larger half. Balance the heaps to keep median at heap tops. Perfect for streaming data problems."
                            gradient="from-blue-50 to-cyan-50"
                        />
                        <TechniqueItem 
                            technique="Merge K Sorted Arrays" 
                            description="Use a min-heap to efficiently merge multiple sorted streams. Each heap element tracks value and source array. Time complexity: O(N log K) where N is total elements."
                            gradient="from-purple-50 to-violet-50"
                        />
                        <TechniqueItem 
                            technique="Graph Algorithms" 
                            description="Heaps power Dijkstra's shortest path and Prim's minimum spanning tree algorithms. They ensure you always process the most promising node/edge next."
                            gradient="from-orange-50 to-red-50"
                        />
                    </div>
                </ContentCard>
            </div>
        )
    };

    return content[nodeId] || (
        <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl mb-4 shadow-lg">
                <ShieldQuestion className="w-8 h-8 text-white" />
            </div>
            <ContentCard icon={ShieldQuestion} title="Coming Soon!">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">
                        Detailed content for <span className="font-semibold capitalize text-gray-800">{nodeId}</span> is being crafted! 
                    </p>
                    <p className="text-gray-500">
                        This section will cover essential patterns, techniques, and insights to master this important topic.
                    </p>
                </div>
            </ContentCard>
        </div>
    );
}