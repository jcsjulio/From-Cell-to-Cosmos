/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Producer, GameState, EraId } from '../types';
import { PRODUCERS } from '../data/producers';
import { ERAS } from '../data/eras';
import { TECH_TREE } from '../data/techTree';
import { getProducerCost, formatNumber } from '../utils';
import { IconRenderer } from './MainGamePanel';
import { Lock, ShoppingCart, Zap } from 'lucide-react';

interface ProducersPanelProps {
  state: GameState;
  onBuyProducer: (producerId: string, quantity: number) => void;
}

type BuyAmount = 1 | 10 | 'max';

export function ProducersPanel({ state, onBuyProducer }: ProducersPanelProps) {
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(1);
  const currentEra = state.currentEra;
  const eraInfo = ERAS.find(e => e.id === currentEra) || ERAS[0];

  // Producers for this era
  const eraProducers = PRODUCERS.filter(p => p.eraId === currentEra);

  // Helper to determine what currency is used to buy producers of the current era
  const getEraBuyingCurrency = (eraId: EraId) => {
    switch (eraId) {
      case EraId.MICROSCOPIC: return { name: "Nutrientes", balance: state.nutrients, icon: "Dna" };
      case EraId.MULTICELLULAR: return { name: "Nutrientes", balance: state.nutrients, icon: "Dna" };
      case EraId.ECOSYSTEM: return { name: "Biomassa", balance: state.biomass, icon: "Database" };
      case EraId.CIVILIZATION: return { name: "Força Vital", balance: state.vitalForce, icon: "Leaf" };
      case EraId.COSMIC_COLONIZATION: return { name: "Inteligência", balance: state.intelligence, icon: "Brain" };
      case EraId.LIVING_COSMOS: return { name: "Energia Cósmica", balance: state.cosmicEnergy, icon: "Orbit" };
    }
  };

  const buyingCurrency = getEraBuyingCurrency(currentEra);

  // Calculate total cost and afford count for any producer
  const getPurchaseDetails = (producer: Producer) => {
    const currentCount = state.producers[producer.id] || 0;
    const balance = buyingCurrency.balance;

    if (buyAmount === 1) {
      const cost = getProducerCost(producer, currentCount, state);
      return { cost, quantity: 1, canAfford: balance >= cost };
    } else if (buyAmount === 10) {
      let totalCost = 0;
      let tempCount = currentCount;
      for (let i = 0; i < 10; i++) {
        totalCost += getProducerCost(producer, tempCount, state);
        tempCount++;
      }
      return { cost: totalCost, quantity: 10, canAfford: balance >= totalCost };
    } else {
      // Buy MAX
      let totalCost = 0;
      let quantity = 0;
      let tempCount = currentCount;
      while (true) {
        const nextCost = getProducerCost(producer, tempCount, state);
        if (totalCost + nextCost <= balance && quantity < 1000) {
          totalCost += nextCost;
          quantity++;
          tempCount++;
        } else {
          break;
        }
      }
      if (quantity === 0) {
        // Can't even buy 1
        return { cost: getProducerCost(producer, currentCount, state), quantity: 1, canAfford: false };
      }
      return { cost: totalCost, quantity, canAfford: true };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4" id="producers-management-panel">
      {/* Selector of Buy Quantity */}
      <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
        <span className="text-xs font-mono text-slate-400 font-medium">Quantidade de Compra:</span>
        <div className="flex gap-1.5">
          {([1, 10, 'max'] as BuyAmount[]).map((amt) => (
            <button
              key={amt}
              onClick={() => setBuyAmount(amt)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer uppercase ${
                buyAmount === amt
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {amt === 'max' ? 'Max' : `x${amt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Producers List */}
      <div className="grid grid-cols-1 gap-3">
        {eraProducers.map((p) => {
          const currentCount = state.producers[p.id] || 0;
          const { cost, quantity, canAfford } = getPurchaseDetails(p);

          // Check technology lock
          const isLockedByTech = p.unlockedByTechId 
            ? !state.unlockedTechIds.includes(p.unlockedByTechId) 
            : false;
          
          const techRequired = p.unlockedByTechId 
            ? TECH_TREE.find(t => t.id === p.unlockedByTechId) 
            : null;

          if (isLockedByTech) {
            return (
              <div 
                key={p.id}
                className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 flex flex-col items-center justify-center text-center opacity-60 min-h-[160px] relative overflow-hidden group"
              >
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-500">
                  Bloqueado
                </div>
                <Lock className="w-8 h-8 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-slate-400">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Requer tecnologia <span className="text-amber-500/90 font-mono font-bold">"{techRequired?.name || p.unlockedByTechId}"</span> na aba Evolução.
                </p>
              </div>
            );
          }

          return (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.01 }}
              className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                canAfford 
                  ? 'bg-slate-900/40 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/60 shadow-[0_4px_20px_rgba(16,185,129,0.02)]' 
                  : 'bg-slate-950/50 border-slate-900/50 opacity-90'
              }`}
            >
              {/* Producer Top Info */}
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex gap-2.5">
                  <div className={`p-2.5 rounded-lg flex items-center justify-center bg-slate-900/80 border ${
                    canAfford ? 'border-emerald-500/20 text-emerald-400' : 'border-slate-800 text-slate-400'
                  }`}>
                    <IconRenderer name={p.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      {p.name}
                      <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 font-semibold border border-slate-800/60">
                        {currentCount}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed pr-2">
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="w-full bg-slate-900/40 border border-slate-900 rounded-lg p-2 flex justify-between items-center text-xs mb-3 font-mono">
                <div className="flex items-center gap-1 text-slate-500">
                  <Zap size={13} className="text-amber-500/70" />
                  Geração Unitária:
                </div>
                <div className="font-semibold text-slate-300">
                  +{formatNumber(p.baseProduction)}/s {eraInfo.resourceName.slice(0, 3)}
                </div>
              </div>

              {/* Purchase Button */}
              <button
                disabled={!canAfford}
                onClick={() => onBuyProducer(p.id, quantity)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  canAfford
                    ? 'bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 active:scale-98'
                    : 'bg-slate-900/30 text-slate-600 border border-slate-900 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingCart size={13} />
                  Comprar {buyAmount === 'max' ? `Max (${quantity})` : `x${quantity}`}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <IconRenderer name={buyingCurrency.icon} className="w-3.5 h-3.5" />
                  {formatNumber(cost)}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
