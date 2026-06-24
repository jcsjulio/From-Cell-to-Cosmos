/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum EraId {
  MICROSCOPIC = 0,
  MULTICELLULAR = 1,
  ECOSYSTEM = 2,
  CIVILIZATION = 3,
  COSMIC_COLONIZATION = 4,
  LIVING_COSMOS = 5,
}

export interface Era {
  id: EraId;
  name: string;
  description: string;
  resourceName: string;
  resourceIcon: string;
  color: string; // Tailwind color class, e.g., 'emerald' or hex
  accentColor: string; // e.g. '#10b981'
  bgColor: string; // CSS background class
  minNutrientsToUnlock: number; // or relevant threshold
}

export interface Producer {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number; // Production per second in current era's resource
  eraId: EraId;
  icon: string;
  unlockedByTechId?: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  eraId: EraId;
  category: 'click' | 'production' | 'multiplier' | 'special';
  effectValue: number; // e.g. multiplier or flat addition
  unlockedAtProducerCount?: { producerId: string; count: number };
  isPurchased: boolean;
  icon: string;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  eraId: EraId;
  dependencies: string[]; // TechNode IDs that must be unlocked first
  effectDescription: string;
  isUnlocked: boolean;
  icon: string;
}

export interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  maxLevel: number;
  icon: string;
  effectDescription: string;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  type: 'boost' | 'shift' | 'surge' | 'discount';
  effectDescription: string;
  icon: string;
  color: string;
}

export interface ActiveEvent {
  event: GameEvent;
  secondsRemaining: number;
  totalDuration: number;
}

export interface GameStats {
  totalClicks: number;
  totalNutrientsGenerated: number;
  totalTimePlayedSeconds: number;
  totalPrestigedCount: number;
  highestEraReached: EraId;
  totalGensEarned: number;
}

export interface GameState {
  version: string;
  currentEra: EraId;
  unlockedEras: EraId[];
  
  // Resources per Era
  nutrients: number; // Era 0 principal (also acts as universal base)
  biomass: number; // Era 1
  vitalForce: number; // Era 2
  intelligence: number; // Era 3
  cosmicEnergy: number; // Era 4
  universalConsciousness: number; // Era 5
  
  // Lifetime resource stats for prestige calculation
  lifetimeNutrients: number;
  
  // Prestige currency
  gensEvolutivos: number;
  spentGensEvolutivos: number;
  
  // Producer counts
  producers: Record<string, number>; // Maps producerId to count
  
  // Purchased Upgrades & Tech
  purchasedUpgradeIds: string[];
  unlockedTechIds: string[];
  
  // Permanent Upgrades (Prestige)
  permanentUpgradeLevels: Record<string, number>; // Maps upgradeId to level
  
  // Stats
  stats: GameStats;
  
  // Saved Timestamp
  lastSavedAt: number;
}
