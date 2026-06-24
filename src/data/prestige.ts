/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PermanentUpgrade } from '../types';

export const PERMANENT_UPGRADES: PermanentUpgrade[] = [
  {
    id: "perm_mutacao_estavel",
    name: "Mutação Estável",
    description: "Engenharia genética ancestral que estabiliza o metabolismo. Aumenta a produção global de todas as Eras.",
    baseCost: 1,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 100,
    icon: "ShieldAlert",
    effectDescription: "+15% de produção global por nível."
  },
  {
    id: "perm_divisao_quantica",
    name: "Divisão Quântica de Cliques",
    description: "Cada toque interage com microestados quânticos de matéria vital, intensificando a força de extração.",
    baseCost: 2,
    costMultiplier: 1.6,
    level: 0,
    maxLevel: 50,
    icon: "Fingerprint",
    effectDescription: "+25% de poder de clique (click) por nível."
  },
  {
    id: "perm_heranca_genetica",
    name: "Herança de Esporos",
    description: "Permite preservar células adormecidas durante as extinções em massa.",
    baseCost: 5,
    costMultiplier: 2.0,
    level: 0,
    maxLevel: 10,
    icon: "FolderGit",
    effectDescription: "Preserva 5% dos produtores de Era 0 após a Extinção Controlada por nível."
  },
  {
    id: "perm_eficiencia_celular",
    name: "Metabolismo Catalítico",
    description: "Substitui reações metabólicas lentas por síntese enzimática direta de alta velocidade.",
    baseCost: 3,
    costMultiplier: 1.7,
    level: 0,
    maxLevel: 20,
    icon: "Activity",
    effectDescription: "Reduz o custo de compra de todos os produtores em -3% por nível."
  },
  {
    id: "perm_energia_vacuo",
    name: "Ressonância de Éter Secundário",
    description: "Aproveita o ruído térmico cósmico residual para continuar a sintetizar vida mesmo ausente.",
    baseCost: 8,
    costMultiplier: 2.2,
    level: 0,
    maxLevel: 15,
    icon: "Sparkles",
    effectDescription: "+8% de bônus de produção offline por nível (acumula até 120%)."
  },
  {
    id: "perm_acelerador_temporal",
    name: "Catalisador de Eventos",
    description: "Sintoniza a biosfera com eventos quânticos sazonais benéficos acelerados.",
    baseCost: 4,
    costMultiplier: 1.8,
    level: 0,
    maxLevel: 10,
    icon: "Zap",
    effectDescription: "+10% de chance e +10% de duração para todos os eventos aleatórios por nível."
  }
];
