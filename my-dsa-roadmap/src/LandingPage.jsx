import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import AuthModal from './components/AuthModal';
import { 
  X, Brain, TrendingUp, Target, Play, 
  Map, Layers, RefreshCw, Briefcase, ChevronRight,
  Code2, CheckCircle2, Users, Building2, Quote
} from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentCode, setCurrentCode] = useState(0);
  const [demoAttempts, setDemoAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const codeSnippets = [
    {
      title: "two_sum.js",
      code: "const twoSum = (nums, target) => {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      return [map.get(comp), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};",
      pattern: "Hash Map Cache"
    },
    {
      title: "sliding_window.js",
      code: "const maxSubArrayLen = (nums, k) => {\n  let left = 0, sum = 0, max = 0;\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum > k) {\n      sum -= nums[left++];\n    }\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n};",
      pattern: "Sliding Window"
    },
    {
      title: "binary_search.js",
      code: "const search = (nums, target) => {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n};",
      pattern: "Binary Search"
    }
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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auth handlers correctly encapsulated inside <AuthModal />
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
        setTimeout(() => setShowModal(true), 1000);
      }
    }, 2000);
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen w-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Stripe-Level Background Patterns & Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep, rich radial glows overlaying the dark navy */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/40 blur-[140px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/30 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px]" />
        
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Premium Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-40 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Copy */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="flex-1 space-y-8"
        >
          {/* Glowing Trust Pill */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/50 border border-white/5 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_10px_2px_rgba(99,102,241,0.8)]"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-300">Trusted by over <span className="text-white">10,000+</span> engineers</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05]">
            <span className="text-white drop-shadow-sm">Code Your Way</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.4)]">
              to Excellence
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light">
            Stop memorizing. Start recognizing. Master Data Structures & Algorithms through a hyper-visual, pattern-based OS designed for elite placement.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 pt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-bold tracking-tight shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Start Your Journey <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-slate-300 rounded-xl font-medium tracking-tight shadow-inner backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> View Experience
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-8 pt-10">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-white/5 border border-white/5"><Code2 className="w-5 h-5 text-purple-400" /></div>
               <span className="font-semibold text-slate-300 tracking-tight">500+ Challenges</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-white/5 border border-white/5"><Layers className="w-5 h-5 text-blue-400" /></div>
               <span className="font-semibold text-slate-300 tracking-tight">15+ UI Patterns</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-white/5 border border-white/5"><Briefcase className="w-5 h-5 text-green-400" /></div>
               <span className="font-semibold text-slate-300 tracking-tight">FAANG Focused</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Ultra-Premium Code Editor UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex-1 w-full max-w-[540px] perspective-1000 relative"
        >
          {/* Intense Outer Editor Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-[24px] blur-2xl opacity-30 animate-pulse"></div>
          
          <div className="relative rounded-[20px] bg-[#0A0E17]/90 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,1)] overflow-hidden group">
            {/* Editor Top Bar */}
            <div className="flex justify-between items-center px-4 py-3 bg-white/[0.02] border-b border-white/5">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20 shadow-inner" />
              </div>
              <div className="flex gap-6 text-xs font-semibold tracking-wide text-slate-500">
                {codeSnippets.map((snippet, idx) => (
                  <span key={idx} className={`transition-all duration-300 ${idx === currentCode ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]' : 'opacity-50'}`}>
                    {snippet.title}
                  </span>
                ))}
              </div>
              <div className="w-10"></div> {/* Spacer to center titles perfectly */}
            </div>

            {/* Code Body */}
            <div className="p-6 relative min-h-[300px] font-mono text-[13px] sm:text-sm leading-relaxed overflow-x-auto">
              <div className="flex gap-4 w-max min-w-full">
                <div className="flex flex-col text-slate-700/80 select-none text-right font-medium">
                  {codeSnippets[currentCode].code.split('\n').map((_, i) => <span key={i}>{i+1}</span>)}
                </div>
                <div className="text-slate-300 whitespace-pre">
                  {codeSnippets[currentCode].code.split('\n').map((line, i) => {
                    const formatted = line
                      .replace(/\b(const|let|return|new|if|for|while)\b/g, '<span class="text-[#FF7B72]">$1</span>')
                      .replace(/\b(Math|Map)\b/g, '<span class="text-[#79C0FF]">$1</span>')
                      .replace(/\b(twoSum|maxSubArrayLen|search)\b/g, '<span class="text-[#D2A8FF]">$1</span>')
                      .replace(/(=&gt;|===|\+=|-=|\+\+|&lt;|&gt;)/g, '<span class="text-amber-400/80">$1</span>');
                    return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
                  })}
                  <span className="inline-block w-2 h-4 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse align-middle ml-1 -mt-1" />
                </div>
              </div>
            </div>

            {/* Editor Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/80 to-transparent flex justify-center border-t border-white/5 backdrop-blur-sm">
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold tracking-wide shadow-inner backdrop-blur-md">
                Active Pattern: <span className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]">{codeSnippets[currentCode].pattern}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards Grid (Stripe Depth) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Algorithmic Blueprints", desc: "We don't teach you solutions. We build your mental models so you can tackle unseen challenges through core pattern recognition." },
            { icon: TrendingUp, title: "Telemetry & Progress", desc: "Watch exactly how your confidence scores evolve. Interactive mindmaps unlock new topics dynamically as you prove competency." },
            { icon: Target, title: "Precision Targeting", desc: "No more grinding thousands of generic problems. Every question is highly curated and tied to specific FAANG interview thresholds." }
          ].map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-8 rounded-[24px] bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)] overflow-hidden"
            >
              {/* Inner Gradient Hover Glow */}
              <div className="absolute -inset-px bg-gradient-to-b from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feat.icon className="w-7 h-7 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why This Platform Works (Deep UI Mockups) */}
      <div className="relative z-10 w-full bg-[#040814] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-40">
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Structured Mastery</h2>
            <p className="text-slate-400 text-lg font-medium">Remove the chaos from preparation. Follow a meticulous pipeline designed by elite engineers to guarantee results.</p>
          </div>

          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <Map className="text-blue-400 w-7 h-7" />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">The visual dependency graph</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Navigate the overwhelming world of algorithms natively. We organize every concept by technical dependency, ensuring you never encounter a problem you aren't prepared to solve.
              </p>
              <div className="space-y-4 pt-4">
                {["Intelligent dynamic unlocking", "Instant gap identification", "Visual momentum tracking"].map((i, k) => (
                  <div key={k} className="flex items-center gap-4 text-slate-300 font-semibold">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-blue-400" strokeWidth={3} /> 
                    </div>
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              {/* Premium Abstract Mockup */}
              <div className="aspect-[4/3] rounded-[32px] bg-[#0A0E17] ring-1 ring-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                
                {/* Node Graph Mockup */}
                <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
                  <div className="w-40 h-14 rounded-full bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center relative translate-y-4">
                    <span className="text-white font-bold tracking-tight">Data Structures</span>
                    <div className="absolute bottom-[-24px] w-[2px] h-6 bg-slate-700"></div>
                  </div>
                  <div className="w-24 h-[2px] bg-slate-700 relative top-10"></div>
                  <div className="flex items-center gap-12 translate-y-10">
                    <div className="relative">
                      <div className="w-32 h-12 rounded-full bg-blue-500/20 ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center z-10 relative backdrop-blur-sm">
                        <span className="text-blue-300 font-bold tracking-tight">Arrays</span>
                      </div>
                    </div>
                    <div className="relative opacity-50 scale-95 blur-[1px]">
                      <div className="w-32 h-12 rounded-full bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center z-10 relative">
                        <span className="text-slate-500 font-bold tracking-tight">Graphs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <RefreshCw className="text-purple-400 w-7 h-7" />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Algorithmic retention engine</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Solving a problem once guarantees nothing. Our telemetry tracks your runtime, logic flow, and confidence metrics to autonomously generate spaced-repetition schedules.
              </p>
            </div>
            <div className="flex-1 w-full">
              {/* Premium Abstract Dashboard Mockup */}
              <div className="aspect-[4/3] rounded-[32px] bg-[#0A0E17] ring-1 ring-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden p-8 flex flex-col justify-center">
                 <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent"></div>
                 <div className="w-full space-y-5 relative z-10">
                    <div className="h-4 w-32 bg-slate-800 rounded-md mb-8"></div>
                    {[
                      { l: 90, color: 'emerald' },
                      { l: 40, color: 'amber' },
                      { l: 15, color: 'rose' }
                    ].map((bar, i) => (
                      <div key={i} className="h-16 w-full rounded-2xl bg-white/[0.02] ring-1 ring-white/5 flex items-center px-6 gap-6 backdrop-blur-md">
                        <div className={`w-3 h-3 rounded-full bg-${bar.color}-500 shadow-[0_0_10px_currentColor]`}></div>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-${bar.color}-500 opacity-80`} style={{width: `${bar.l}%`}}></div>
                        </div>
                        <div className="w-12 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">{bar.l}%</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Social Proof */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">The benchmark for talent</h2>
          <p className="text-slate-400 text-lg font-medium">Powering the next generation of engineers landing roles at leading firms.</p>
        </div>

        {/* Crisp Trusted By Row */}
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 mb-32 grayscale contrast-125">
           <div className="flex items-center gap-3 text-3xl font-black tracking-tighter mix-blend-screen text-slate-100">
             <Building2 className="w-10 h-10"/> FAANG
           </div>
           <div className="text-3xl font-black tracking-widest text-slate-100 uppercase mix-blend-screen">STARTUPS</div>
           <div className="text-3xl font-black italic tracking-tighter text-slate-100 mix-blend-screen">FINTECH</div>
        </div>

        {/* High-End Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Rahul S.", role: "L4 Software Engineer", co: "Amazon", review: "The pattern recognition framework fundamentally rewired how I map raw logic to physical code. It’s an unfair advantage." },
            { name: "Priya M.", role: "SWE II", co: "Google", review: "Having dynamic roadmaps completely removed 'tutorial hell'. The UI is gorgeous, but the methodology is what got me the offer." },
            { name: "Arjun K.", role: "Core OS", co: "Microsoft", review: "Most platforms drown you in 2,000+ problems. This isolates the exact 15 invariants you actually need to master. Phenomenal." }
          ].map((t, idx) => (
            <div key={idx} className="p-8 rounded-[24px] bg-[#0A0E17]/80 ring-1 ring-white/10 backdrop-blur-xl relative shadow-2xl hover:-translate-y-1 transition-transform duration-500">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/[0.03] fill-white" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-white/10 shadow-inner flex items-center justify-center text-white font-bold tracking-tight">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white tracking-tight">{t.name}</h4>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{t.role} <span className="text-indigo-400">@ {t.co}</span></p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">"{t.review}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Massive Glow CTA */}
      <div className="relative z-10 w-full py-40 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight leading-[1.1]">
            Your engineering<br />career starts here
          </h2>
          <div className="flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_80px_-10px_rgba(255,255,255,0.8)] transition-all duration-300 hover:-translate-y-1 ring-4 ring-white/10"
            >
              Start for free
            </button>
          </div>
        </div>
      </div>

      {/* Minimalist Stripe-style Footer */}
      <footer className="relative z-10 w-full bg-[#020617] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-sm font-medium">
            <div className="col-span-2">
              <span className="text-2xl font-extrabold tracking-tighter text-white">DSA<span className="text-indigo-400">Mastery</span></span>
              <p className="text-slate-500 mt-6 max-w-sm leading-relaxed">
                The absolute standard for engineering preparation. Built on algorithmic patterns, telemetry, and uncompromising design.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-white tracking-wide uppercase text-xs mb-6">Product</h5>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => setShowDemo(true)} className="hover:text-white transition-colors">Interface Demo</button></li>
                <li><button onClick={() => setShowModal(true)} className="hover:text-white transition-colors">Login / Register</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white tracking-wide uppercase text-xs mb-6">Platform</h5>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => setShowDeveloperModal(true)} className="hover:text-white transition-colors">Developer Profile</button></li>
                <li><a href="https://github.com/Guptaditya27" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">Support <ChevronRight className="w-3 h-3" /></a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs font-semibold">© 2024 DSA Mastery by Aditya Gupta.</p>
            <div className="flex gap-4">
              <a href="https://github.com/Guptaditya27" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= STRIPE-STYLE MODALS ================= */}
      
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={() => setShowDemo(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-[#0A0E17] ring-1 ring-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] rounded-3xl p-8 sm:p-12 w-full max-w-3xl max-h-[90vh] overflow-auto z-10"
          >
            <button className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors" onClick={() => setShowDemo(false)}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-8">Pattern Evaluation</h3>
            <div className="bg-slate-900/50 ring-1 ring-white/5 rounded-2xl p-6 mb-6">
              <h4 className="text-lg font-bold text-white mb-2 flex flex-col gap-2">
                <span className="text-indigo-400 font-mono text-sm tracking-wide bg-indigo-500/10 px-2 py-1 rounded inline-block w-max"># {demoPattern.title.toUpperCase()}</span>
              </h4>
              <p className="text-slate-400 mb-6 font-medium text-sm">{demoPattern.description}</p>
              
              <div className="bg-[#040814] border border-white/5 shadow-inner rounded-xl p-5 mb-8 font-mono text-sm inline-block w-full">
                <span className="text-slate-500 block mb-2">// Active Runtime Challenge:</span>
                <span className="text-slate-300">{demoPattern.problem}</span>
              </div>

              <div className="space-y-3">
                {demoPattern.options.map((option) => {
                  let isSelected = showResult && selectedAnswer === option.id;
                  let colorClass = 'bg-[#040814] border border-white/5 text-slate-300 hover:border-indigo-500/30 hover:bg-white/[0.02]';
                  
                  if (isSelected) {
                    if (option.correct) colorClass = 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
                    else colorClass = 'bg-rose-500/10 border border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleDemoAnswer(option.id)}
                      disabled={demoAttempts >= 2}
                      className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex justify-between items-center ${colorClass}`}
                    >
                      <span className="font-medium text-sm tracking-wide"><span className="opacity-40 mr-4 font-mono">{option.id.toUpperCase()}</span> {option.text}</span>
                      {isSelected && option.correct && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !option.correct && <X className="w-5 h-5 text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              {demoAttempts >= 2 && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-8 p-4 bg-indigo-500/10 ring-1 ring-indigo-500/30 rounded-xl flex items-center justify-between">
                   <p className="text-indigo-300 font-semibold text-sm">Telemetry captured. Ready to advance.</p>
                   <button onClick={() => {setShowDemo(false); setShowModal(true);}} className="text-white font-bold text-sm hover:underline">Proceed</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Developer Modal */}
      {showDeveloperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={() => setShowDeveloperModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-[#0A0E17] ring-1 ring-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] rounded-3xl p-8 sm:p-12 w-full max-w-4xl max-h-[90vh] overflow-auto z-10"
          >
            <button className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors" onClick={() => setShowDeveloperModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row gap-12">
              <div className="w-full md:w-5/12 space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-white to-slate-400 rounded-2xl shadow-xl flex items-center justify-center text-[#0A0E17] text-3xl font-black tracking-tighter">
                  AG
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Aditya Gupta</h2>
                  <p className="text-slate-400 font-semibold tracking-wide text-sm mt-1">SYSTEMS SOFTWARE ENGINEER</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Focused on building elegant abstractions for complex infrastructure. Created DSA Mastery to formalize the unstructured chaos of algorithmic interview preparation.
                </p>
                <div className="pt-4 border-t border-white/5">
                  <a href="https://github.com/Guptaditya27" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                    GitHub <ChevronRight className="w-4 h-4"/>
                  </a>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Core Stack</h3>
                  <div className="flex flex-wrap gap-2">
                     {['React OS', 'Node.js Core', 'Distributed Systems', 'MongoDB', 'System Design'].map(skill => (
                       <div key={skill} className="px-4 py-2 bg-white/5 ring-1 ring-white/10 rounded-full text-slate-300 font-semibold text-xs tracking-wide">
                         {skill}
                       </div>
                     ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Benchmarks</h3>
                  <div className="space-y-3">
                    <a href="https://leetcode.com/u/offaditya_001" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 ring-1 ring-white/5 rounded-2xl transition-all group">
                      <div className="text-sm">
                         <p className="font-bold text-white tracking-tight">LeetCode Analytics</p>
                         <p className="text-slate-500 font-medium">Top Percentile</p>
                      </div>
                      <span className="font-bold text-[#FF9900] group-hover:drop-shadow-[0_0_8px_rgba(255,153,0,0.5)]">300+ Verified</span>
                    </a>
                    <a href="https://www.geeksforgeeks.org/profile/adguptnaht" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 ring-1 ring-white/5 rounded-2xl transition-all group">
                      <div className="text-sm">
                         <p className="font-bold text-white tracking-tight">GeeksForGeeks Rating</p>
                         <p className="text-slate-500 font-medium">Advanced Scope</p>
                      </div>
                      <span className="font-bold text-[#27C93F] group-hover:drop-shadow-[0_0_8px_rgba(39,201,63,0.5)]">200+ Verified</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Isolated Auth State Machine */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} onLogin={onLogin} />
    </div>
  );
}
