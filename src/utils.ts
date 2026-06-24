/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, EraId, Producer } from './types';
import { PRODUCERS } from './data/producers';
import { UPGRADES } from './data/upgrades';
import { TECH_TREE } from './data/techTree';
import { PERMANENT_UPGRADES } from './data/prestige';

export const INITIAL_VERSION = "1.0.0";

export function formatNumber(num: number): string {
  if (num === 0) return "0";
  if (!isFinite(num)) return "Infinito";
  
  const suffixes = [
    "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
    "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg",
    "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", "Tg"
  ];
  
  const absNum = Math.abs(num);
  const i = Math.floor(Math.log10(absNum) / 3);
  
  if (i < 1) {
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
  }
  
  if (i >= suffixes.length) {
    return num.toExponential(2);
  }
  
  const formatted = (num / Math.pow(10, i * 3)).toFixed(2);
  // Replace trailing .00 if present or make it cleaner
  const cleanFormatted = formatted.endsWith(".00") ? formatted.slice(0, -3) : formatted;
  return `${cleanFormatted} ${suffixes[i]}`;
}

export function getDefaultGameState(): GameState {
  const initialProducers: Record<string, number> = {};
  PRODUCERS.forEach(p => {
    initialProducers[p.id] = 0;
  });

  const initialPermUpgrades: Record<string, number> = {};
  PERMANENT_UPGRADES.forEach(pu => {
    initialPermUpgrades[pu.id] = 0;
  });

  return {
    version: INITIAL_VERSION,
    currentEra: EraId.MICROSCOPIC,
    unlockedEras: [EraId.MICROSCOPIC],
    
    nutrients: 0,
    biomass: 0,
    vitalForce: 0,
    intelligence: 0,
    cosmicEnergy: 0,
    universalConsciousness: 0,
    
    lifetimeNutrients: 0,
    
    gensEvolutivos: 0,
    spentGensEvolutivos: 0,
    
    producers: initialProducers,
    purchasedUpgradeIds: [],
    unlockedTechIds: [],
    permanentUpgradeLevels: initialPermUpgrades,
    
    stats: {
      totalClicks: 0,
      totalNutrientsGenerated: 0,
      totalTimePlayedSeconds: 0,
      totalPrestigedCount: 0,
      highestEraReached: EraId.MICROSCOPIC,
      totalGensEarned: 0
    },
    
    lastSavedAt: Date.now()
  };
}

// Calculate Prestige Gens based on lifetime nutrients.
// viability starts around 50k lifetime nutrients.
export function calculateGensEarned(lifetimeNutrients: number): number {
  if (lifetimeNutrients < 50000) return 0;
  return Math.floor(Math.sqrt(lifetimeNutrients / 50000));
}

// Calculates dynamic cost for a producer based on purchased levels & state discounts
export function getProducerCost(producer: Producer, currentCount: number, state: GameState): number {
  // Base cost scaled by quantity purchased
  let cost = producer.baseCost * Math.pow(producer.costMultiplier, currentCount);

  // Apply Tech Tree node discounts
  // e.g. "genetica_sintetica" reduces previous eras' producer costs by 40%
  if (state.unlockedTechIds.includes("genetica_sintetica") && producer.eraId < EraId.CIVILIZATION) {
    cost *= 0.6;
  }

  // Apply Prestige permanent upgrade discount
  const costReductionLevel = state.permanentUpgradeLevels["perm_eficiencia_celular"] || 0;
  if (costReductionLevel > 0) {
    // -3% per level, max capped at -60% (20 levels)
    const discount = Math.min(0.60, costReductionLevel * 0.03);
    cost *= (1 - discount);
  }

  return Math.max(1, Math.floor(cost));
}

// Calculates passive production per second for a specific era
export function calculatePassiveProduction(state: GameState, eraId: EraId, activeEventId?: string): number {
  let production = 0;

  // Filter producers of this era
  const eraProducers = PRODUCERS.filter(p => p.eraId === eraId);

  eraProducers.forEach(p => {
    const count = state.producers[p.id] || 0;
    if (count === 0) return;

    let pProd = p.baseProduction;

    // Apply specific upgrades purchased
    // bacteria_simples -> up_divisao_rapida (2x)
    if (p.id === "bacteria_simples" && state.purchasedUpgradeIds.includes("up_divisao_rapida")) {
      pProd *= 2.0;
    }
    // colonia_procariontes, flagelado_auxiliar -> up_flagelo_turbo (2x)
    if ((p.id === "colonia_procariontes" || p.id === "flagelado_auxiliar") && state.purchasedUpgradeIds.includes("up_flagelo_turbo")) {
      pProd *= 2.0;
    }
    // esponja_primitiva -> up_esponja_poros (2.5x)
    if (p.id === "esponja_primitiva" && state.purchasedUpgradeIds.includes("up_esponja_poros")) {
      pProd *= 2.5;
    }
    // agua_viva_nervosa -> up_agua_viva_toxica (2x)
    if (p.id === "agua_viva_nervosa" && state.purchasedUpgradeIds.includes("up_agua_viva_toxica")) {
      pProd *= 2.0;
    }
    // floresta_licofitas -> up_licofita_gigante (3x)
    if (p.id === "floresta_licofitas" && state.purchasedUpgradeIds.includes("up_licofita_gigante")) {
      pProd *= 3.0;
    }
    // arrecife_coral -> up_recife_coexistencia (2x)
    if (p.id === "arrecife_coral" && state.purchasedUpgradeIds.includes("up_recife_coexistencia")) {
      pProd *= 2.0;
    }
    // tribo_hominideos -> up_ferramentas_metais (3x)
    if (p.id === "tribo_hominideos" && state.purchasedUpgradeIds.includes("up_ferramentas_metais")) {
      pProd *= 3.0;
    }
    // cidade_alvenaria -> up_escrita_arquivos (2x)
    if (p.id === "cidade_alvenaria" && state.purchasedUpgradeIds.includes("up_escrita_arquivos")) {
      pProd *= 2.0;
    }
    // biosfera_orbital, semeador_planetario -> up_gravidade_sintetica (2x)
    if ((p.id === "biosfera_orbital" || p.id === "semeador_planetario") && state.purchasedUpgradeIds.includes("up_gravidade_sintetica")) {
      pProd *= 2.0;
    }
    // motor_estrela_viva -> up_sifao_estrela_max (2.5x)
    if (p.id === "motor_estrela_viva" && state.purchasedUpgradeIds.includes("up_sifao_estrela_max")) {
      pProd *= 2.5;
    }
    // constelacao_senciente -> up_senciencia_estelar (3x)
    if (p.id === "constelacao_senciente" && state.purchasedUpgradeIds.includes("up_senciencia_estelar")) {
      pProd *= 3.0;
    }
    // galaxia_biologica -> up_espiral_consciente (2x)
    if (p.id === "galaxia_biologica" && state.purchasedUpgradeIds.includes("up_espiral_consciente")) {
      pProd *= 2.0;
    }

    // Apply Era-specific Tech tree node boosts
    if (eraId === EraId.MULTICELLULAR && state.unlockedTechIds.includes("sistema_sensorial")) {
      pProd *= 1.5;
    }
    if (eraId === EraId.ECOSYSTEM && state.unlockedTechIds.includes("sangue_quente")) {
      pProd *= 1.75;
    }
    if (eraId === EraId.COSMIC_COLONIZATION && state.unlockedTechIds.includes("quimica_exotica")) {
      pProd *= 1.8;
    }
    if (p.id === "criador_universos_vivos" && state.unlockedTechIds.includes("ponto_omega")) {
      pProd *= 3.0; // Ultimate tech multiplier
    }

    production += count * pProd;
  });

  // Apply Era Global multipliers from general upgrades
  if (eraId === EraId.MICROSCOPIC && state.purchasedUpgradeIds.includes("up_mitocondria_avancada")) {
    production *= 1.5;
  }
  if (eraId === EraId.MULTICELLULAR && state.purchasedUpgradeIds.includes("up_olhos_trilobita")) {
    production *= 1.6;
  }
  if (eraId === EraId.ECOSYSTEM && state.purchasedUpgradeIds.includes("up_predacao_eficiente")) {
    production *= 1.7;
  }
  if (eraId === EraId.CIVILIZATION && state.purchasedUpgradeIds.includes("up_globalizacao_rede")) {
    production *= 2.0;
  }
  if (eraId === EraId.COSMIC_COLONIZATION && state.purchasedUpgradeIds.includes("up_rede_dyson_coletiva")) {
    production *= 2.2;
  }
  if (eraId === EraId.LIVING_COSMOS && state.purchasedUpgradeIds.includes("up_multiverso_infinito")) {
    production *= 3.0;
  }

  // Apply Permanent Prestige Multiplier from Gens Evolutivos
  // Every unspent Gen Evolutivo gives +10% global production, multiplied by Senciencia Multiversal if unlocked
  let genMultiplier = 0.10;
  if (state.unlockedTechIds.includes("senciencia_multiversal")) {
    genMultiplier = 0.20; // Double prestige effectiveness
  }
  const totalGensBonus = 1 + (state.gensEvolutivos * genMultiplier);
  production *= totalGensBonus;

  // Apply "Mutacao Estavel" permanent prestige upgrade level (+15% per level)
  const mutacaoEstavelLevel = state.permanentUpgradeLevels["perm_mutacao_estavel"] || 0;
  production *= (1 + mutacaoEstavelLevel * 0.15);

  // Apply Active Events
  if (activeEventId) {
    if (activeEventId === "evt_meteoros_nutritivos") {
      production *= 2.0;
    }
    if (activeEventId === "evt_era_glacial") {
      production *= 0.7; // Ice Age slows passive production by 30%
    }
    if (activeEventId === "evt_radiacao_gama" && eraId >= EraId.CIVILIZATION) {
      production *= 2.5; // Gama radiation boosts top-tier eras by 2.5x
    }
  }

  return production;
}

// Calculates click power for the current era
export function calculateClickPower(state: GameState, eraId: EraId, activeEventId?: string): number {
  let baseClick = 1;

  // Era specific click adjustments (flat additions from upgrades)
  if (eraId === EraId.MICROSCOPIC) {
    if (state.purchasedUpgradeIds.includes("up_membrana_celular")) {
      baseClick += 1;
    }
    if (state.unlockedTechIds.includes("nucleo_protegido")) {
      baseClick *= 2.0; // Double clicking
    }
  } else if (eraId === EraId.MULTICELLULAR) {
    baseClick = 5; // Higher base click on next eras
    if (state.purchasedUpgradeIds.includes("up_click_multi")) {
      baseClick += 5;
    }
    if (state.unlockedTechIds.includes("nucleo_protegido")) {
      baseClick *= 2.0;
    }
  } else if (eraId === EraId.ECOSYSTEM) {
    baseClick = 25;
    if (state.purchasedUpgradeIds.includes("up_fotosintese_foliar")) {
      baseClick += 50;
    }
  } else if (eraId === EraId.CIVILIZATION) {
    baseClick = 200;
    if (state.purchasedUpgradeIds.includes("up_fogo_manipulacao")) {
      baseClick += 1000;
    }
  } else if (eraId === EraId.COSMIC_COLONIZATION) {
    baseClick = 5000;
    if (state.purchasedUpgradeIds.includes("up_reatores_antimateria")) {
      baseClick += 100000;
    }
  } else if (eraId === EraId.LIVING_COSMOS) {
    baseClick = 1000000;
    if (state.purchasedUpgradeIds.includes("up_telepatia_quantica")) {
      baseClick += 10000000;
    }
  }

  // Apply Click Power Permanent Prestige Upgrade level (+25% per level)
  const clickPowerLevel = state.permanentUpgradeLevels["perm_divisao_quantica"] || 0;
  baseClick *= (1 + clickPowerLevel * 0.25);

  // Apply prestige permanent multiplier also to clicking to keep clicking viable
  let genMultiplier = 0.05; // 5% click scaling per gen
  const totalGensBonus = 1 + (state.gensEvolutivos * genMultiplier);
  baseClick *= totalGensBonus;

  // Active Events click power boosts
  if (activeEventId) {
    if (activeEventId === "evt_mutacao_hiperativa") {
      baseClick *= 4.0;
    }
    if (activeEventId === "evt_era_glacial") {
      baseClick *= 5.0; // Heat generation clicks!
    }
  }

  return Math.max(1, Math.floor(baseClick));
}
