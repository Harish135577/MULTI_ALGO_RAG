'use client'
import React, { useState } from 'react';
import { LucideIcon } from '@/components/LucideIcon';

const PHASES = [
  { id: 1, title: 'Query Transformation', algos: ['HyDE', 'Multi-Query Rewriting', 'Step-Back Prompting'], desc: 'Pre-retrieval optimization' },
  { id: 2, title: 'Intent & Metadata Routing', algos: ['Metadata Hard-Gate', 'Semantic Router'], desc: 'Domain isolation & routing' },
  { id: 3, title: 'Core Retrieval Engine', algos: ['Offline k-NN', 'Dense Vector', 'BM25', 'GraphRAG'], desc: 'Parallel search execution' },
  { id: 4, title: 'Post-Retrieval Optimization', algos: ['Cohere Rerank', 'Reciprocal Rank Fusion (RRF)'], desc: 'Context re-ordering' },
  { id: 5, title: 'Evaluation & Synthesis', algos: ['Standard Generation', 'CRAG (Corrective)', 'Self-RAG Loop'], desc: 'Agentic output generation' }
];

export default function PipelineCanvas({ onClose }: { onClose: () => void }) {
  const [preset, setPreset] = useState('Modular');
  const [activeAlgos, setActiveAlgos] = useState<Record<number, string[]>>({
    1: [], 2: ['Metadata Hard-Gate'], 3: ['Offline k-NN'], 4: [], 5: ['Standard Generation']
  });
  // New state to track which phase's popover is currently open
  const [activePopover, setActivePopover] = useState<number | null>(null);

  const isPhaseActive = (phaseId: number) => {
    if (preset === 'Naïve') return phaseId === 3 || phaseId === 5;
    if (preset === 'Agentic') return phaseId === 3 || phaseId === 5;
    if (preset === 'Adaptive' || preset === 'Modular') return true;
    return true;
  };

  const toggleAlgo = (phaseId: number, algo: string) => {
    setActiveAlgos(prev => {
      const current = prev[phaseId] || [];
      if (current.includes(algo)) return { ...prev, [phaseId]: current.filter(a => a !== algo) };
      return { ...prev, [phaseId]: [...current, algo] };
    });
  };

  const activePhaseData = activePopover ? PHASES.find(p => p.id === activePopover) : null;
  const isAgenticRestricted = preset === 'Agentic' && activePopover === 5;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#03050a]/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10 bg-[#0a0d14]/80">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(45,212,191,0.2)]">
            <div className="w-full h-full bg-[#0a0d14] rounded-xl flex items-center justify-center">
              <LucideIcon name="Workflow" className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-white">Pipeline Configuration</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Universal Master Template Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {preset === 'Modular' && (
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 animate-pulse">
              Manual Override Active
            </span>
          )}
          <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
            <LucideIcon name="Settings2" className="w-4 h-4 text-slate-400 ml-2" />
            <select 
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="bg-transparent text-sm font-bold text-teal-400 focus:outline-none cursor-pointer pr-4"
            >
              <option value="Naïve">Naïve RAG (Strict)</option>
              <option value="Agentic">Agentic RAG (Autonomous)</option>
              <option value="Adaptive">Adaptive RAG (Dynamic)</option>
              <option value="Modular">Modular (Sandbox)</option>
            </select>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/30">
            <LucideIcon name="X" className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center gap-4 relative">
        {PHASES.map((phase, index) => {
          const active = isPhaseActive(phase.id);
          const selectedCount = activeAlgos[phase.id]?.length || 0;
          
          return (
            <React.Fragment key={phase.id}>
              <div 
                onClick={() => active && setActivePopover(phase.id)}
                className={`w-full max-w-3xl rounded-2xl border transition-all duration-300 ease-in-out
                  ${active 
                    ? 'bg-[#0a0d14] border-white/20 opacity-100 shadow-xl cursor-pointer hover:border-teal-500/50 hover:bg-[#0f131f]' 
                    : 'bg-[#0a0d14]/40 border-white/5 opacity-30 grayscale pointer-events-none'
                  }`}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${active ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-500'}`}>
                      {phase.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{phase.title}</h3>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{phase.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {active && selectedCount > 0 && (
                      <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                        {selectedCount} Active
                      </span>
                    )}
                    {active ? <LucideIcon name="ChevronRight" className="w-5 h-5 text-slate-500" /> : <LucideIcon name="Lock" className="w-5 h-5 text-slate-600" />}
                  </div>
                </div>
              </div>

              {index < PHASES.length - 1 && (
                <div className={`py-1 transition-opacity duration-500 ${active && isPhaseActive(PHASES[index + 1].id) ? 'opacity-100' : 'opacity-20'}`}>
                  <LucideIcon name="ArrowDown" className="w-6 h-6 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* The White Popover Modal */}
      {activePopover && activePhaseData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activePhaseData.title}</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Select Algorithms</p>
              </div>
              <button onClick={() => setActivePopover(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors">
                <LucideIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-3">
              {activePhaseData.algos.map(algo => {
                const isSelected = activeAlgos[activePhaseData.id]?.includes(algo);
                const isLockedAlgo = isAgenticRestricted && algo === 'Standard Generation';

                return (
                  <button
                    key={algo}
                    onClick={() => toggleAlgo(activePhaseData.id, algo)}
                    disabled={isLockedAlgo}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all flex items-center justify-between border
                      ${isLockedAlgo 
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-500' 
                        : isSelected 
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-teal-500' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                      </div>
                      {algo}
                    </span>
                    {isLockedAlgo && <LucideIcon name="Lock" className="w-4 h-4 text-slate-400" />}
                  </button>
                );
              })}
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setActivePopover(null)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-md">
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}