'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LucideIcon } from '@/components/LucideIcon';

export default function LandingDashboard() {
  const router = useRouter();
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  const [shardMenuOpen, setShardMenuOpen] = useState<string | null>(null);
  
  const [unlockPrompt, setUnlockPrompt] = useState<string | null>(null);
  const [setLockPrompt, setSetLockPrompt] = useState<string | null>(null);
  const [renamePrompt, setRenamePrompt] = useState<string | null>(null);
  const [newShardName, setNewShardName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [shards, setShards] = useState([
    { id: '1', name: 'Mathematics', status: 'Ready', locked: false, docs: '1,248', size: '86.4 MB', updated: '12m ago' },
    { id: '2', name: 'DBMS', status: 'Ready', locked: false, docs: '864', size: '42.1 MB', updated: '1h ago' },
    { id: '3', name: 'Algorithms', status: 'Ready', locked: false, docs: '2,100', size: '112.8 MB', updated: '2m ago' },
    { id: '4', name: 'COA', status: 'Restricted', locked: true, docs: '---', size: '---', updated: 'Unknown' },
  ]);
  const [activeShards, setActiveShards] = useState<string[]>(['3']);

  const handleShardClick = (shard: any) => {
    if (shardMenuOpen) return; 
    if (shard.locked) {
      setUnlockPrompt(shard.id);
    } else {
      toggleShard(shard.id);
    }
  };

  const toggleShard = (id: string) => {
    setActiveShards(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleInitialize = () => {
    setIsInitializing(true);
    setTimeout(() => {
      // Passes selected shards or scraping mode to the workspace URL
      if (activeShards.length > 0) {
        const shardQuery = activeShards.join(',');
        router.push(`/workspace?shards=${shardQuery}`);
      } else {
        router.push('/workspace?mode=scraping_only');
      }
      setIsInitializing(false); 
    }, 800);
  };

  const applyLock = (id: string) => {
    setShards(shards.map(s => s.id === id ? { ...s, locked: true, status: 'Restricted', docs: '---', size: '---' } : s));
    setActiveShards(activeShards.filter(activeId => activeId !== id)); 
    setSetLockPrompt(null);
  };

  const removeLock = (id: string) => {
    setShards(shards.map(s => s.id === id ? { ...s, locked: false, status: 'Ready', docs: 'Calculating...', size: 'Calculating...' } : s));
    setShardMenuOpen(null);
  };

  const applyRename = (id: string) => {
    if (newShardName.trim()) {
      setShards(shards.map(s => s.id === id ? { ...s, name: newShardName } : s));
    }
    setRenamePrompt(null);
    setNewShardName('');
  };

  const deleteShard = (id: string) => {
    setShards(shards.filter(s => s.id !== id));
    setActiveShards(activeShards.filter(activeId => activeId !== id));
    setShardMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-slate-100 flex flex-col font-sans relative overflow-hidden" onClick={() => {setGlobalMenuOpen(false); setShardMenuOpen(null);}}>
      <div className="absolute top-[20%] left-[40%] w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-teal-900/10 blur-[100px] rounded-full pointer-events-none" />

      <header className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-[#0a0d14]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <LucideIcon name="Database" className="w-4 h-4 text-[#03050a]" />
          </div>
          <h1 className="text-xl font-black tracking-wide text-white flex items-center gap-1.5">
            <span className="text-slate-300">MULTI</span> ALGO RAG
          </h1>
          <span className="ml-4 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-400 uppercase tracking-widest">Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors mr-2">Login</button>
          
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setGlobalMenuOpen(!globalMenuOpen); setShardMenuOpen(null); }} className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all">
              <LucideIcon name="FolderCog" className="w-4 h-4 text-slate-400" /> Manage Library
            </button>
            {globalMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#0f131f] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in zoom-in-95">
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3"><LucideIcon name="CheckSquare" className="w-4 h-4"/> Select</button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3"><LucideIcon name="LayoutGrid" className="w-4 h-4"/> View</button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3"><LucideIcon name="ArrowUpDown" className="w-4 h-4"/> Sort</button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3"><LucideIcon name="Settings2" className="w-4 h-4"/> Manage Shards</button>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-sm font-bold text-teal-400 hover:bg-teal-500/20 transition-all">
            <LucideIcon name="Plus" className="w-4 h-4" /> Add Shard
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-8 z-10 w-full max-w-7xl mx-auto mt-4">
        
        <div className="w-full flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">Data Configuration</h2>
            <p className="text-sm text-slate-400 mt-1">Select the S-MRAG knowledge shards to mount in your workspace.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <LucideIcon name="Search" className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input type="text" placeholder="Search shards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 bg-[#0a0d14] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500" />
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 z-10">
          {shards.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((shard) => {
            const isActive = activeShards.includes(shard.id);
            return (
              <div key={shard.id} onClick={() => handleShardClick(shard)} className={`relative h-60 p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${isActive ? 'bg-gradient-to-br from-purple-900/20 to-[#0a0d14] border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'bg-[#0a0d14] border-white/5 hover:border-white/20'}`}>
                {isActive && <div className="absolute inset-0 bg-purple-500/5 pointer-events-none rounded-2xl" />}

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isActive ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/20 bg-transparent'}`}>
                      {isActive && <LucideIcon name="Check" className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SHD-00{shard.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {shard.locked && <div className="bg-rose-500/10 border border-rose-500/20 p-1.5 rounded-lg shadow-sm"><LucideIcon name="Lock" className="w-3.5 h-3.5 text-rose-400" /></div>}
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setShardMenuOpen(shardMenuOpen === shard.id ? null : shard.id); setGlobalMenuOpen(false); }} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 transition-colors">
                        <LucideIcon name="MoreVertical" className="w-4 h-4" />
                      </button>
                      {shardMenuOpen === shard.id && (
                        <div className="absolute right-0 top-8 w-44 bg-[#0f131f] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                          <button onClick={(e) => { e.stopPropagation(); setRenamePrompt(shard.id); setNewShardName(shard.name); setShardMenuOpen(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 rounded-lg flex items-center gap-2"><LucideIcon name="Edit3" className="w-3.5 h-3.5"/> Rename Shard</button>
                          {shard.locked ? (
                            <button onClick={(e) => { e.stopPropagation(); removeLock(shard.id); }} className="w-full text-left px-3 py-2 text-xs font-medium text-teal-400 hover:bg-teal-500/10 rounded-lg flex items-center gap-2 mt-1"><LucideIcon name="Unlock" className="w-3.5 h-3.5"/> Remove Security</button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setSetLockPrompt(shard.id); setShardMenuOpen(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 mt-1"><LucideIcon name="Lock" className="w-3.5 h-3.5"/> Secure Shard</button>
                          )}
                          <div className="h-px bg-white/10 my-1 mx-1" />
                          <button onClick={(e) => { e.stopPropagation(); deleteShard(shard.id); }} className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"><LucideIcon name="Trash2" className="w-3.5 h-3.5"/> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="z-10 mt-4">
                  <h3 className="text-xl font-bold text-white mb-3">{shard.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-slate-500">Docs</span><span className="font-mono text-slate-300">{shard.docs}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-slate-500">Storage</span><span className="font-mono text-slate-300">{shard.size}</span></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-400' : shard.locked ? 'bg-rose-500' : 'bg-teal-500'}`} />
                      <span className={`text-[11px] font-semibold ${isActive ? 'text-purple-300' : shard.locked ? 'text-rose-400' : 'text-teal-400'}`}>{shard.status}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Sync: {shard.updated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full mt-auto bg-[#0a0d14] border border-white/10 rounded-2xl p-4 flex justify-between items-center z-10 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Workspace Configuration</span>
            <span className="text-xs text-slate-400 mt-0.5">
              {activeShards.length === 0 ? '0 shards selected · Proceeding will enable Web Scraping mode only' : `${activeShards.length} shard(s) selected for mounting`}
            </span>
          </div>
          <button onClick={handleInitialize} disabled={isInitializing} className={`px-6 py-3 rounded-xl font-black tracking-widest text-xs flex items-center gap-2 transition-all duration-300 ${isInitializing ? 'bg-slate-800 text-slate-400 scale-95 cursor-wait' : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-105'}`}>
            {isInitializing ? 'MOUNTING ARCHITECTURE...' : `INITIALIZE WORKSPACE (${activeShards.length})`}
            {!isInitializing && <LucideIcon name="Zap" className="w-3.5 h-3.5" />}
          </button>
        </div>
      </main>

      {unlockPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-[420px] bg-[#0a0d14] border border-rose-500/30 rounded-2xl p-8 relative">
            <h3 className="text-xl font-black text-white text-center mb-2">Vault Locked</h3>
            <p className="text-sm text-slate-400 text-center mb-8">The <span className="font-bold text-rose-400">{shards.find(s => s.id === unlockPrompt)?.name}</span> shard is encrypted.</p>
            <input type="password" placeholder="Enter decryption key..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 mb-4 text-center tracking-widest font-mono" />
            <div className="flex gap-3">
              <button onClick={() => setUnlockPrompt(null)} className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl text-sm">Cancel</button>
              <button onClick={() => { toggleShard(unlockPrompt); setUnlockPrompt(null); }} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-sm">Authorize</button>
            </div>
          </div>
        </div>
      )}

      {setLockPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-[420px] bg-[#0a0d14] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <LucideIcon name="KeyRound" className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-black text-white text-center mb-2">Secure Knowledge Shard</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Establish an encryption key for <span className="font-bold text-amber-400">{shards.find(s => s.id === setLockPrompt)?.name}</span>.
            </p>
            <div className="space-y-3 mb-6">
              <input type="password" placeholder="New Password" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center tracking-widest font-mono" />
              <input type="password" placeholder="Confirm Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center tracking-widest font-mono" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSetLockPrompt(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={() => applyLock(setLockPrompt)} className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-600/20 text-sm">Encrypt Data</button>
            </div>
          </div>
        </div>
      )}

      {renamePrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-[420px] bg-[#0a0d14] border border-teal-500/30 rounded-2xl shadow-[0_0_50px_rgba(45,212,191,0.15)] p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
            <h3 className="text-xl font-black text-white mb-2">Rename Knowledge Shard</h3>
            <p className="text-sm text-slate-400 mb-6">Enter a new logical identifier for this data partition.</p>
            <input 
              type="text" 
              value={newShardName}
              onChange={(e) => setNewShardName(e.target.value)}
              placeholder="e.g. Neural Networks" 
              autoFocus 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 mb-6" 
            />
            <div className="flex gap-3">
              <button onClick={() => setRenamePrompt(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={() => applyRename(renamePrompt)} className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-teal-600/20 text-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}