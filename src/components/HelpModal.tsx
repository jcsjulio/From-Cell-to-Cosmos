/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Zap, Bug, Orbit } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white bg-slate-950/50 cursor-pointer transition-all"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 text-emerald-400 pb-3 border-b border-slate-800/80 mb-4 shrink-0">
              <BookOpen size={20} className="animate-pulse" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Manual de Simulação Biológica</h3>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 text-slate-300 text-xs leading-relaxed font-sans scrollbar-thin">
              
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1.5 font-mono">
                  <Bug size={14} className="text-emerald-400" />
                  1. O FLUXO DE NUTRIENTES
                </h4>
                <p>
                  Sua jornada começa no nível microscópico dentro de uma placa de Petri. Toque no núcleo celular central para sintetizar **Nutrientes** manualmente. Use seus nutrientes para adquirir as primeiras colônias e bactérias que geram recursos passivamente por segundo.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1.5 font-mono">
                  <Zap size={14} className="text-amber-500" />
                  2. CASCATA EVOLUTIVA
                </h4>
                <p>
                  O Microverse é composto de **6 Eras**. Cada Era possui sua própria moeda de progresso (Nutrientes, Biomassa, Força Vital, Inteligência, Energia Cósmica e Consciência Universal). 
                  <br /><br />
                  Para garantir uma transição harmônica, os produtores automatizados de cada era **são adquiridos usando os recursos da era anterior**! Por exemplo, a Esponja Primitiva (Era Multicelular) custa Nutrientes para comprar, mas gera Biomassa passivamente. Domine a eficiência de cada era para poder financiar os saltos da próxima patamar.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1.5 font-mono">
                  <Orbit size={14} className="text-indigo-400" />
                  3. A ÁRVORE DA EVOLUÇÃO
                </h4>
                <p>
                  Na aba **Evolução**, você pode pesquisar saltos evolucionários vitais (como a Célula Eucarionte ou a Viagem Espacial). A pesquisa de tecnologias-chave é o gatilho que **desbloqueia novas Eras**, novos produtores avançados e multiplica o seu poder de clique e produção.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1.5 font-mono">
                  <Sparkles size={14} className="text-pink-400" />
                  4. EXTINÇÃO CONTROLADA (PRESTÍGIO)
                </h4>
                <p>
                  Se a evolução travar, provoque uma **Extinção Controlada**. Este processo limpa toda a biosfera básica atual, mas condensa os compostos históricos em **Gens Evolutivos**. 
                  <br /><br />
                  Cada Gene não gasto concede **+10% de bônus global de produção**. Além disso, gaste seus Gens na loja de prestígio para comprar melhorias eternas (como bônus permanentes de cliques, redução de preços de unidades e geração de recursos offline).
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 leading-normal">
                <span className="text-white font-bold block uppercase mb-1">Dica de Sobrevivência</span>
                Não compre permanentemente todos os Gens na loja de prestígio! Guardar Gens no inventário não gastos é crucial para manter o multiplicador passivo geral elevado nos resets iniciais.
              </div>

            </div>

            {/* Footer Close Action */}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 cursor-pointer transition-all shrink-0 uppercase"
            >
              Compreendi, Voltar ao Jogo
            </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
