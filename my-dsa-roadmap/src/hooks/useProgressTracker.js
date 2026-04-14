
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fetchProgress, updateProgress } from "../api";


function dbKeyToUiKey(k) {
  if (!k) return k;
 
  if (k.includes("_ ")) return k.replace(/_ /g, ". ");
  return k.replace(/_/g, "."); 
}


function uiKeyToDbKey(k) {
  if (!k) return k;
  if (k.includes(". ")) return k.replace(/\. /g, "_ ");
  return k.replace(/\./g, "_");
}

export function useProgressTracker(nodes = [], problems = [], userProfile = null) {
  const [completedProblems, setCompletedProblemsState] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(JSON.stringify({}));
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // ---------- Load from DB (only when userProfile is ready OR if userProfile not provided) ----------
  useEffect(() => {
    const shouldLoad = typeof userProfile === "undefined" || userProfile;
    if (!shouldLoad) return;

    let cancelled = false;
    (async () => {
      try {
        const resp = await fetchProgress(); // should use token internally via api.setToken in App
        // resp might be: { completedProblems: { dbKey: true, ... } } OR { dbKey: true, ... }
        const serverMap = resp?.completedProblems ?? resp ?? {};
        const normalized = {};

        for (const dbKey in serverMap) {
          const uiKey = dbKeyToUiKey(dbKey);
          normalized[uiKey] = serverMap[dbKey];
        }

        // If normalized has keys, use it. Otherwise fallback to localStorage if present.
        if (!cancelled) {
          if (Object.keys(normalized).length > 0) {
            setCompletedProblemsState(normalized);
            lastSavedRef.current = JSON.stringify(normalized);
            try { localStorage.setItem("dsaCompletedProblems", lastSavedRef.current); } catch {}
          } else {
            // fallback to localStorage
            const saved = localStorage.getItem("dsaCompletedProblems");
            if (saved) {
              const parsed = JSON.parse(saved);
              setCompletedProblemsState(parsed);
              lastSavedRef.current = JSON.stringify(parsed);
            }
          }
        }
      } catch (err) {
        console.error("useProgressTracker: fetchProgress error, falling back to localStorage:", err);
        const saved = localStorage.getItem("dsaCompletedProblems");
        if (!cancelled && saved) {
          try {
            const parsed = JSON.parse(saved);
            setCompletedProblemsState(parsed);
            lastSavedRef.current = JSON.stringify(parsed);
          } catch {}
        }
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => { cancelled = true; };
  }, [userProfile]); // re-run when userProfile becomes available

  // ---------- Save to DB when completedProblems changes (debounced) ----------
  useEffect(() => {
    const currentStr = JSON.stringify(completedProblems || {});
    // don't save empty state or if identical to last saved
    if (!currentStr || currentStr === "{}" || currentStr === lastSavedRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        // Build DB payload: convert UI keys -> DB keys
        const dbPayload = {};
        for (const uiKey in completedProblems) {
          dbPayload[uiKeyToDbKey(uiKey)] = completedProblems[uiKey];
        }

        const serverResp = await updateProgress(dbPayload);
        // serverResp may return updated completedProblems in DB-key form or the same payload
        const returnedMap = serverResp?.completedProblems ?? serverResp ?? dbPayload;

        // Normalize returned map (DB -> UI keys)
        const normalizedFromServer = {};
        for (const dbKey in returnedMap) {
          const uiKey = dbKeyToUiKey(dbKey);
          normalizedFromServer[uiKey] = returnedMap[dbKey];
        }

        // Save normalized state locally & update lastSavedRef
        if (mountedRef.current) {
          setCompletedProblemsState(normalizedFromServer);
          lastSavedRef.current = JSON.stringify(normalizedFromServer);
          try { localStorage.setItem("dsaCompletedProblems", lastSavedRef.current); } catch {}
        }
      } catch (err) {
        console.error("useProgressTracker: updateProgress failed:", err);
        // keep local state; we will try again on next change
      } finally {
        if (mountedRef.current) setIsSaving(false);
      }
    }, 700);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [completedProblems]);

  // ---------- Toggle handler (keeps same API name setCompletedProblems for existing components) ----------
  const toggleProblem = useCallback((problemName) => {
    setCompletedProblemsState((prev = {}) => {
      const key = problemName; // problemName should be UI-format (e.g. "26. Remove...")
      const updated = { ...prev, [key]: !prev[key] };
      // UI updates immediately; save effect will convert & persist.
      return updated;
    });
  }, []);

  // ---------- totalProgress computed from `problems` (not nodes) ----------
  const totalProgress = useMemo(() => {
    if (!Array.isArray(problems) || problems.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    const total = problems.length;
    const completedCount = problems.reduce((acc, p) => acc + (completedProblems[p.name] ? 1 : 0), 0);
    const percentage = total ? Math.round((completedCount / total) * 100) : 0;
    return { total, completed: completedCount, percentage };
  }, [problems, completedProblems]);

  return {
    completedProblems,
    // keep previous API: setCompletedProblems toggles a problem by name
    setCompletedProblems: toggleProblem,
    totalProgress,
    isSaving,
    isLoaded,
  };
}




















