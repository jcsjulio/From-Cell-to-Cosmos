/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameState, EraId } from '../types';
import { formatNumber } from '../utils';
import { ERAS } from '../data/eras';
import { Trophy, Clock, Fingerprint, RefreshCw, Star, Compass } from 'lucide-react';

interface StatsPanelProps {
  state: GameState;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (state: GameState) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_first_bacteria",
    title: "Sopa Primordial",
    description: "Compre seu primeiro organismo vivo (Bactéria Simples).",
    icon: "Bug",
    isUnlocked: (state) => (state.producers["bacteria_simples"] || 0) > 0
  },
  {
    id: "ach_multicellular",
    title: "Evolução Estrutural",
    description: "Desbloqueie a Era Multicelular.",
    icon: "Layers",
    isUnlocked: (state) => state.unlockedEras.includes(EraId.MULTICELLULAR)
  },
  {
    id: "ach_cerebro",
    title: "Surgimento da Consciência",
    description: "Pesquise o Cérebro Centralizado na árvore tecnológica.",
    icon: "Brain",
    isUnlocked: (state) => state.unlockedTechIds.includes("sistema_nervoso")
  },
  {
    id: "ach_space",
    title: "Biosfera Estelar",
    description: "Desbloqueie a Era de Colonização Cósmica.",
    icon: "Orbit",
    isUnlocked: (state) => state.unlockedEras.includes(EraId.COSMIC_COLONIZATION)
  },
  {
    id: "ach_omega",
    title: "Ponto Ômega",
    description: "Sintetize um Criador de Universos Vivos.",
    icon: "Infinity",
    isUnlocked: (state) => (state.producers["criador_universos_vivos"] || 0) > 0
  },
  {
    id: "ach_extinction",
    title: "Fênix Evolutiva",
    description: "Provoque sua primeira Extinção Controlada para renovar a biosfera.",
    icon: "RefreshCw",
    isUnlocked: (state) => state.stats.totalPrestigedCount > 0
  }
];

export function StatsPanel({ state }: StatsPanelProps) {
  
  // Format seconds to hh:mm:ss
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const highestEra = ERAS.find(e => e.id === state.stats.highestEraReached) || ERAS[0];

  return (
    <div className="w-full flex flex-col gap-6" id="stats-dashboard-panel">
      
      {/* Dynamic Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        
        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-emerald-400 shrink-0">
            <Fingerprint size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Toques Manuais</span>
            <span className="text-sm font-semibold text-white font-mono">{formatNumber(state.stats.totalClicks)}</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Tempo de Jogo</span>
            <span className="text-sm font-semibold text-white font-mono">{formatTime(state.stats.totalTimePlayedSeconds)}</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center col-span-2 md:col-span-1">
          <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/30 text-purple-400 shrink-0">
            <RefreshCw size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Extinções Provocadas</span>
            <span className="text-sm font-semibold text-white font-mono">{state.stats.totalPrestigedCount}</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-400 shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Maior Era Atingida</span>
            <span className="text-xs font-semibold text-white font-sans truncate max-w-[120px] block" title={highestEra.name}>
              {highestEra.name}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-lg bg-teal-950/20 border border-teal-800/30 text-teal-400 shrink-0">
            <Star size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Nutrientes Vitalícios</span>
            <span className="text-xs font-semibold text-white font-mono">{formatNumber(state.lifetimeNutrients)}</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-800/30 text-indigo-400 shrink-0">
            <Trophy size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Gens Conquistados</span>
            <span className="text-sm font-semibold text-white font-mono">{state.stats.totalGensEarned}</span>
          </div>
        </div>

      </div>

      {/* Achievements Catalog */}
      <div className="flex flex-col gap-3.5 mt-2">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Trophy size={13} className="text-amber-500" />
          Conquistas Obtidas ({ACHIEVEMENTS.filter(a => a.isUnlocked(state)).length} / {ACHIEVEMENTS.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = ach.isUnlocked(state);
            return (
              <div 
                key={ach.id}
                className={`border rounded-xl p-4 flex gap-3.5 items-center transition-all ${
                  unlocked 
                    ? 'bg-slate-950 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.02)]' 
                    : 'bg-slate-950/40 border-slate-900/60 opacity-50'
                }`}
              >
                <div className={`p-2.5 rounded-lg border shrink-0 ${
                  unlocked 
                    ? 'bg-amber-950/10 border-amber-500/20 text-amber-500' 
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {/* Since icons are string names, we map them directly using IconRenderer */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Trophy size={18} />
                  </div>
                </div>
                <div>
                  <h4 className={`text-xs font-bold font-mono uppercase tracking-wide ${unlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                  {unlocked ? (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold mt-1.5 block">✓ CONCLUÍDO</span>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono font-semibold mt-1.5 block">BLOQUEADO</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
