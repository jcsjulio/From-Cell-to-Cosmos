/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEvent } from '../types';

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: "evt_meteoros_nutritivos",
    name: "Meteoros Orgânicos",
    description: "Uma chuva de micro-meteoritos de carbono e aminoácidos colide com a biosfera, inundando o ecossistema com compostos vitais.",
    durationSeconds: 45,
    type: "boost",
    effectDescription: "Duplica (2x) a geração passiva global de todas as Eras ativos.",
    icon: "CloudLightning",
    color: "from-emerald-600 to-cyan-500"
  },
  {
    id: "evt_mutacao_hiperativa",
    name: "Mutação Hiperativa",
    description: "Uma onda imprevista de radiação solar causa saltos de replicação genética súbitos.",
    durationSeconds: 30,
    type: "surge",
    effectDescription: "Multiplica o poder de clique em 4x.",
    icon: "Sparkles",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "evt_era_glacial",
    name: "Era Glacial Súbita",
    description: "As temperaturas caem drasticamente. A vida desacelera para economizar energia, mas os cliques geram calor extra.",
    durationSeconds: 40,
    type: "shift",
    effectDescription: "Reduz a produção passiva em 30%, mas aumenta o poder do clique em 5x.",
    icon: "Flame",
    color: "from-blue-600 to-indigo-500"
  },
  {
    id: "evt_catalisador_enzimatico",
    name: "Super Sopa Primordial",
    description: "Condições químicas na sopa orgânica chegam ao equilíbrio perfeito. É hora de expandir as colônias!",
    durationSeconds: 50,
    type: "discount",
    effectDescription: "Reduz o custo de compra de todos os produtores em 30%.",
    icon: "Percent",
    color: "from-teal-600 to-emerald-500"
  },
  {
    id: "evt_radiacao_gama",
    name: "Pulso de Radiação de Gama",
    description: "Um feixe eletromagnético distante estimula os quantum-sensores da biosfera.",
    durationSeconds: 35,
    type: "boost",
    effectDescription: "Aumenta a eficiência das Eras superiores (Civilização, Cósmica e Cosmos Vivo) em 2.5x.",
    icon: "Atom",
    color: "from-purple-600 to-pink-500"
  }
];
