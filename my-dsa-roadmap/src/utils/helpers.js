export const adjustBrightness = (hex, percent) => {
  const [r, g, b] = hex.match(/\w\w/g).map(c => parseInt(c, 16));
  const p = percent / 100;
  const newR = Math.round(Math.min(255, Math.max(0, r * (1 + p))));
  const newG = Math.round(Math.min(255, Math.max(0, g * (1 + p))));
  const newB = Math.round(Math.min(255, Math.max(0, b * (1 + p))));
  return `#${[newR, newG, newB].map(c => c.toString(16).padStart(2, '0')).join('')}`;
};



function normalizeKey(name = "") {
  if (!name) return name;
  // If starts with number + ". ", keep it
  if (/^\d+\.\s/.test(name)) return name;
  // If starts with number + "_ ", convert
  if (/^\d+_ /.test(name)) return name.replace(/_ /, ". ");
  return name;
}

export function getNodeProgress(nodeId, nodeProblems, completedProblems = {}) {
  if (!Array.isArray(nodeProblems) || nodeProblems.length === 0) {
    return { total: 0, completed: 0 };
  }

  let completed = 0;
  for (const p of nodeProblems) {
    const key = normalizeKey(p.name);
    if (completedProblems[key]) {
      completed++;
    }
  }

  return { total: nodeProblems.length, completed };
}

