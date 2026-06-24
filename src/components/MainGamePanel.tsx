/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Save, Sparkles, Zap, Flame, Award, Trophy, Info
} from 'lucide-react';
import { GameState, EraId } from '../types';
import { ERAS } from '../data/eras';
import { formatNumber, calculateClickPower, calculatePassiveProduction } from '../utils';
import * as Icons from 'lucide-react';

interface MainGamePanelProps {
  state: GameState;
  onClickMain: (e: React.MouseEvent<HTMLDivElement>) => void;
  activeEventId?: string;
  onSave: () => void;
  showSaveIndicator: boolean;
}

export function IconRenderer({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const IconComp = (Icons as any)[name];
  if (!IconComp) return <Icons.HelpCircle className={className} style={style} />;
  return <IconComp className={className} style={style} />;
}

export function MainGamePanel({
  state,
  onClickMain,
  activeEventId,
  onSave,
  showSaveIndicator
}: MainGamePanelProps) {
  const era = ERAS.find(e => e.id === state.currentEra) || ERAS[0];
  const [clickParticles, setClickParticles] = useState<{ id: number; x: number; y: number; val: string }[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const particleIdRef = useRef(0);
  const orbRef = useRef<HTMLDivElement>(null);

  // Sound generator
  const playClickSound = () => {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Pitch based on Era
      const baseFreq = 150 + state.currentEra * 60;
      osc.type = state.currentEra >= EraId.CIVILIZATION ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context blocked or failed to initialize", e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickMain(e);
    playClickSound();

    if (orbRef.current) {
      const rect = orbRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const clickVal = calculateClickPower(state, state.currentEra, activeEventId);
      const newParticle = {
        id: particleIdRef.current++,
        x,
        y,
        val: `+${formatNumber(clickVal)}`
      };

      setClickParticles(prev => [...prev, newParticle]);
    }
  };

  // Clean up old click particles
  useEffect(() => {
    if (clickParticles.length > 0) {
      const timer = setTimeout(() => {
        setClickParticles(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clickParticles]);

  const activeClickPower = calculateClickPower(state, state.currentEra, activeEventId);
  const activePassiveProd = calculatePassiveProduction(state, state.currentEra, activeEventId);

  // Generate background elements to float in the orb depending on current Era
  const renderOrbVisuals = () => {
    switch (state.currentEra) {
      case EraId.MICROSCOPIC:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Cell structures floating */}
            <div className="absolute top-[20%] left-[30%] w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 animate-pulse blur-[1px]" />
            <div className="absolute top-[60%] left-[70%] w-8 h-4 rounded-full bg-emerald-400/10 border border-emerald-500/30 rotate-45 animate-bounce blur-[1px]" />
            <div className="absolute top-[40%] left-[15%] w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-400/40 animate-ping" />
            <div className="absolute top-[75%] left-[45%] w-3 h-5 rounded-full bg-teal-500/25 border border-teal-400/50 -rotate-12 animate-pulse" />
          </div>
        );
      case EraId.MULTICELLULAR:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Marine shapes */}
            <div className="absolute top-[30%] left-[25%] w-12 h-6 rounded-full bg-cyan-500/15 border-b border-cyan-400/35 rotate-12 animate-pulse" />
            <div className="absolute top-[55%] left-[60%] w-16 h-8 rounded-full bg-cyan-400/10 border border-teal-500/30 -rotate-45 animate-bounce" />
            <div className="absolute top-[20%] left-[70%] w-6 h-6 rounded-full bg-teal-500/20 border border-teal-400/45 blur-[1px]" />
          </div>
        );
      case EraId.ECOSYSTEM:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Flora & Fauna silouhettes */}
            <div className="absolute top-[25%] left-[20%] w-10 h-10 bg-teal-500/15 border border-teal-400/30 rounded-br-3xl animate-pulse" />
            <div className="absolute top-[65%] left-[55%] w-12 h-12 bg-emerald-500/10 border border-emerald-400/30 rounded-tl-3xl rotate-45 animate-bounce" />
            <div className="absolute top-[40%] left-[75%] w-4 h-16 bg-green-500/15 border border-green-400/30 rounded-full animate-pulse" />
          </div>
        );
      case EraId.CIVILIZATION:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Cybernetical meshes */}
            <svg className="absolute inset-0 w-full h-full stroke-indigo-500/15" fill="none">
              <path d="M 50 100 L 150 50 L 250 120 L 150 220 Z" strokeWidth="1" className="animate-pulse" />
              <path d="M 80 50 L 220 200" strokeWidth="0.5" strokeDasharray="3,3" />
              <path d="M 120 250 L 180 30" strokeWidth="0.5" strokeDasharray="5,2" />
            </svg>
            <div className="absolute top-[35%] left-[45%] w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/30 rotate-12 animate-spin" />
            <div className="absolute top-[60%] left-[20%] w-6 h-6 rounded-full bg-indigo-400/15 border border-indigo-500/40 animate-ping" />
          </div>
        );
      case EraId.COSMIC_COLONIZATION:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Stars, spheres & Dyson rails */}
            <div className="absolute top-[40%] left-[40%] w-20 h-20 rounded-full border border-purple-500/20 border-dashed animate-spin" />
            <div className="absolute top-[35%] left-[35%] w-24 h-24 rounded-full border border-pink-500/15 animate-pulse" />
            <div className="absolute top-[15%] left-[65%] w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/40" />
            <div className="absolute top-[70%] left-[25%] w-8 h-8 rounded-full bg-pink-500/15 border border-pink-400/30 animate-bounce" />
          </div>
        );
      case EraId.LIVING_COSMOS:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {/* Celestial singularities & multiverses */}
            <div className="absolute top-[25%] left-[25%] w-32 h-32 rounded-full border-t border-r border-pink-500/20 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[20%] left-[20%] w-36 h-36 rounded-full border-b border-l border-cyan-500/15 animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute top-[48%] left-[48%] w-4 h-4 rounded-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
            <div className="absolute top-[75%] left-[65%] w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 rotate-45 animate-ping" />
          </div>
        );
      default:
        return null;
    }
  };

  const getResourceValue = () => {
    switch (state.currentEra) {
      case EraId.MICROSCOPIC: return state.nutrients;
      case EraId.MULTICELLULAR: return state.biomass;
      case EraId.ECOSYSTEM: return state.vitalForce;
      case EraId.CIVILIZATION: return state.intelligence;
      case EraId.COSMIC_COLONIZATION: return state.cosmicEnergy;
      case EraId.LIVING_COSMOS: return state.universalConsciousness;
    }
  };

  const getEraColorTheme = () => {
    switch (state.currentEra) {
      case EraId.MICROSCOPIC: return "text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
      case EraId.MULTICELLULAR: return "text-cyan-400 border-cyan-500/30 shadow-cyan-500/10";
      case EraId.ECOSYSTEM: return "text-teal-400 border-teal-500/30 shadow-teal-500/10";
      case EraId.CIVILIZATION: return "text-indigo-400 border-indigo-500/30 shadow-indigo-500/10";
      case EraId.COSMIC_COLONIZATION: return "text-purple-400 border-purple-500/30 shadow-purple-500/10";
      case EraId.LIVING_COSMOS: return "text-pink-400 border-pink-500/30 shadow-pink-500/10";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center select-none" id="main-clicking-module">
      
      {/* HUD Header Toolbar */}
      <div className="w-full flex justify-between items-center bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 tracking-wide uppercase">Core Síncrono Conectado</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Sound Toggle */}
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              audioEnabled 
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' 
                : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
            title={audioEnabled ? "Silenciar áudio de clique" : "Ativar áudio de clique"}
            id="btn-sound-toggle"
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Save Button */}
          <button 
            onClick={onSave}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              showSaveIndicator 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40' 
                : 'border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
            id="btn-manual-save"
          >
            <Save size={16} className={showSaveIndicator ? "animate-spin" : ""} />
            <span className="text-xs font-semibold px-0.5">
              {showSaveIndicator ? "Salvo" : "Salvar"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Clicking Sphere Card */}
      <div className={`w-full flex-1 bg-slate-950/80 border rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 shadow-xl ${getEraColorTheme()}`}>
        
        {/* Glow behind */}
        <div className={`absolute w-72 h-72 rounded-full blur-[80px] -z-10 opacity-20 transition-all duration-500 ${
          state.currentEra === EraId.MICROSCOPIC ? 'bg-emerald-500' :
          state.currentEra === EraId.MULTICELLULAR ? 'bg-cyan-500' :
          state.currentEra === EraId.ECOSYSTEM ? 'bg-teal-500' :
          state.currentEra === EraId.CIVILIZATION ? 'bg-indigo-500' :
          state.currentEra === EraId.COSMIC_COLONIZATION ? 'bg-purple-500' : 'bg-pink-500'
        }`} />

        {/* Current Era Status Ribbon */}
        <div className="text-center mb-4">
          <span className="text-xs tracking-widest font-mono font-bold uppercase opacity-80 block mb-1 text-slate-400">
            {era.name}
          </span>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white select-none">
            {formatNumber(getResourceValue())}
          </h2>
          <span className="text-xs font-medium text-slate-400 tracking-wide flex items-center justify-center gap-1 mt-1">
            <IconRenderer name={era.resourceIcon} className="w-3.5 h-3.5 inline text-slate-300" />
            {era.resourceName}
          </span>
        </div>

        {/* Interactive Petri Dish / Evolution Orb */}
        <div 
          ref={orbRef}
          onClick={handleClick}
          className={`relative w-64 h-64 md:w-72 md:h-72 rounded-full cursor-pointer flex items-center justify-center border-4 select-none transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 group bg-slate-900/40 ${
            state.currentEra === EraId.MICROSCOPIC ? 'border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-400' :
            state.currentEra === EraId.MULTICELLULAR ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:border-cyan-400' :
            state.currentEra === EraId.ECOSYSTEM ? 'border-teal-500/40 shadow-[0_0_40px_rgba(20,184,166,0.15)] hover:border-teal-400' :
            state.currentEra === EraId.CIVILIZATION ? 'border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:border-indigo-400' :
            state.currentEra === EraId.COSMIC_COLONIZATION ? 'border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:border-purple-400' :
            'border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.15)] hover:border-pink-400'
          }`}
          id="evolution-clicker-orb"
        >
          {/* Era Specific SVGs Floating in Background */}
          {renderOrbVisuals()}

          {/* Central Pulsating Core Orb */}
          <div className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center transition-all duration-300 backdrop-blur-xs relative select-none ${
            state.currentEra === EraId.MICROSCOPIC ? 'bg-emerald-500/15 border border-emerald-400/30' :
            state.currentEra === EraId.MULTICELLULAR ? 'bg-cyan-500/15 border border-cyan-400/30' :
            state.currentEra === EraId.ECOSYSTEM ? 'bg-teal-500/15 border border-teal-400/30' :
            state.currentEra === EraId.CIVILIZATION ? 'bg-indigo-500/15 border border-indigo-400/30' :
            state.currentEra === EraId.COSMIC_COLONIZATION ? 'bg-purple-500/15 border border-purple-400/30' :
            'bg-pink-500/15 border border-pink-400/30'
          }`}>
            <IconRenderer 
              name={era.resourceIcon} 
              className={`w-12 h-12 mb-1.5 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${
                state.currentEra === EraId.MICROSCOPIC ? 'text-emerald-400 animate-pulse' :
                state.currentEra === EraId.MULTICELLULAR ? 'text-cyan-400 animate-bounce' :
                state.currentEra === EraId.ECOSYSTEM ? 'text-teal-400 animate-pulse' :
                state.currentEra === EraId.CIVILIZATION ? 'text-indigo-400' :
                state.currentEra === EraId.COSMIC_COLONIZATION ? 'text-purple-400 animate-spin' :
                'text-pink-400 animate-pulse'
              }`} 
              style={state.currentEra === EraId.COSMIC_COLONIZATION ? { animationDuration: '10s' } : undefined}
            />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase opacity-90">SINTETIZAR</span>
            <span className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-wider">
              +{formatNumber(activeClickPower)} / clique
            </span>
          </div>

          {/* Dynamic Click Particles Floating Upwards */}
          <AnimatePresence>
            {clickParticles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.8 }}
                animate={{ opacity: 0, y: p.y - 120, x: p.x + (Math.random() * 40 - 20), scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute text-sm md:text-base font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none"
              >
                {p.val}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Output HUD Statistics footer inside panel */}
        <div className="w-full mt-6 grid grid-cols-2 gap-3 text-center border-t border-slate-800/60 pt-4">
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block mb-0.5">Produção Passiva</span>
            <span className="text-sm font-semibold text-white font-mono flex items-center justify-center gap-1">
              +{formatNumber(activePassiveProd)}/s
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block mb-0.5">Fator de Clique</span>
            <span className="text-sm font-semibold text-white font-mono">
              {activeClickPower > 1000 ? `x${formatNumber(activeClickPower)}` : `+${activeClickPower}`}
            </span>
          </div>
        </div>

        {/* Global Lifetime and Multipliers HUD */}
        {state.gensEvolutivos > 0 && (
          <div className="w-full mt-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg py-1.5 px-3 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-400 animate-pulse" />
              Gens Multiplicador:
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              +{formatNumber(state.gensEvolutivos * (state.unlockedTechIds.includes("senciencia_multiversal") ? 20 : 10))}% total
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
