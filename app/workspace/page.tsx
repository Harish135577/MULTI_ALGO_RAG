'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { LucideIcon } from '@/components/LucideIcon';
import PipelineCanvas from '@/components/PipelineCanvas';

export default function Workspace() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3-8b');
  const [showPipeline, setShowPipeline] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Scraping Racks States (Separated from static shards)
  const [showScrapingLibrary, setShowScrapingLibrary] = useState(false);
  const [racks, setRacks] = useState([
    { id: 'rack-1', name: 'Tech Docs Scraper', url: 'https://docs.python.org', maxDataSize: '500 MB', maxFiles: 150, maxFileSize: '10 MB', status: 'Active' },
    { id: 'rack-2', name: 'API Reference Crawler', url: 'https://fastapi.tiangolo.com', maxDataSize: '250 MB', maxFiles: 80, maxFileSize: '5 MB', status: 'Idle' },
  ]);
  const [showAddRackModal, setShowAddRackModal] = useState(false);
  
  // New Rack Form State
  const [newRackName, setNewRackName] = useState('');
  const [newRackUrl, setNewRackUrl] = useState('');
  const [newMaxDataSize, setNewMaxDataSize] = useState('500 MB');
  const [newMaxFiles, setNewMaxFiles] = useState('100');
  const [newMaxFileSize, setNewMaxFileSize] = useState('10 MB');

  const [messages] = useState([
    { 
      sender: 'System', 
      text: 'System Initialized. O(1) routing active. Local NPU isolated. Awaiting query.',
      isLocal: true 
    },
    {
      sender: 'AI',
      mcpAction: 'architecture_v2.pdf',
      text: 'Based on the local architecture file, the 5-phase pipeline routes the query through the metadata hard-gates before executing the dense search.'
    }
  ]);

  const handleCreateRack = () => {
    if (newRackName && newRackUrl) {
      setRacks([...racks, {
        id: `rack-${Date.now()}`,
        name: newRackName,
        url: newRackUrl,
        maxDataSize: newMaxDataSize,
        maxFiles: Number(newMaxFiles),
        maxFileSize: newMaxFileSize,
        status: 'Active'
      }]);
      setNewRackName('');
      setNewRackUrl('');
      setShowAddRackModal(false);
    }
  };

  return (
    <div className="h-screen bg-[#03050a] text-slate-100 flex flex-col font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
      <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${isOnline ? 'from-purple-900/20' : 'from-teal-900/20'} to-transparent -z-10 blur-3xl transition-colors duration-1000`} />

      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#03050a]/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all">
            <LucideIcon name="ArrowLeft" className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-bold text-sm text-slate-100 tracking-wide">Workspace Phase</h2>
            <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${isOnline ? 'text-purple-400' : 'text-teal-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOnline ? 'bg-purple-400' : 'bg-teal-400'}`} /> 
              {isOnline ? 'Cloud Network Active' : 'Local NPU Isolated'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0a0d14] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <LucideIcon name="WifiOff" className={`w-3.5 h-3.5 ${!isOnline ? 'text-teal-400' : 'text-slate-600'}`} />
            <button 
              onClick={() => {
                setIsOnline(!isOnline);
                setSelectedModel(isOnline ? 'llama3-8b' : 'gemini-1.5-pro');
              }}
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isOnline ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-teal-500/30 border border-teal-500/50'}`}
            >
              <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-300 ${isOnline ? 'translate-x-5 bg-purple-400 shadow-[0_0_10px_#c084fc]' : 'translate-x-1 bg-teal-400 shadow-[0_0_10px_#2dd4bf]'}`} />
            </button>
            <LucideIcon name="Wifi" className={`w-3.5 h-3.5 ${isOnline ? 'text-purple-400' : 'text-slate-600'}`} />
          </div>

          <div className="flex items-center gap-2 px-2">
            <LucideIcon name="Cpu" className={`w-4 h-4 ${isOnline ? 'text-purple-400' : 'text-teal-400'}`} />
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-200 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <optgroup label="Local (Offline)" className="bg-[#0a0d14] text-teal-400">
                <option value="llama3-8b">Llama 3.1 8B</option>
                <option value="mistral-7b">Mistral 7B</option>
              </optgroup>
              {isOnline && (
                <optgroup label="Cloud (Online)" className="bg-[#0a0d14] text-purple-400">
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gpt-4o">GPT-4o</option>
                </optgroup>
              )}
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden z-10">
        <aside className="w-64 border-r border-white/5 bg-[#0a0d14]/60 backdrop-blur-md p-5 flex flex-col hidden md:flex">
          <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-xl text-sm font-semibold flex items-center gap-3 text-slate-200 mb-8 shadow-sm">
            <LucideIcon name="Plus" className="w-4 h-4 text-teal-400 ml-3" /> New Chat
          </button>
            
          <nav className="space-y-4">
            <button 
              onClick={() => setShowScrapingLibrary(true)}
              className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full px-2 py-2 rounded-xl hover:bg-white/5"
            >
              <LucideIcon name="Globe" className="w-4 h-4 text-teal-400" /> Scraping Library
            </button>
            
            <button 
              onClick={() => setShowPipeline(true)}
              className="flex items-center gap-3 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors w-full px-2 py-3 bg-teal-500/10 rounded-xl border border-teal-500/20 shadow-[inset_0_0_15px_rgba(45,212,191,0.05)]"
            >
              <LucideIcon name="Workflow" className="w-4 h-4" /> Pipeline Config
            </button>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col bg-transparent relative">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl p-[1px] shrink-0 shadow-lg ${isOnline && msg.sender !== 'System' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20' : 'bg-gradient-to-br from-teal-500 to-indigo-600 shadow-teal-500/20'}`}>
                  <div className="w-full h-full bg-[#0a0d14] rounded-xl flex items-center justify-center">
                    {msg.sender === 'System' ? (
                      <LucideIcon name="Terminal" className="w-5 h-5 text-teal-400" />
                    ) : (
                      <LucideIcon name="Bot" className={`w-5 h-5 ${isOnline ? 'text-purple-400' : 'text-teal-400'}`} />
                    )}
                  </div>
                </div>
                
                <div className="max-w-2xl flex flex-col gap-2">
                  <div className="p-4 rounded-2xl rounded-tl-none bg-[#0a0d14]/90 backdrop-blur-md text-slate-200 border border-white/10 shadow-xl flex flex-col gap-3">
                    {msg.mcpAction && (
                      <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs font-mono">
                        <LucideIcon name="FileCode2" className="w-3.5 h-3.5 text-amber-400" />
                        MCP Retrieved: {msg.mcpAction}
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[14px] font-medium leading-relaxed tracking-wide font-mono text-teal-50/90">
                        {msg.text}
                      </p>
                      {msg.isLocal && (
                        <div title="Processed on bare metal" className="mt-1 shrink-0 flex items-center justify-center w-6 h-6 bg-teal-500/10 border border-teal-500/20 rounded-md">
                          <LucideIcon name="Cpu" className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-t from-[#03050a] to-transparent">
            <div className={`max-w-3xl mx-auto bg-[#0a0d14]/90 backdrop-blur-xl rounded-2xl border p-2 flex items-center gap-2 transition-all duration-300 ${isListening ? 'border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] focus-within:border-teal-500/50'}`}>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-all">
                <LucideIcon name="Plus" className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative flex items-center">
                {isListening ? (
                  <div className="w-full flex items-center gap-3 px-3">
                    <div className="flex gap-1">
                      <span className="w-1 h-3 bg-rose-500 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }}/>
                      <span className="w-1 h-5 bg-rose-500 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }}/>
                      <span className="w-1 h-3 bg-rose-500 rounded-sm animate-pulse" style={{ animationDelay: '300ms' }}/>
                    </div>
                    <span className="text-sm font-medium text-rose-400 font-mono animate-pulse">Listening via local NLP...</span>
                  </div>
                ) : (
                  <input type="text" placeholder="Query the infrastructure or use voice..." className="w-full bg-transparent border-0 focus:ring-0 text-sm font-medium focus:outline-none text-white placeholder-slate-500 px-3" />
                )}
              </div>

              <button onClick={() => setIsListening(!isListening)} className={`p-3 rounded-xl transition-all shadow-lg hover:scale-105 ${isListening ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-rose-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'}`}>
                <LucideIcon name={isListening ? "MicOff" : "Mic"} className="w-4 h-4" />
              </button>

              <button className={`p-3 font-black rounded-xl transition-all shadow-lg hover:scale-105 ${isOnline ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-teal-500 hover:bg-teal-400 text-slate-950'}`}>
                <LucideIcon name="SendHorizontal" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Dedicated Scraping Racks Library Modal */}
      {showScrapingLibrary && (
        <div className="absolute inset-0 z-40 bg-[#03050a]/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-full max-w-5xl h-full max-h-[85vh] bg-[#0a0d14] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 p-[1px]">
                  <div className="w-full h-full bg-[#0a0d14] rounded-2xl flex items-center justify-center">
                    <LucideIcon name="Server" className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide">Web Scraping Racks</h2>
                  <p className="text-sm text-slate-400 font-mono mt-1">Configure isolated URL targets, size caps, and file limits</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowAddRackModal(true)}
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                >
                  <LucideIcon name="Plus" className="w-4 h-4" /> Create Rack
                </button>
                <button onClick={() => setShowScrapingLibrary(false)} className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                  <LucideIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Racks List Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              {racks.map((rack) => (
                <div key={rack.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                          <LucideIcon name="Globe" className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{rack.name}</h3>
                          <span className="text-xs font-mono text-teal-400 truncate block max-w-[240px]">{rack.url}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-mono font-bold uppercase">
                        {rack.status}
                      </span>
                    </div>

                    {/* Rack Constraints / Limits Display */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 rounded-xl border border-white/5 my-4 font-mono text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">Max Data</span>
                        <span className="text-slate-200 font-bold">{rack.maxDataSize}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">File Limit</span>
                        <span className="text-slate-200 font-bold">{rack.maxFiles} files</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">Max File Size</span>
                        <span className="text-slate-200 font-bold">{rack.maxFileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-xs text-slate-400 font-mono">ID: {rack.id}</span>
                    <button onClick={() => setRacks(racks.filter(r => r.id !== rack.id))} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <LucideIcon name="Trash2" className="w-3.5 h-3.5" /> Remove Rack
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Create Scraping Rack Modal */}
      {showAddRackModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-[480px] bg-[#0a0d14] border border-teal-500/30 rounded-2xl shadow-[0_0_50px_rgba(45,212,191,0.15)] p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
            
            <h3 className="text-xl font-black text-white mb-2">Create Scraping Rack</h3>
            <p className="text-sm text-slate-400 mb-6">Configure target URL and ingestion quotas for this scraping node.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Rack Name</label>
                <input type="text" placeholder="e.g. Documentation Crawler" value={newRackName} onChange={(e) => setNewRackName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Target URL</label>
                <input type="text" placeholder="https://example.com/docs" value={newRackUrl} onChange={(e) => setNewRackUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 font-mono text-xs" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Max Data Cap</label>
                  <input type="text" value={newMaxDataSize} onChange={(e) => setNewMaxDataSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Max Files</label>
                  <input type="number" value={newMaxFiles} onChange={(e) => setNewMaxFiles(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Max File Size</label>
                  <input type="text" value={newMaxFileSize} onChange={(e) => setNewMaxFileSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddRackModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={handleCreateRack} className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-teal-600/20 text-sm">Deploy Rack</button>
            </div>
          </div>
        </div>
      )}

      {showPipeline && <PipelineCanvas onClose={() => setShowPipeline(false)} />}
    </div>
  );
}