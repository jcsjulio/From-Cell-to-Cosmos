/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PermanentUpgrade, GameState } from '../types';
import { PERMANENT_UPGRADES } from '../data/prestige';
import { calculateGensEarned, formatNumber } from '../utils';
import { IconRenderer } from './MainGamePanel';
import { AlertTriangle, Check, RefreshCw, Sparkles, Zap } from 'lucide-react';

interface PrestigePanelProps {
  state: GameState;
  onPrestige: () => void;
  onBuyPermanentUpgrade: (upgradeId: string) => void;
}

export function PrestigePanel({
  state,
  onPrestige,
  onBuyPermanentUpgrade
}: PrestigePanelProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Calculate potential gens waiting to be collected
  const pendingGens = calculateGensEarned(state.lifetimeNutrients);

  // Helper to calculate current cost of a permanent upgrade based on level purchased
  const getPermUpgradeCost = (upgrade: PermanentUpgrade) => {
    const level = state.permanentUpgradeLevels[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  };

  const handlePrestigeClick = () => {
    if (pendingGens === 0) return;
    setShowConfirmModal(true);
  };

  const handleConfirmPrestige = () => {
    setShowConfirmModal(false);
    onPrestige();
  };

  return (
    <div className="w-full flex flex-col gap-5" id="controlled-extinction-prestige-panel">
      
      {/* Upper Panel: Prestige Hub */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-5 items-center justify-between">
        
        {/* Glow effect */}
        <div className="absolute w-60 h-60 rounded-full bg-emerald-500/10 blur-[60px] -left-10 -top-10 -z-10 animate-pulse" />
        
        {/* Left Stats */}
        <div className="flex flex-col gap-2.5 max-w-md">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            Estágio de Extinção Controlada
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
            Reinicie a Matriz e Ganhe Gens Evolutivos
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ao provocar uma extinção em massa deliberada, você condensa as correntes vitais do microuniverso em <span className="text-emerald-400 font-semibold font-mono">Gens Evolutivos</span> permanentes. Cada gene não gasto concede um multiplicador global de <span className="text-emerald-400 font-semibold">+10%</span> de produção passiva!
          </p>

          <div className="grid grid-cols-2 gap-3.5 mt-2">
            <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 font-mono">
              <span className="text-[10px] text-slate-500 block uppercase mb-0.5">Nutrientes Históricos</span>
              <span className="text-sm font-semibold text-white">{formatNumber(state.lifetimeNutrients)}</span>
            </div>
            <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 font-mono">
              <span className="text-[10px] text-slate-500 block uppercase mb-0.5">Gens Evolutivos Ativos</span>
              <span className="text-sm font-semibold text-emerald-400">{formatNumber(state.gensEvolutivos)}</span>
            </div>
          </div>
        </div>

        {/* Right Call to Action */}
        <div className="flex flex-col items-center gap-3 shrink-0 bg-slate-900/20 border border-slate-800/60 rounded-xl p-4 min-w-[220px] text-center">
          <span className="text-xs font-mono text-slate-400">Gens a Reivindicar:</span>
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400 animate-bounce" size={24} />
            <span className="text-3xl font-black font-mono text-emerald-400">+{formatNumber(pendingGens)}</span>
          </div>
          <p className="text-[10px] text-slate-500 max-w-[180px]">
            {pendingGens === 0 
              ? "Requer pelo menos 50K de Nutrientes Históricos acumulados para ganhar o primeiro Gene."
              : "Pronto para sintetizar a próxima geração evolutiva!"
            }
          </p>
          <button
            disabled={pendingGens === 0}
            onClick={handlePrestigeClick}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer uppercase ${
              pendingGens > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-98 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            id="trigger-controlled-extinction-button"
          >
            <RefreshCw size={14} className={pendingGens > 0 ? "animate-spin" : ""} style={{ animationDuration: '3s' }} />
            Provocar Extinção
          </button>
        </div>

      </div>

      {/* Permanent Upgrades Shop list */}
      <div className="flex flex-col gap-3.5 mt-2">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Zap size={13} className="text-amber-500" />
          Melhorias Permanentes de Prestígio ({PERMANENT_UPGRADES.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMANENT_UPGRADES.map((pu) => {
            const currentLevel = state.permanentUpgradeLevels[pu.id] || 0;
            const cost = getPermUpgradeCost(pu);
            const isMaxed = currentLevel >= pu.maxLevel;
            const canAfford = state.gensEvolutivos >= cost && !isMaxed;

            return (
              <div 
                key={pu.id}
                className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-800"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-emerald-400 flex items-center justify-center">
                        <IconRenderer name={pu.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                          {pu.name}
                          <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 border border-slate-850/50">
                            Nv. {currentLevel} / {pu.maxLevel}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {pu.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Effect details */}
                  <div className="mt-2.5 bg-slate-900/40 p-2 border border-slate-900 rounded-lg text-xs font-mono text-emerald-400/90">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">Efeito do Upgrade</div>
                    <span>{pu.effectDescription}</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="mt-4 pt-3 border-t border-slate-900">
                  {isMaxed ? (
                    <div className="w-full py-2 bg-slate-900/60 text-slate-500 border border-slate-900 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1">
                      <Check size={14} /> Maximizador Completo
                    </div>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => onBuyPermanentUpgrade(pu.id)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 active:scale-98'
                          : 'bg-slate-900/30 text-slate-600 border border-slate-900 cursor-not-allowed'
                      }`}
                    >
                      <span>Sintetizar Gene</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Sparkles size={13} className="text-emerald-400" />
                        {cost} Gens
                      </span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
                <h4 className="text-lg font-bold text-white">Iniciar Protocolo de Extinção?</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Esta ação provocará um colapso intencional da biosfera ativa. Você perderá **todos** os seus nutrientes, biomassa, forças vitais acumuladas, todos os produtores comprados e melhorias de Era. 
                <br /><br />
                Em troca, você receberá <span className="text-emerald-400 font-bold font-mono">+{formatNumber(pendingGens)} Gens Evolutivos</span> permanentes, que podem ser usados para desbloquear as poderosas melhorias ancestrais acima. Deseja prosseguir?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPrestige}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Confirmar Extinção
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
