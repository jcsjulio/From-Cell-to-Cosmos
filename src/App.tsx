/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, Database, Leaf, Brain, Orbit, Sparkles, HelpCircle, 
  Trophy, GitMerge, Zap, BellRing, ChevronRight, RefreshCw, X, Play, Clock,
  Infinity as InfinityIcon, Lock
} from 'lucide-react';

import { GameState, EraId, ActiveEvent, GameEvent } from './types';
import { ERAS } from './data/eras';
import { PRODUCERS } from './data/producers';
import { UPGRADES } from './data/upgrades';
import { TECH_TREE } from './data/techTree';
import { PERMANENT_UPGRADES } from './data/prestige';
import { RANDOM_EVENTS } from './data/events';

import { 
  getDefaultGameState, 
  calculatePassiveProduction, 
  calculateClickPower, 
  calculateGensEarned,
  getProducerCost,
  formatNumber,
  INITIAL_VERSION
} from './utils';

// Import child views
import { MainGamePanel } from './components/MainGamePanel';
import { ProducersPanel } from './components/ProducersPanel';
import { UpgradesPanel } from './components/UpgradesPanel';
import { TechTreePanel } from './components/TechTreePanel';
import { PrestigePanel } from './components/PrestigePanel';
import { StatsPanel } from './components/StatsPanel';
import { EventsPanel } from './components/EventsPanel';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [state, setState] = useState<GameState>(getDefaultGameState());
  const [activeTab, setActiveTab] = useState<'main' | 'producers' | 'upgrades' | 'tech' | 'prestige' | 'stats' | 'events'>('main');
  
  // Modals & Overlay triggers
  const [helpOpen, setHelpOpen] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [offlineReport, setOfflineReport] = useState<{ seconds: number; gained: Record<string, number> } | null>(null);
  
  // Event state
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [eventCooldown, setEventCooldown] = useState(75); // Seconds until next event check
  const [notificationLog, setNotificationLog] = useState<string[]>([]);

  // Victory screen trigger (when ultimate omega tech is bought)
  const [showVictory, setShowVictory] = useState(false);

  // References
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  // 1. LOAD GAME ON MOUNT + COMPUTE OFFLINE GAINS
  useEffect(() => {
    const saved = localStorage.getItem('microverse_save_state_v1');
    let loadedState: GameState;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrations/Sanitizations if fields missing
        if (!parsed.unlockedEras) parsed.unlockedEras = [EraId.MICROSCOPIC];
        if (!parsed.stats) parsed.stats = getDefaultGameState().stats;
        loadedState = parsed;
      } catch (e) {
        loadedState = getDefaultGameState();
      }
    } else {
      loadedState = getDefaultGameState();
    }

    // Check for offline progress
    const now = Date.now();
    const lastSaved = loadedState.lastSavedAt || now;
    const secondsPassed = Math.floor((now - lastSaved) / 1000);

    if (secondsPassed > 15) {
      // Calculate offline gains across all unlocked eras
      const gained: Record<string, number> = {};
      const offlineEfficiency = 0.10 + (loadedState.permanentUpgradeLevels["perm_energia_vacuo"] || 0) * 0.08;

      loadedState.unlockedEras.forEach((eraId) => {
        const passiveSec = calculatePassiveProduction(loadedState, eraId);
        if (passiveSec > 0) {
          const totalGained = passiveSec * secondsPassed * offlineEfficiency;
          gained[eraId] = totalGained;
          
          // Add to current balances
          switch (eraId) {
            case EraId.MICROSCOPIC: 
              loadedState.nutrients += totalGained; 
              break;
            case EraId.MULTICELLULAR: 
              loadedState.biomass += totalGained; 
              break;
            case EraId.ECOSYSTEM: 
              loadedState.vitalForce += totalGained; 
              break;
            case EraId.CIVILIZATION: 
              loadedState.intelligence += totalGained; 
              break;
            case EraId.COSMIC_COLONIZATION: 
              loadedState.cosmicEnergy += totalGained; 
              break;
            case EraId.LIVING_COSMOS: 
              loadedState.universalConsciousness += totalGained; 
              break;
          }

          // Convert to lifetime nutrients so prestige doesn't lose credit
          let convertMultiplier = 1;
          if (eraId === EraId.MULTICELLULAR) convertMultiplier = 5000;
          if (eraId === EraId.ECOSYSTEM) convertMultiplier = 1000000;
          if (eraId === EraId.CIVILIZATION) convertMultiplier = 250000000;
          if (eraId === EraId.COSMIC_COLONIZATION) convertMultiplier = 50000000000;
          if (eraId === EraId.LIVING_COSMOS) convertMultiplier = 10000000000000;

          loadedState.lifetimeNutrients += totalGained * convertMultiplier;
        }
      });

      if (Object.keys(gained).length > 0) {
        setOfflineReport({ seconds: secondsPassed, gained });
        addLog(`Ausência detectada: ${secondsPassed}s. Bio-sintetizadores geraram recursos offline!`);
      }
    }

    setState(loadedState);
  }, []);

  // Helpers to push notification messages
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setNotificationLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  // 2. TICK ENGINE (Runs every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const next = { ...prev };
        const now = Date.now();
        
        // Accumulate resources across all unlocked eras
        prev.unlockedEras.forEach((eraId) => {
          const passiveSec = calculatePassiveProduction(prev, eraId, activeEvent?.event.id);
          const passiveTick = passiveSec / 10; // 100ms tick

          switch (eraId) {
            case EraId.MICROSCOPIC:
              next.nutrients += passiveTick;
              next.lifetimeNutrients += passiveTick;
              break;
            case EraId.MULTICELLULAR:
              next.biomass += passiveTick;
              next.lifetimeNutrients += passiveTick * 5000;
              break;
            case EraId.ECOSYSTEM:
              next.vitalForce += passiveTick;
              next.lifetimeNutrients += passiveTick * 1000000;
              break;
            case EraId.CIVILIZATION:
              next.intelligence += passiveTick;
              next.lifetimeNutrients += passiveTick * 250000000;
              break;
            case EraId.COSMIC_COLONIZATION:
              next.cosmicEnergy += passiveTick;
              next.lifetimeNutrients += passiveTick * 50000000000;
              break;
            case EraId.LIVING_COSMOS:
              next.universalConsciousness += passiveTick;
              next.lifetimeNutrients += passiveTick * 10000000000000;
              break;
          }
        });

        // Update playtime counter (every 1s)
        const elapsedSinceLastTick = now - prev.lastSavedAt;
        if (elapsedSinceLastTick >= 1000) {
          next.stats.totalTimePlayedSeconds += 1;
        }

        next.lastSavedAt = now;
        return next;
      });

      // Update event timers
      setActiveEvent(prevEvent => {
        if (!prevEvent) return null;
        if (prevEvent.secondsRemaining <= 1) {
          addLog(`O evento "${prevEvent.event.name}" chegou ao fim.`);
          return null;
        }
        return {
          ...prevEvent,
          secondsRemaining: prevEvent.secondsRemaining - 1
        };
      });

    }, 100);

    return () => clearInterval(interval);
  }, [activeEvent]);

  // 3. EVENT SPAWNER SUB-TICK (Ticks every 1 second)
  useEffect(() => {
    const spawnerInterval = setInterval(() => {
      if (activeEvent) return; // Wait for active event to clear before CD counts

      setEventCooldown(prev => {
        if (prev <= 1) {
          // Trigger event!
          const randomIdx = Math.floor(Math.random() * RANDOM_EVENTS.length);
          const selected = RANDOM_EVENTS[randomIdx];
          
          // Apply prestige "perm_acelerador_temporal" duration boost (+10% per level)
          const lvl = stateRef.current.permanentUpgradeLevels["perm_acelerador_temporal"] || 0;
          const duration = Math.floor(selected.durationSeconds * (1 + lvl * 0.10));

          setActiveEvent({
            event: selected,
            secondsRemaining: duration,
            totalDuration: duration
          });

          addLog(`FENÔMENO DETECTADO: "${selected.name}" está ativo!`);
          
          // Reset cooldown (60-120 seconds base, reduced by temporal accelerator level)
          const cdScale = Math.max(0.40, 1 - lvl * 0.08); // down to 40% cooldown time
          const baseCD = Math.floor((60 + Math.random() * 40) * cdScale);
          return baseCD;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(spawnerInterval);
  }, [activeEvent]);

  // 4. AUTO-SAVE (Every 15 seconds)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame();
    }, 15000);
    return () => clearInterval(saveInterval);
  }, []);

  const saveGame = () => {
    localStorage.setItem('microverse_save_state_v1', JSON.stringify(stateRef.current));
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  // 5. CORE ACTIONS

  // Manual clicking
  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickVal = calculateClickPower(state, state.currentEra, activeEvent?.event.id);
    
    setState(prev => {
      const next = { ...prev };
      next.stats.totalClicks += 1;

      switch (prev.currentEra) {
        case EraId.MICROSCOPIC:
          next.nutrients += clickVal;
          next.lifetimeNutrients += clickVal;
          break;
        case EraId.MULTICELLULAR:
          next.biomass += clickVal;
          next.lifetimeNutrients += clickVal * 5000;
          break;
        case EraId.ECOSYSTEM:
          next.vitalForce += clickVal;
          next.lifetimeNutrients += clickVal * 1000000;
          break;
        case EraId.CIVILIZATION:
          next.intelligence += clickVal;
          next.lifetimeNutrients += clickVal * 250000000;
          break;
        case EraId.COSMIC_COLONIZATION:
          next.cosmicEnergy += clickVal;
          next.lifetimeNutrients += clickVal * 50000000000;
          break;
        case EraId.LIVING_COSMOS:
          next.universalConsciousness += clickVal;
          next.lifetimeNutrients += clickVal * 10000000000000;
          break;
      }
      return next;
    });
  };

  // Buy automated unit
  const handleBuyProducer = (producerId: string, quantity: number) => {
    const producer = PRODUCERS.find(p => p.id === producerId);
    if (!producer) return;

    setState(prev => {
      const next = { ...prev };
      const currentCount = prev.producers[producerId] || 0;
      
      // Calculate compound cost
      let totalCost = 0;
      let tempCount = currentCount;
      for (let i = 0; i < quantity; i++) {
        totalCost += getProducerCost(producer, tempCount, prev);
        tempCount++;
      }

      // Check and deduct currency
      let hasFunds = false;
      switch (producer.eraId) {
        case EraId.MICROSCOPIC:
          if (prev.nutrients >= totalCost) {
            next.nutrients -= totalCost;
            hasFunds = true;
          }
          break;
        case EraId.MULTICELLULAR:
          if (prev.nutrients >= totalCost) {
            next.nutrients -= totalCost;
            hasFunds = true;
          }
          break;
        case EraId.ECOSYSTEM:
          if (prev.biomass >= totalCost) {
            next.biomass -= totalCost;
            hasFunds = true;
          }
          break;
        case EraId.CIVILIZATION:
          if (prev.vitalForce >= totalCost) {
            next.vitalForce -= totalCost;
            hasFunds = true;
          }
          break;
        case EraId.COSMIC_COLONIZATION:
          if (prev.intelligence >= totalCost) {
            next.intelligence -= totalCost;
            hasFunds = true;
          }
          break;
        case EraId.LIVING_COSMOS:
          if (prev.cosmicEnergy >= totalCost) {
            next.cosmicEnergy -= totalCost;
            hasFunds = true;
          }
          break;
      }

      if (hasFunds) {
        next.producers[producerId] = currentCount + quantity;
        addLog(`Sintetizado: ${quantity}x ${producer.name}.`);
      }

      return next;
    });
  };

  // Buy upgrades
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    setState(prev => {
      if (prev.purchasedUpgradeIds.includes(upgradeId)) return prev;
      const next = { ...prev };
      
      let hasFunds = false;
      switch (upgrade.eraId) {
        case EraId.MICROSCOPIC:
          if (prev.nutrients >= upgrade.cost) {
            next.nutrients -= upgrade.cost;
            hasFunds = true;
          }
          break;
        case EraId.MULTICELLULAR:
          if (prev.biomass >= upgrade.cost) {
            next.biomass -= upgrade.cost;
            hasFunds = true;
          }
          break;
        case EraId.ECOSYSTEM:
          if (prev.vitalForce >= upgrade.cost) {
            next.vitalForce -= upgrade.cost;
            hasFunds = true;
          }
          break;
        case EraId.CIVILIZATION:
          if (prev.intelligence >= upgrade.cost) {
            next.intelligence -= upgrade.cost;
            hasFunds = true;
          }
          break;
        case EraId.COSMIC_COLONIZATION:
          if (prev.cosmicEnergy >= upgrade.cost) {
            next.cosmicEnergy -= upgrade.cost;
            hasFunds = true;
          }
          break;
        case EraId.LIVING_COSMOS:
          if (prev.universalConsciousness >= upgrade.cost) {
            next.universalConsciousness -= upgrade.cost;
            hasFunds = true;
          }
          break;
      }

      if (hasFunds) {
        next.purchasedUpgradeIds.push(upgradeId);
        addLog(`Sintetizado upgrade: "${upgrade.name}".`);
      }

      return next;
    });
  };

  // Research Tech Tree Nodes
  const handleUnlockTech = (techId: string) => {
    const tech = TECH_TREE.find(t => t.id === techId);
    if (!tech) return;

    setState(prev => {
      if (prev.unlockedTechIds.includes(techId)) return prev;
      const next = { ...prev };

      let hasFunds = false;
      switch (tech.eraId) {
        case EraId.MICROSCOPIC:
          if (prev.nutrients >= tech.cost) {
            next.nutrients -= tech.cost;
            hasFunds = true;
          }
          break;
        case EraId.MULTICELLULAR:
          if (prev.biomass >= tech.cost) {
            next.biomass -= tech.cost;
            hasFunds = true;
          }
          break;
        case EraId.ECOSYSTEM:
          if (prev.vitalForce >= tech.cost) {
            next.vitalForce -= tech.cost;
            hasFunds = true;
          }
          break;
        case EraId.CIVILIZATION:
          if (prev.intelligence >= tech.cost) {
            next.intelligence -= tech.cost;
            hasFunds = true;
          }
          break;
        case EraId.COSMIC_COLONIZATION:
          if (prev.cosmicEnergy >= tech.cost) {
            next.cosmicEnergy -= tech.cost;
            hasFunds = true;
          }
          break;
        case EraId.LIVING_COSMOS:
          if (prev.universalConsciousness >= tech.cost) {
            next.universalConsciousness -= tech.cost;
            hasFunds = true;
          }
          break;
      }

      if (hasFunds) {
        next.unlockedTechIds.push(techId);
        addLog(`Saltos evolutivos descobertos: "${tech.name}".`);

        // Check for Era expansions
        if (techId === "eucarionte_cel" && !prev.unlockedEras.includes(EraId.MULTICELLULAR)) {
          next.unlockedEras.push(EraId.MULTICELLULAR);
          addLog("NOVA ERA ALCANÇADA: Era Multicelular desbloqueada!");
        }
        if (techId === "conquista_terra" && !prev.unlockedEras.includes(EraId.ECOSYSTEM)) {
          next.unlockedEras.push(EraId.ECOSYSTEM);
          addLog("NOVA ERA ALCANÇADA: Era de Ecossistemas desbloqueada!");
        }
        if (techId === "sistema_nervoso" && !prev.unlockedEras.includes(EraId.CIVILIZATION)) {
          next.unlockedEras.push(EraId.CIVILIZATION);
          addLog("NOVA ERA ALCANÇADA: Era da Civilização desbloqueada!");
        }
        if (techId === "viagem_espacial" && !prev.unlockedEras.includes(EraId.COSMIC_COLONIZATION)) {
          next.unlockedEras.push(EraId.COSMIC_COLONIZATION);
          addLog("NOVA ERA ALCANÇADA: Era de Colonização Cósmica desbloqueada!");
        }
        if (techId === "manipulacao_singularidades" && !prev.unlockedEras.includes(EraId.LIVING_COSMOS)) {
          next.unlockedEras.push(EraId.LIVING_COSMOS);
          addLog("NOVA ERA ALCANÇADA: Era do Cosmos Vivo desbloqueada!");
        }
        if (techId === "ponto_omega") {
          setShowVictory(true);
        }
      }

      return next;
    });
  };

  // Prestige Reset ("Extincao Controlada")
  const handlePrestige = () => {
    const pendingGens = calculateGensEarned(state.lifetimeNutrients);
    if (pendingGens === 0) return;

    setState(prev => {
      const next = getDefaultGameState();
      
      // Transfer prestige currency and stats
      next.gensEvolutivos = prev.gensEvolutivos + pendingGens;
      next.spentGensEvolutivos = prev.spentGensEvolutivos;
      next.permanentUpgradeLevels = prev.permanentUpgradeLevels;
      
      // Lifetime stats remain accrued
      next.lifetimeNutrients = prev.lifetimeNutrients;
      next.stats = {
        ...prev.stats,
        totalPrestigedCount: prev.stats.totalPrestigedCount + 1,
        totalGensEarned: prev.stats.totalGensEarned + pendingGens,
      };

      // Apply "perm_heranca_genetica" permanent upgrade level
      // Preserves 5% of Era 0 simple bacteria per level
      const herancaLevel = prev.permanentUpgradeLevels["perm_heranca_genetica"] || 0;
      if (herancaLevel > 0) {
        const retainedBacteria = Math.floor((prev.producers["bacteria_simples"] || 0) * (herancaLevel * 0.05));
        next.producers["bacteria_simples"] = retainedBacteria;
      }

      // Preserve unlocked Eras up to the maximum achieved, or force gradual climbing?
      // Gradual climbing is standard, but keeping the eras unlocked is more modern and dynamic.
      // Let's reset unlocked eras to microscopic to maintain the prestige challenge loop,
      // but they will climb back extremely fast due to massive multipliers. That is the ideal idle loops.
      next.unlockedEras = [EraId.MICROSCOPIC];
      next.currentEra = EraId.MICROSCOPIC;

      addLog(`EXTINÇÃO PROVOCADA: Condensados +${pendingGens} Gens. Recomeçando a simulação...`);

      return next;
    });

    // Reset current active tab to Central
    setActiveTab('main');
  };

  // Buy prestige permanent upgrades using Gens
  const handleBuyPermanentUpgrade = (upgradeId: string) => {
    const upgrade = PERMANENT_UPGRADES.find(pu => pu.id === upgradeId);
    if (!upgrade) return;

    setState(prev => {
      const currentLevel = prev.permanentUpgradeLevels[upgradeId] || 0;
      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

      if (prev.gensEvolutivos >= cost && currentLevel < upgrade.maxLevel) {
        const next = { ...prev };
        next.gensEvolutivos -= cost;
        next.spentGensEvolutivos += cost;
        next.permanentUpgradeLevels[upgradeId] = currentLevel + 1;
        
        addLog(`Gene Ancestral Ativado: Nível ${currentLevel + 1} em "${upgrade.name}".`);
        return next;
      }
      return prev;
    });
  };

  // Update current era selection
  const handleSwitchEra = (eraId: EraId) => {
    if (!state.unlockedEras.includes(eraId)) return;
    setState(prev => {
      const next = { ...prev };
      next.currentEra = eraId;
      if (eraId > next.stats.highestEraReached) {
        next.stats.highestEraReached = eraId;
      }
      return next;
    });
    addLog(`Foco redirecionado: ${ERAS.find(e => e.id === eraId)?.name}.`);
  };

  // Render currently selected tab view
  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <MainGamePanel 
            state={state}
            onClickMain={handleMainClick}
            activeEventId={activeEvent?.event.id}
            onSave={saveGame}
            showSaveIndicator={showSaveIndicator}
          />
        );
      case 'producers':
        return (
          <ProducersPanel 
            state={state}
            onBuyProducer={handleBuyProducer}
          />
        );
      case 'upgrades':
        return (
          <UpgradesPanel 
            state={state}
            onBuyUpgrade={handleBuyUpgrade}
          />
        );
      case 'tech':
        return (
          <TechTreePanel 
            state={state}
            onUnlockTech={handleUnlockTech}
          />
        );
      case 'prestige':
        return (
          <PrestigePanel 
            state={state}
            onPrestige={handlePrestige}
            onBuyPermanentUpgrade={handleBuyPermanentUpgrade}
          />
        );
      case 'stats':
        return (
          <StatsPanel state={state} />
        );
      case 'events':
        return (
          <EventsPanel 
            activeEvent={activeEvent}
            notificationLog={notificationLog}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* BACKGROUND PARTICLES AMBIENT EFFECT */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(6,182,212,0.04),rgba(255,255,255,0))] pointer-events-none -z-20" />

      {/* HEADER HUD BAR */}
      <header className="w-full bg-slate-950/80 border-b border-slate-900 sticky top-0 z-30 backdrop-blur-md px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest font-mono text-white flex items-center gap-1">
                MICROVERSE
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1 rounded">IDLE</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">From Cell to Cosmos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Stats Summary */}
            <div className="hidden lg:flex items-center gap-4 border-r border-slate-900 pr-4">
              <div className="text-right font-mono">
                <span className="text-[9px] text-slate-500 block uppercase">Gens Ativos</span>
                <span className="text-xs font-bold text-emerald-400">🧬 {formatNumber(state.gensEvolutivos)}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-[9px] text-slate-500 block uppercase">Tempo</span>
                <span className="text-xs font-bold text-slate-300">
                  {Math.floor(state.stats.totalTimePlayedSeconds / 60)}m
                </span>
              </div>
            </div>

            <button 
              onClick={() => setHelpOpen(true)}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50 cursor-pointer transition-all flex items-center gap-1 text-xs font-mono font-medium"
              id="btn-help-modal-trigger"
            >
              <HelpCircle size={15} />
              <span className="hidden sm:inline">Guia</span>
            </button>
          </div>

        </div>
      </header>

      {/* HORIZONTAL SCROLLER FOR UNLOCKED ERAS */}
      <div className="w-full bg-slate-950/60 border-b border-slate-900/60 py-2.5 px-4 overflow-x-auto scrollbar-none flex gap-2 justify-start md:justify-center">
        {ERAS.map((e) => {
          const isUnlocked = state.unlockedEras.includes(e.id);
          const isActive = state.currentEra === e.id;

          if (!isUnlocked) {
            return (
              <div 
                key={e.id}
                className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-950 opacity-25 text-xs font-mono select-none shrink-0 flex items-center gap-1.5 cursor-not-allowed"
              >
                <Lock size={12} />
                Era Oculta
              </div>
            );
          }

          return (
            <button
              key={e.id}
              onClick={() => handleSwitchEra(e.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'bg-slate-900/40 text-slate-400 border-slate-900 hover:text-slate-200 hover:bg-slate-900/70'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              {e.name}
            </button>
          );
        })}
      </div>

      {/* CORE LAYOUT BOX */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* SIDE BAR / TAB MENU (Responsive) */}
        <nav className="w-full lg:w-60 flex lg:flex-col gap-1.5 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-slate-900/60 lg:pr-4">
          
          <button
            onClick={() => setActiveTab('main')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'main'
                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock size={15} />
              Setor Central
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('producers')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'producers'
                ? 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database size={15} />
              Colônias Ativas
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('upgrades')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'upgrades'
                ? 'bg-teal-950/20 text-teal-400 border-teal-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <Zap size={15} />
              Sintetizar Upgrades
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'tech'
                ? 'bg-indigo-950/20 text-indigo-400 border-indigo-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <GitMerge size={15} />
              Evolução Tech
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('prestige')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'prestige'
                ? 'bg-purple-950/20 text-purple-400 border-purple-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <RefreshCw size={15} />
              Extinção Controlada
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'events'
                ? 'bg-pink-950/20 text-pink-400 border-pink-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <BellRing size={15} />
              Eventos Cósmicos
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-between cursor-pointer shrink-0 lg:shrink border ${
              activeTab === 'stats'
                ? 'bg-amber-950/20 text-amber-400 border-amber-500/20 font-black'
                : 'bg-slate-900/10 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy size={15} />
              Estatísticas
            </span>
            <ChevronRight size={14} className="hidden lg:inline opacity-60" />
          </button>

        </nav>

        {/* WORKSTAGE VIEWPORT */}
        <div className="flex-1 min-w-0" id="game-active-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* 6. HELP MANUAL OVERLAY MODAL */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* 7. OFFLINE PROGRESS OVERLAY MODAL */}
      <AnimatePresence>
        {offlineReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-2.5 text-emerald-400 mb-4 border-b border-slate-800 pb-2.5">
                <Sparkles size={20} className="animate-spin" />
                <h4 className="text-base font-bold text-white uppercase tracking-wider">Bio-Sintetização Offline</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Você esteve ausente por <span className="text-white font-mono font-bold">{(offlineReport.seconds / 60).toFixed(1)} minutos</span>. Durante este período, as correntes químicas do seu microuniverso continuaram a metabolizar compostos vitais:
              </p>

              {/* Grid with earned values */}
              <div className="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850/60 mb-5 font-mono text-xs">
                {Object.entries(offlineReport.gained).map(([eraId, totalGained]) => {
                  const eraName = ERAS.find(e => e.id === Number(eraId))?.name || "Era";
                  return (
                    <div key={eraId} className="flex justify-between items-center py-1 border-b border-slate-900 last:border-0">
                      <span className="text-slate-400 font-medium">{eraName}</span>
                      <span className="text-emerald-400 font-bold">+{formatNumber(totalGained as number)}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setOfflineReport(null)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 cursor-pointer transition-all uppercase"
              >
                Coletar e Prosseguir
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. VICTORY OVERLAY MODAL */}
      <AnimatePresence>
        {showVictory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center relative overflow-hidden"
            >
              {/* Confetti-like ambient glows */}
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-pink-500/10 blur-[50px] animate-pulse" />
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-[50px] animate-pulse" />

              <div className="flex justify-center mb-5">
                <div className="p-4 bg-amber-950/20 border-2 border-amber-500/40 rounded-full text-amber-400 animate-bounce">
                  <InfinityIcon size={48} />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-widest font-mono text-amber-400 uppercase">TRANSCENDÊNCIA COMPLETA</h2>
              <h3 className="text-base font-bold text-white mt-1">O Ponto Ômega Foi Alcançado!</h3>
              
              <p className="text-xs text-slate-300 leading-relaxed mt-4 max-w-sm mx-auto">
                Seu microuniverso evoluiu além das restrições tridimensionais da matéria biológica clássica. A rede neural de senciência viva envolveu todo o espaço-tempo cósmico, desencadeando um colapso criativo auto-sustentável. 
                <br /><br />
                Você agora tece novas leis da física, semeia universos inteiros e conduz a eternidade biológica do hiperespaço de forma livre e consciente.
              </p>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/80 my-5 text-xs text-slate-400 max-w-md mx-auto leading-normal">
                <span className="text-amber-400 font-bold block uppercase font-mono mb-1">Estatísticas do Criador</span>
                <div className="grid grid-cols-2 gap-2 text-left font-mono mt-2">
                  <span>Toques Manuais:</span> <span className="text-white text-right">{formatNumber(state.stats.totalClicks)}</span>
                  <span>Extinções:</span> <span className="text-white text-right">{state.stats.totalPrestigedCount}</span>
                  <span>Tempo de Jogo:</span> <span className="text-white text-right">{Math.floor(state.stats.totalTimePlayedSeconds / 60)} minutos</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowVictory(false)}
                  className="px-6 py-3 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer uppercase tracking-widest transition-all"
                >
                  Continuar Simulando
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER CODES */}
      <footer className="w-full py-4 text-center border-t border-slate-900 mt-auto select-none">
        <span className="text-[10px] text-slate-600 font-mono tracking-wider uppercase">
          Microverse Sim v{INITIAL_VERSION} • Desenvolvido na Workspace Biotecnológica
        </span>
      </footer>

    </div>
  );
}
