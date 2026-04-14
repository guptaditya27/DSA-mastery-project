

import React, { useState, useEffect } from "react";
import { login, register } from './api';
import { X } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [currentCode, setCurrentCode] = useState(0);
  const [demoAttempts, setDemoAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const codeSnippets = [
    "// Two Sum Pattern\nfor (int i = 0; i < n; i++) {\n  for (int j = i + 1; j < n; j++) {\n    if (nums[i] + nums[j] == target)\n      return {i, j};\n  }\n}",
    "// Sliding Window Pattern\nint left = 0, maxLen = 0;\nfor (int right = 0; right < n; right++) {\n  // expand window\n  while (condition) left++;\n  maxLen = max(maxLen, right - left + 1);\n}",
    "// Binary Search Pattern\nwhile (left <= right) {\n  mid = left + (right - left) / 2;\n  if (arr[mid] == target) return mid;\n  else if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}"
  ];

  const demoPattern = {
    title: "Two Sum Pattern",
    description: "Find two numbers in an array that add up to a target sum",
    problem: "Given array [2, 7, 11, 15] and target = 9, find indices of two numbers that add up to target.",
    options: [
      { id: "a", text: "Use nested loops O(n²)", correct: false },
      { id: "b", text: "Use HashMap for O(n) solution", correct: true },
      { id: "c", text: "Sort array first then use two pointers", correct: false },
      { id: "d", text: "Use binary search on each element", correct: false }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCode((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit() {
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    try {
      if (isSignUp) {
        await register(name, email, password);
        // Optionally auto-login after register
        await login(email, password);
      } else {
        await login(email, password);
      }
      setShowModal(false);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed');
    }
  }

  function handleDemoAnswer(optionId) {
    if (demoAttempts >= 2) {
      setShowModal(true);
      return;
    }
    
    setSelectedAnswer(optionId);
    setShowResult(true);
    setDemoAttempts(prev => prev + 1);
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer("");
      if (demoAttempts >= 1) {
        // After 2 attempts, show login prompt
        setTimeout(() => setShowModal(true), 1000);
      }
    }, 2000);
  }

  return (
  // <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
  <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
            <div className="text-center lg:text-center space-y-6 mt-10">
            <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-full px-6 py-3 text-sm">
              <div className="w-2 h-2 bg-green-400 center rounded-full animate-pulse"></div>
              <span className="text-blue-300 ">Master DSA with Pattern-Based Learning</span>
            </div> 

            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Code Your Way to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tech Excellence
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Master Data Structures & Algorithms through{" "}
              <span className="text-blue-400 font-semibold">pattern recognition</span>, 
              structured learning paths, and{" "}
              <span className="text-purple-400 font-semibold">curated problem sets</span>{" "}
              designed for placement success.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-white font-semibold text-lg mb-2">Pattern-Based</h3>
                <p className="text-gray-400 text-sm">Learn through recognizable problem patterns</p>
              </div>
              <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-white font-semibold text-lg mb-2">Progress Tracking</h3>
                <p className="text-gray-400 text-sm">Visual progress with interactive mindmaps</p>
              </div>
              <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-white font-semibold text-lg mb-2">Placement Ready</h3>
                <p className="text-gray-400 text-sm">Curated problems from top companies</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8">
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Start Your Journey</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button 
                onClick={() => setShowDemo(true)}
                className="px-10 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 text-white font-semibold text-lg rounded-2xl hover:bg-opacity-20 transition-all duration-300"
              >
                Try Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 pt-6">
              {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>500+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>15+ Patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Progress Tracking</span>
              </div> */}


              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 pt-6">
  {[
    { color: "bg-green-400", label: "500+ Problems" },
    { color: "bg-blue-400", label: "15+ Patterns" },
    { color: "bg-purple-400", label: "Progress Tracking" },
  ].map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition"
    >
      <div className={`w-2.5 h-2.5 ${item.color} rounded-full animate-pulse`} />
      <span className="font-medium">{item.label}</span>
    </div>
  ))}
</div>

            </div>
          </div>

          {/* Right Content - Code Preview */}
          <div className="relative">
            <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-400 text-sm font-mono">DSAMastery.cpp</span>
              </div>
              
              <div className="bg-slate-900 bg-opacity-80 rounded-2xl p-8 font-mono text-sm min-h-48 flex items-center">
                <pre className="text-gray-300 leading-relaxed w-full">
                  <code className="text-blue-400 whitespace-pre-wrap">
                    {codeSnippets[currentCode]}
                  </code>
                </pre>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  Pattern: <span className="text-blue-400 font-semibold">
                    {currentCode === 0 ? "Two Sum" : currentCode === 1 ? "Sliding Window" : "Binary Search"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {codeSnippets.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all ${i === currentCode ? 'bg-blue-400' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (always visible, not covered by overlays) */}
      <footer className="relative z-40 py-1 border-t border-white border-opacity-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-2 text-center md:text-left">
            {/* <div>
              <h4 className="text-lg font-semibold text-white mb-4">DSA Mastery</h4>
              <p className="text-gray-400 text-sm">
                Pattern-based learning platform for mastering Data Structures & Algorithms
              </p>
            </div> */}
            {/* <div> */}
              {/* <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4> */}
              {/* <div className="space-y-2">
                <button 
                  onClick={() => setShowDemo(true)}
                  className="block text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Try Demo
                </button>
                <button 
                  onClick={() => setShowModal(true)}
                  className="block text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Sign Up
                </button>
              </div> */}
            {/* </div> */}
            {/* <div>
              <h4 className="text-lg font-semibold text-white mb-4">About</h4>
              <button 
                onClick={() => setShowDeveloperModal(true)}
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors block"
              >
                Meet the Developer →
              </button>
            </div> */}
          </div>
          
          <div className="mt-8 pt-8 border-t border-white border-opacity-10 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 DSA Mastery Platform. Built with ❤️ by{" "}
              <button 
                onClick={() => setShowDeveloperModal(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold underline"
              >
                Aditya Gupta
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 w-full h-full">
          <div className="relative bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Pattern Recognition Demo</h2>
              <p className="text-gray-400">Experience our pattern-based learning approach</p>
              <div className="mt-4 text-sm text-yellow-400">
                Demo Attempts: {demoAttempts}/2 {demoAttempts >= 2 && "(Sign up for unlimited access)"}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-blue-400">📝</span>
                {demoPattern.title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{demoPattern.description}</p>
              
              <div className="bg-slate-900 bg-opacity-60 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Problem:</h4>
                <p className="text-gray-300 font-mono text-sm bg-slate-800 bg-opacity-50 p-4 rounded-lg">
                  {demoPattern.problem}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Choose the most efficient approach:
                </h4>
                {demoPattern.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDemoAnswer(option.id)}
                    disabled={demoAttempts >= 2}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      showResult && selectedAnswer === option.id
                        ? option.correct
                          ? 'bg-green-500 bg-opacity-20 border-green-500 text-green-300'
                          : 'bg-red-500 bg-opacity-20 border-red-500 text-red-300'
                        : demoAttempts >= 2
                        ? 'bg-gray-700 bg-opacity-50 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-white bg-opacity-5 border-white border-opacity-20 text-gray-300 hover:bg-opacity-10 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-semibold">{option.id.toUpperCase()})</span> {option.text}
                    {showResult && selectedAnswer === option.id && option.correct && (
                      <span className="float-right text-green-400">✓ Correct!</span>
                    )}
                    {showResult && selectedAnswer === option.id && !option.correct && (
                      <span className="float-right text-red-400">✗ Try again</span>
                    )}
                  </button>
                ))}
              </div>

              {demoAttempts >= 2 && (
                <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-xl">
                  <p className="text-blue-300 text-center">
                    🚀 Ready to unlock all patterns and solve 500+ problems? 
                    <button 
                      onClick={() => {setShowDemo(false); setShowModal(true);}}
                      className="ml-2 font-semibold underline hover:text-blue-200"
                    >
                      Sign up now!
                    </button>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDemo(false)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300"
              >
                Close Demo
              </button>
              {demoAttempts < 2 && (
                <button
                  onClick={() => {setShowDemo(false); setShowModal(true);}}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Skip to Sign Up
                </button>
              )}
            </div>

            <button
              className="absolute top-4 right-4 w-10 h-10 bg-slate-700 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all z-10 shadow-lg border border-slate-600"
              onClick={() => setShowDemo(false)}
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Developer Modal */}
      {showDeveloperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 w-full h-full">
          <div className="relative bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                AG
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Meet the Developer</h2>
              <h3 className="text-xl text-blue-400 font-semibold">Aditya Gupta</h3>
              <p className="text-gray-400">Full Stack Developer & DSA Enthusiast</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-400">👨‍💻</span>
                    About Me
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Passionate software engineer with expertise in Data Structures & Algorithms, dedicated to helping 
                    students crack technical interviews. I believe in pattern-based learning and have personally 
                    solved 500+ problems across various platforms.
                  </p>
                </div>

                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-yellow-400">⚡</span>
                    Technical Skills
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Python', 'DSA', 'System Design', 'Git', 'AWS'].map((skill) => (
                      <div key={skill} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2 text-center">
                        <span className="text-gray-300 text-sm font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 from-opacity-10 to-purple-500 to-opacity-10 border border-blue-500 border-opacity-20 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-400">🚀</span>
                    Mission
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    "My goal is to make DSA learning structured and accessible for everyone. Through pattern-based 
                    learning and curated problem sets, I want to help students build confidence and land their dream jobs."
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-400">📈</span>
                    Platform Stats
                  </h4>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://leetcode.com/u/offaditya_001" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-3 bg-white bg-opacity-5 hover:bg-opacity-10 transition-colors rounded-xl cursor-pointer block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <span className="text-green-400 font-bold text-sm">LC</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">LeetCode</p>
                          <p className="text-gray-400 text-xs">Problems Solved</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">300+</p>
                        <p className="text-gray-400 text-xs">Rating: 1800+</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.geeksforgeeks.org/profile/adguptnaht" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-3 bg-white bg-opacity-5 hover:bg-opacity-10 transition-colors rounded-xl cursor-pointer block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <span className="text-orange-400 font-bold text-sm">GFG</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">GeeksforGeeks</p>
                          <p className="text-gray-400 text-xs">Problems Solved</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-400">200+</p>
                        <p className="text-gray-400 text-xs">5 Star Rating</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.codechef.com/users/guptaditya27" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-3 bg-white bg-opacity-5 hover:bg-opacity-10 transition-colors rounded-xl cursor-pointer block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-400 font-bold text-sm">CC</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">CodeChef</p>
                          <p className="text-gray-400 text-xs">Contest Rating</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-400">1600+</p>
                        <p className="text-gray-400 text-xs">3 Star Coder</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400">🔗</span>
                    Connect With Me
                  </h4>
                  <div className="space-y-3">
                    <a
                      href="https://github.com/Guptaditya27/DSA-mastery-project"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <div>
                        <p className="font-semibold">GitHub Repository</p>
                        <p className="text-gray-400 text-sm">DSA-Mastery Project</p>
                      </div>
                    </a>
                    
                    <a
                      href="https://codolio.com/profile/guptaditya27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <div className="w-5 h-5 flex items-center justify-center font-bold font-serif text-lg bg-white text-orange-500 rounded-full">C</div>
                      <div>
                        <p className="font-semibold">Codolio Profile</p>
                        <p className="text-gray-100 text-sm">View my competitive stats</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-400">🏆</span>
                    Achievements
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Helped 1000+ Students</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Open Source Contributor</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Pattern-Based Learning Advocate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="absolute top-4 right-4 w-10 h-10 bg-slate-700 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all z-10 shadow-lg border border-slate-600"
              onClick={() => setShowDeveloperModal(false)}
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 w-full h-full">
          <div className="relative bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-md mx-4 overflow-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? "Join DSA Mastery" : "Welcome Back"}
              </h2>
              <p className="text-gray-400">
                {isSignUp ? "Start your coding journey today" : "Continue your learning path"}
              </p>
              {demoAttempts >= 2 && (
                <div className="mt-3 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    🎯 Unlock unlimited pattern practice and 500+ problems!
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              
              {error && <div className="text-red-400 text-sm text-center bg-red-400 bg-opacity-10 border border-red-400 border-opacity-20 rounded-lg p-2">{error}</div>}
              
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                {isSignUp ? "Create Account & Start Learning" : "Sign In & Continue"}
              </button>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-slate-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-slate-600"></div>
            </div>

            <button className="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-xl border border-gray-300 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.35 11.1h-9.18v2.73h5.23c-.22 1.18-1.32 3.47-5.23 3.47-3.15 0-5.72-2.61-5.72-5.83s2.57-5.83 5.72-5.83c1.8 0 3.01.77 3.7 1.43l2.52-2.45C16.2 3.9 14.36 3 12.17 3 6.98 3 2.83 7.13 2.83 12s4.15 9 9.34 9c5.39 0 8.95-3.79 8.95-9 0-.61-.07-1.21-.19-1.9z"/>
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 text-center">
              <button
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Already have an account? Sign in" : "New to DSA Mastery? Sign up"}
              </button>
            </div>

            <button
              className="absolute top-4 right-4 w-10 h-10 bg-slate-700 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all z-10 shadow-lg border border-slate-600"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



