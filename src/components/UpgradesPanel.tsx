/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Upgrade, GameState, EraId } from '../types';
import { UPGRADES } from '../data/upgrades';
import { ERAS } from '../data/eras';
import { formatNumber } from '../utils';
import { IconRenderer } from './MainGamePanel';
import { Check, EyeOff, ShieldAlert, Award, Zap } from 'lucide-react';

interface UpgradesPanelProps {
  state: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
}

export function UpgradesPanel({ state, onBuyUpgrade }: UpgradesPanelProps) {
  const currentEra = state.currentEra;
  const eraInfo = ERAS.find(e => e.id === currentEra) || ERAS[0];

  // Get current era upgrades
  const eraUpgrades = UPGRADES.filter(u => u.eraId === currentEra);

  // Separate active and purchased
  const purchasedUpgrades = eraUpgrades.filter(u => state.purchasedUpgradeIds.includes(u.id));
  const availableUpgrades = eraUpgrades.filter(u => !state.purchasedUpgradeIds.includes(u.id));

  // Determine buying currency
  const getEraCurrency = (eraId: EraId) => {
    switch (eraId) {
      case EraId.MICROSCOPIC: return { name: "Nutrientes", balance: state.nutrients, icon: "Dna" };
      case EraId.MULTICELLULAR: return { name: "Biomassa", balance: state.biomass, icon: "Database" };
      case EraId.ECOSYSTEM: return { name: "Força Vital", balance: state.vitalForce, icon: "Leaf" };
      case EraId.CIVILIZATION: return { name: "Inteligência", balance: state.intelligence, icon: "Brain" };
      case EraId.COSMIC_COLONIZATION: return { name: "Energia Cósmica", balance: state.cosmicEnergy, icon: "Orbit" };
      case EraId.LIVING_COSMOS: return { name: "Consciência Universal", balance: state.universalConsciousness, icon: "Sparkles" };
    }
  };

  const currency = getEraCurrency(currentEra);

  // Check if upgrade is revealed based on producer counts
  const isRevealed = (upgrade: Upgrade) => {
    if (!upgrade.unlockedAtProducerCount) return true;
    const req = upgrade.unlockedAtProducerCount;
    const currentCount = state.producers[req.producerId] || 0;
    return currentCount >= req.count;
  };

  return (
    <div className="w-full flex flex-col gap-5" id="upgrades-management-panel">
      {/* Available Upgrades section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Zap size={13} className="text-amber-500" />
          Melhorias Disponíveis ({availableUpgrades.length})
        </h3>

        {availableUpgrades.length === 0 ? (
          <div className="bg-slate-950/30 border border-slate-900/60 rounded-xl p-6 text-center text-xs text-slate-500">
            Nenhuma melhoria disponível nesta Era. Tente expandir suas colônias para revelar segredos!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {availableUpgrades.map((u) => {
              const revealed = isRevealed(u);
              const canAfford = currency.balance >= u.cost && revealed;

              if (!revealed) {
                // Show hidden mystery placeholder
                const req = u.unlockedAtProducerCount!;
                return (
                  <div 
                    key={u.id}
                    className="bg-slate-950/20 border border-dashed border-slate-900/80 rounded-xl p-4 flex gap-3 opacity-50 select-none"
                  >
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center self-start">
                      <EyeOff size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-500">Upgrade Mutacional Oculto</h4>
                      <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                        Requer alcançar o nível {req.count} em {req.producerId.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())} para sintetizar.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <motion.div
                  key={u.id}
                  whileHover={{ y: -1 }}
                  className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                    canAfford 
                      ? 'bg-slate-900/40 border-slate-800 hover:border-amber-500/30 hover:bg-slate-900/60 shadow-[0_4px_20px_rgba(245,158,11,0.02)]' 
                      : 'bg-slate-950/50 border-slate-900/50 opacity-90'
                  }`}
                >
                  <div className="flex gap-3 items-start mb-3">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center bg-slate-900 border ${
                      canAfford ? 'border-amber-500/20 text-amber-400' : 'border-slate-800 text-slate-500'
                    }`}>
                      <IconRenderer name={u.icon} className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                        {u.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {u.description}
                      </p>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    disabled={!canAfford}
                    onClick={() => onBuyUpgrade(u.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      canAfford
                        ? 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 border border-amber-500/30 hover:border-amber-500/60 active:scale-98'
                        : 'bg-slate-900/30 text-slate-600 border border-slate-900 cursor-not-allowed'
                    }`}
                  >
                    <span>Sintetizar Melhoria</span>
                    <span className="flex items-center gap-1 font-mono">
                      <IconRenderer name={currency.icon} className="w-3.5 h-3.5" />
                      {formatNumber(u.cost)}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchased Upgrades section */}
      {purchasedUpgrades.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Award size={13} className="text-emerald-500/60" />
            Melhorias Ativas ({purchasedUpgrades.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {purchasedUpgrades.map((u) => (
              <div 
                key={u.id}
                className="bg-slate-950/40 border border-emerald-950/30 rounded-lg p-2.5 flex items-center gap-2 relative group"
                title={u.description}
              >
                <div className="p-1.5 rounded-md bg-emerald-950/20 border border-emerald-800/30 text-emerald-400">
                  <Check size={14} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Sintetizado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
