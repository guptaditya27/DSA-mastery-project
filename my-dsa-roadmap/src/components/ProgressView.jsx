
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { getNodeProgress } from '../utils/helpers';

export default function ProgressView({ nodes, problems, completedProblems, totalProgress }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Overall Progress</h2>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">{totalProgress.percentage}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500" style={{ width: `${totalProgress?.percentage ?? 0}%` }}></div>
          </div>
          <p className="text-gray-600">{totalProgress?.completed ?? 0} of {totalProgress?.total ?? 0} problems completed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.filter(node => node.id !== 'root').map(node => {
            const nodeProblems = (Array.isArray(problems) ? problems.filter(p => p.nodeId === node.id) : []);
            const nodeProgress = getNodeProgress(node.id, nodeProblems, completedProblems);
            const percentage = nodeProgress.total > 0 ? Math.round((nodeProgress.completed / nodeProgress.total) * 100) : 0;
            return (
              <div key={node.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{node.label}</h3>
                    <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium text-gray-700">{percentage}%</span></div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3"><div className="h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: node.color }}></div></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>{nodeProgress.completed} completed</span><span>{nodeProgress.total} total</span></div>
                  <div className="mt-3 text-xs text-gray-500">{node.examples[0]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}