/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TechNode, GameState, EraId } from '../types';
import { TECH_TREE } from '../data/techTree';
import { ERAS } from '../data/eras';
import { formatNumber } from '../utils';
import { IconRenderer } from './MainGamePanel';
import { Check, Compass, GitMerge, Lock, ShieldAlert } from 'lucide-react';

interface TechTreePanelProps {
  state: GameState;
  onUnlockTech: (techId: string) => void;
}

export function TechTreePanel({ state, onUnlockTech }: TechTreePanelProps) {
  
  // Group tech nodes by Era for an organized board
  const getTechsByEra = (eraId: EraId) => {
    return TECH_TREE.filter(t => t.eraId === eraId);
  };

  // Helper to get currency details for tech nodes of that era
  const getEraCurrency = (eraId: EraId) => {
    switch (eraId) {
      case EraId.MICROSCOPIC: return { name: "Nutrientes", balance: state.nutrients, icon: "Dna", color: "text-emerald-400" };
      case EraId.MULTICELLULAR: return { name: "Biomassa", balance: state.biomass, icon: "Database", color: "text-cyan-400" };
      case EraId.ECOSYSTEM: return { name: "Força Vital", balance: state.vitalForce, icon: "Leaf", color: "text-teal-400" };
      case EraId.CIVILIZATION: return { name: "Inteligência", balance: state.intelligence, icon: "Brain", color: "text-indigo-400" };
      case EraId.COSMIC_COLONIZATION: return { name: "Energia Cósmica", balance: state.cosmicEnergy, icon: "Orbit", color: "text-purple-400" };
      case EraId.LIVING_COSMOS: return { name: "Consciência Universal", balance: state.universalConsciousness, icon: "Sparkles", color: "text-pink-400" };
    }
  };

  const isDependencyMet = (tech: TechNode) => {
    if (tech.dependencies.length === 0) return true;
    return tech.dependencies.every(depId => state.unlockedTechIds.includes(depId));
  };

  return (
    <div className="w-full flex flex-col gap-6" id="evolutionary-tech-tree-panel">
      {/* Intro Header */}
      <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
        <GitMerge className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5 animate-pulse" />
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Matriz de Conexões Evolutivas</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Evolua a biologia do seu microuniverso sintetizando saltos evolutivos primordiais. Desbloqueie novas Eras completando as tecnologias principais de cada patamar.
          </p>
        </div>
      </div>

      {/* Eras Tech Boards */}
      {ERAS.map((era) => {
        const eraTechs = getTechsByEra(era.id);
        if (eraTechs.length === 0) return null;

        // Check if previous eras are unlocked so the tech tree panel remains structured
        const isEraUnlocked = state.unlockedEras.includes(era.id);
        const currency = getEraCurrency(era.id);

        return (
          <div 
            key={era.id} 
            className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
              isEraUnlocked 
                ? 'bg-slate-950/60 border-slate-800/80' 
                : 'bg-slate-950/20 border-slate-900/40 opacity-40 select-none'
            }`}
          >
            {/* Era Title */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${era.color}-500`} />
                {era.name}
              </span>
              {!isEraUnlocked && (
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                  Bloqueado: Avance nas Eras
                </span>
              )}
            </div>

            {/* Grid of Tech Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {eraTechs.map((tech) => {
                const isUnlocked = state.unlockedTechIds.includes(tech.id);
                const depMet = isDependencyMet(tech);
                const canAfford = currency.balance >= tech.cost;
                const isBuyable = depMet && canAfford && !isUnlocked;

                // Dependency labels
                const priorTechs = tech.dependencies.map(depId => {
                  const prior = TECH_TREE.find(t => t.id === depId);
                  return prior ? prior.name : depId;
                });

                return (
                  <div
                    key={tech.id}
                    className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                      isUnlocked 
                        ? 'bg-emerald-950/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                        : isBuyable 
                          ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700' 
                          : 'bg-slate-950/50 border-slate-900/60'
                    }`}
                  >
                    {/* Top Content */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2.5 items-start">
                          <div className={`p-2 rounded-lg border ${
                            isUnlocked 
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                              : depMet 
                                ? 'bg-slate-900 border-slate-800 text-slate-300' 
                                : 'bg-slate-950 border-slate-900 text-slate-600'
                          }`}>
                            <IconRenderer name={tech.icon} className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white tracking-tight leading-snug">
                              {tech.name}
                            </h5>
                            <p className="text-xs text-slate-400 mt-1 leading-normal pr-1">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dependencies check */}
                      {!depMet && (
                        <div className="mt-2.5 bg-slate-950/80 border border-slate-900 p-2 rounded-lg flex items-start gap-1.5 text-[10px] text-amber-500/90 font-mono leading-normal">
                          <Lock size={12} className="shrink-0 mt-0.5" />
                          <span>
                            Requer: {priorTechs.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Reward effect badge */}
                      <div className="mt-3 bg-slate-900/40 rounded-lg p-2 border border-slate-900 text-xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Efeito Desbloqueio</div>
                        <div className="text-slate-300 font-medium">{tech.effectDescription}</div>
                      </div>
                    </div>

                    {/* Bottom Action / Price */}
                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                      {isUnlocked ? (
                        <div className="w-full py-1.5 px-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                          <Check size={14} />
                          Descoberto e Ativo
                        </div>
                      ) : (
                        <button
                          disabled={!isBuyable}
                          onClick={() => onUnlockTech(tech.id)}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isBuyable
                              ? 'bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 active:scale-98'
                              : 'bg-slate-900/30 text-slate-600 border border-slate-900 cursor-not-allowed'
                          }`}
                        >
                          <span>Sintetizar</span>
                          <span className="flex items-center gap-1 font-mono">
                            <IconRenderer name={currency.icon} className="w-3.5 h-3.5" />
                            {formatNumber(tech.cost)}
                          </span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
