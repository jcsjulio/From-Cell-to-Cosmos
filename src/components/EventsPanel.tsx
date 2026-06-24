/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameEvent, ActiveEvent } from '../types';
import { RANDOM_EVENTS } from '../data/events';
import { IconRenderer } from './MainGamePanel';
import { Activity, BellRing, Clock, HelpCircle, Info, Radio, Sparkles } from 'lucide-react';

interface EventsPanelProps {
  activeEvent: ActiveEvent | null;
  notificationLog: string[];
}

export function EventsPanel({ activeEvent, notificationLog }: EventsPanelProps) {
  
  return (
    <div className="w-full flex flex-col gap-5" id="events-log-center-panel">
      
      {/* 1. CURRENT ACTIVE EVENT BOX */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Radio size={13} className="text-emerald-500 animate-pulse" />
          Evento Ativo no Microuniverso
        </h3>

        {activeEvent ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-lg">
            
            {/* Color accent backdrop */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-10 bg-gradient-to-br ${activeEvent.event.color}`} />

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                <IconRenderer name={activeEvent.event.icon} className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{activeEvent.event.name}</h4>
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 bg-amber-950/20 border border-amber-800/20 px-2 py-0.5 rounded">
                    <Clock size={12} className="animate-spin" />
                    {activeEvent.secondsRemaining}s
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeEvent.event.description}
                </p>

                {/* Effect display */}
                <div className="mt-3.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80 text-xs text-amber-300/90 font-medium">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mb-0.5">Modificador de Evento</span>
                  {activeEvent.event.effectDescription}
                </div>

                {/* Visual progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden border border-slate-850">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(activeEvent.secondsRemaining / activeEvent.totalDuration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-950/30 border border-slate-900/60 rounded-xl p-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <Activity size={24} className="text-slate-600 animate-pulse" />
            <span>Nenhuma perturbação cósmica ativa no momento.</span>
            <span className="text-[10px] text-slate-600 font-mono">Eventos aleatórios se manifestam a cada 60-90 segundos.</span>
          </div>
        )}
      </div>

      {/* 2. NOTIFICATION AND EVENT LOGS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <BellRing size={13} className="text-slate-500" />
          Registro de Eventos Recentes
        </h3>
        
        <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 max-h-[160px] overflow-y-auto font-mono text-[10px] text-slate-400 flex flex-col gap-2 scrollbar-thin">
          {notificationLog.length === 0 ? (
            <span className="text-slate-600 text-center py-4">Sem entradas no log. Novas flutuações evolutivas aparecerão aqui.</span>
          ) : (
            notificationLog.map((log, index) => (
              <div key={index} className="flex gap-2 items-start py-1 border-b border-slate-900/30 last:border-b-0 leading-normal">
                <span className="text-slate-600 shrink-0 select-none">&gt;</span>
                <span className="text-slate-300">{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. EVENT CATALOG */}
      <div className="flex flex-col gap-3 mt-1">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <HelpCircle size={13} className="text-slate-500" />
          Guia de Fenômenos Celestes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {RANDOM_EVENTS.map((e) => (
            <div key={e.id} className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3 flex gap-2.5 items-start">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                <IconRenderer name={e.icon} className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-tight uppercase">{e.name}</h5>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                  {e.description}
                </p>
                <span className="text-[9px] font-mono font-bold text-emerald-400/90 mt-1 block">
                  {e.effectDescription}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
