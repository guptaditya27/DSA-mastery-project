
import React, { useState, useEffect } from "react";
import { fetchMindmap, fetchProgress, fetchUserProfile, fetchPatterns, fetchStats } from './api';
import LandingPage from './LandingPage';
import Header from './components/Header';
import MindmapView from './components/MindmapView';
import ProgressView from './components/ProgressView';
import { useProgressTracker } from './hooks/useProgressTracker';
import { flattenedProblemsData } from './data/problemsData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selected, setSelected] = useState('root');
  const [viewMode, setViewMode] = useState("mindmap");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [problems, setProblems] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [stats, setStats] = useState({});


const { completedProblems, setCompletedProblems, totalProgress, isSaving, isLoaded } =
  useProgressTracker(nodes, problems, userProfile);


  // Initialize authentication - runs only once
  useEffect(() => {
    console.log('Auth check useEffect running...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found:', !!token);
      setIsAuthenticated(true);
      // Initialize axios headers with token
      import('./api').then(api => {
        api.setToken(token);
      });
    }
    setIsLoading(false);
    console.log('Auth check complete');
  }, []);

  // Fetch data only when authenticated and not already loaded
  useEffect(() => {
    if (!isAuthenticated || dataLoaded) {
      return;
    }

    console.log("User is authenticated, fetching data...");

    (async () => {
      try {
        const results = await Promise.allSettled([
          fetchMindmap(),
          Promise.resolve(flattenedProblemsData),
          // fetchProgress(),
          fetchUserProfile(),
          fetchPatterns(),
          fetchStats()


]);

       

        const [mindmapRes, problemsRes, progressRes, profileRes, patternsRes, statsRes] = results;

        // mindmap
        if (mindmapRes.status === 'fulfilled' && mindmapRes.value) {
          const data = mindmapRes.value;
          const mindmap = data?.mindmap ?? (Array.isArray(data) ? { nodes: data, edges: [] } : (typeof data === 'object' ? data : { nodes: [], edges: [] }));
          setNodes(Array.isArray(mindmap.nodes) ? mindmap.nodes : []);
          setEdges(Array.isArray(mindmap.edges) ? mindmap.edges : []);
        } else {
          console.error('Failed to fetch mindmap:', mindmapRes.status === 'rejected' ? mindmapRes.reason : mindmapRes.value);
          setNodes([]);
          setEdges([]);
        }

        // problems
        if (problemsRes.status === 'fulfilled') {
          const problemsData = problemsRes.value ?? [];
          console.log('Fetched problems:', problemsData.length);
          setProblems(problemsData);
        } else {
          console.error('Failed to fetch problems:', problemsRes.reason);
          setProblems([]);
        }

        // Progress is now handled by useProgressTracker hook (localStorage only)
        if (progressRes.status === 'rejected') {
          console.error('Failed to fetch progress:', progressRes.reason);
        }

        // profile
        if (profileRes.status === 'fulfilled') setUserProfile(profileRes.value ?? null);
        else {
          console.error('Failed to fetch user profile:', profileRes.reason);
          setUserProfile(null);
        }

        // patterns
        if (patternsRes.status === 'fulfilled') setPatterns(patternsRes.value ?? []);
        else {
          console.error('Failed to fetch patterns:', patternsRes.reason);
          setPatterns([]);
        }

        // stats
        if (statsRes.status === 'fulfilled') setStats(statsRes.value ?? {});
        else {
          console.error('Failed to fetch stats:', statsRes.reason);
          setStats({});
        }

        setDataLoaded(true);

      } catch (err) {
        console.error('Unexpected error fetching initial data:', err);
      }
    })();
  }, [isAuthenticated, dataLoaded]);

  const handleLogin = () => {
    console.log('Login handler called');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log('Logout handler called');
    setIsAuthenticated(false);
    setDataLoaded(false);
    setNodes([]);
    setEdges([]);
    setProblems([]);
    setUserProfile(null);
    setPatterns([]);
    setStats({});
    // Clear auth headers
    import('./api').then(api => {
      api.setToken(null);
    });
    localStorage.removeItem('token');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden">
      <style>{`
        .pulsate { animation: pulsate 2s infinite ease-in-out; }
        @keyframes pulsate { 
          0% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.4)); } 
          50% { filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.8)); } 
          100% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.4)); } 
        }
        .aurora-bg {
          position: absolute; inset: 0; overflow: hidden; background-color: #f1f5f9;
        }
        .aurora-bg::before {
          content: ''; position: absolute; top: 0; left: 0; width: 200%; height: 200%;
          background-image:
            radial-gradient(at 20% 30%, #dbeafe 0px, transparent 50%),
            radial-gradient(at 80% 10%, #ede9fe 0px, transparent 50%),
            radial-gradient(at 25% 90%, #fce7f3 0px, transparent 50%),
            radial-gradient(at 70% 80%, #fef3c7 0px, transparent 50%);
          animation: aurora 20s infinite linear;
        }
        @keyframes aurora {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Header 
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalProgress={totalProgress}
        onLogout={handleLogout}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      <main className="flex-1 overflow-hidden">
        {viewMode === "mindmap" && (
          <MindmapView 
            nodes={nodes}
            edges={edges}
            problems={problems}
            selected={selected}
            setSelected={setSelected}
            completedProblems={completedProblems}
            setCompletedProblems={setCompletedProblems}
           
          />
        )}
        {viewMode === "progress" && (
          <ProgressView 
            nodes={nodes} 
            problems={problems}
            completedProblems={completedProblems} 
            totalProgress={totalProgress} 
           
          />
        )}
      </main>
    </div>
  );
}




