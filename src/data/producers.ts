/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Producer, EraId } from '../types';

export const PRODUCERS: Producer[] = [
  // --- ERA 0: MICROSCOPIC (Produces Nutrients, Costs Nutrients) ---
  {
    id: "bacteria_simples",
    name: "Bactéria Simples",
    description: "Um organismo unicelular básico que absorve nutrientes passivamente do meio.",
    baseCost: 10,
    costMultiplier: 1.15,
    baseProduction: 0.2,
    eraId: EraId.MICROSCOPIC,
    icon: "Bug"
  },
  {
    id: "colonia_procariontes",
    name: "Colônia de Procariontes",
    description: "Várias células cooperando em conjunto, otimizando a divisão celular.",
    baseCost: 120,
    costMultiplier: 1.16,
    baseProduction: 1.5,
    eraId: EraId.MICROSCOPIC,
    icon: "Layers"
  },
  {
    id: "flagelado_auxiliar",
    name: "Flagelado Auxiliar",
    description: "Células com filamentos de locomoção rápida, coletando compostos químicos distantes.",
    baseCost: 1100,
    costMultiplier: 1.18,
    baseProduction: 10,
    eraId: EraId.MICROSCOPIC,
    icon: "Wind"
  },
  {
    id: "ciliado_coletor",
    name: "Ciliado Coletor",
    description: "Predador microscópico eficiente que devora detritos orgânicos no meio aquoso.",
    baseCost: 12000,
    costMultiplier: 1.20,
    baseProduction: 85,
    eraId: EraId.MICROSCOPIC,
    icon: "Target"
  },

  // --- ERA 1: MULTICELLULAR (Produces Biomass, Costs Nutrients) ---
  {
    id: "esponja_primitiva",
    name: "Esponja Primitiva",
    description: "Agrupamento multicelular fixo. Filtra a água ao redor para condensar biomassa.",
    baseCost: 5000,
    costMultiplier: 1.15,
    baseProduction: 1,
    eraId: EraId.MULTICELLULAR,
    icon: "Grid",
    unlockedByTechId: "eucarionte_cel"
  },
  {
    id: "agua_viva_nervosa",
    name: "Água-Viva Nervosa",
    description: "Possui uma rede de nervos difusa. Move-se ativamente impulsionando a matéria viva.",
    baseCost: 45000,
    costMultiplier: 1.16,
    baseProduction: 8,
    eraId: EraId.MULTICELLULAR,
    icon: "Waves"
  },
  {
    id: "verme_segmentado",
    name: "Verme Segmentado",
    description: "Primeiro organismo com simetria bilateral e escavação ativa de nutrientes em sedimentos.",
    baseCost: 320000,
    costMultiplier: 1.18,
    baseProduction: 50,
    eraId: EraId.MULTICELLULAR,
    icon: "Activity"
  },
  {
    id: "trilobita_couracado",
    name: "Trilobita Couraçado",
    description: "Artrópode pré-histórico com olhos complexos e exoesqueleto rígido protetor.",
    baseCost: 2500000,
    costMultiplier: 1.20,
    baseProduction: 350,
    eraId: EraId.MULTICELLULAR,
    icon: "Shield"
  },

  // --- ERA 2: ECOSYSTEM (Produces Vital Force, Costs Biomass) ---
  {
    id: "floresta_licofitas",
    name: "Floresta de Licófitas",
    description: "As primeiras florestas gigantes terrestres de plantas vasculares que saturam a atmosfera com oxigênio.",
    baseCost: 10000,
    costMultiplier: 1.15,
    baseProduction: 10,
    eraId: EraId.ECOSYSTEM,
    icon: "Trees",
    unlockedByTechId: "conquista_terra"
  },
  {
    id: "arrecife_coral",
    name: "Arrecife de Coral",
    description: "Uma megaestrutura biológica oceânica que abriga e nutre milhares de espécies em simbiose.",
    baseCost: 95000,
    costMultiplier: 1.17,
    baseProduction: 75,
    eraId: EraId.ECOSYSTEM,
    icon: "Anchor"
  },
  {
    id: "megafauna_herbivora",
    name: "Megafauna Herbívora",
    description: "Herbívoros massivos que moldam a vegetação de ecossistemas inteiros através do consumo energético.",
    baseCost: 820000,
    costMultiplier: 1.19,
    baseProduction: 600,
    eraId: EraId.ECOSYSTEM,
    icon: "Footprint"
  },
  {
    id: "superpredador_terrestre",
    name: "Superpredador Terrestre",
    description: "O topo da cadeia alimentar. Regula o equilíbrio das populações, destilando força biológica extrema.",
    baseCost: 7500000,
    costMultiplier: 1.22,
    baseProduction: 4800,
    eraId: EraId.ECOSYSTEM,
    icon: "Flame"
  },

  // --- ERA 3: CIVILIZATION (Produces Intelligence, Costs Vital Force) ---
  {
    id: "tribo_hominideos",
    name: "Tribo de Hominídeos",
    description: "Grupo social primata usando ferramentas de pedra e fogo para se proteger e caçar estrategicamente.",
    baseCost: 5000000,
    costMultiplier: 1.16,
    baseProduction: 100,
    eraId: EraId.CIVILIZATION,
    icon: "Users",
    unlockedByTechId: "sistema_nervoso"
  },
  {
    id: "cidade_alvenaria",
    name: "Cidade de Alvenaria",
    description: "Agrupamento urbano fixo que cria canais de irrigação, escrita, comércio e especialização do trabalho.",
    baseCost: 48000000,
    costMultiplier: 1.18,
    baseProduction: 950,
    eraId: EraId.CIVILIZATION,
    icon: "Home"
  },
  {
    id: "rede_cientifica",
    name: "Redes Científicas",
    description: "Interconexão de mentes dedicadas a descobrir as leis da física, química e biotecnologia evolutiva.",
    baseCost: 420000000,
    costMultiplier: 1.20,
    baseProduction: 8000,
    eraId: EraId.CIVILIZATION,
    icon: "Network"
  },
  {
    id: "ia_coletiva",
    name: "Inteligência Artificial Coletiva",
    description: "Modelos neuronais massivos otimizando as rotas metabólicas globais e coordenando a biosfera terrestre.",
    baseCost: 3800000000,
    costMultiplier: 1.23,
    baseProduction: 72000,
    eraId: EraId.CIVILIZATION,
    icon: "Cpu"
  },

  // --- ERA 4: COSMIC COLONIZATION (Produces Cosmic Energy, Costs Intelligence) ---
  {
    id: "biosfera_orbital",
    name: "Biosfera Orbital",
    description: "Estações de vida biológica gigantes flutuando na órbita terrestre, canalizando luz solar direta.",
    baseCost: 1000000000,
    costMultiplier: 1.17,
    baseProduction: 1500,
    eraId: EraId.COSMIC_COLONIZATION,
    icon: "Globe",
    unlockedByTechId: "viagem_espacial"
  },
  {
    id: "semeador_planetario",
    name: "Semeador Planetário",
    description: "Naves orgânicas enviando esporos geneticamente modificados para germinar vida em planetas estéreis.",
    baseCost: 12000000000,
    costMultiplier: 1.19,
    baseProduction: 18000,
    eraId: EraId.COSMIC_COLONIZATION,
    icon: "Rocket"
  },
  {
    id: "motor_estrela_viva",
    name: "Motor de Estrela Viva",
    description: "Megasifões biológicos que se alimentam da coroa de estrelas para extrair isótopos de fusão purificados.",
    baseCost: 140000000000,
    costMultiplier: 1.21,
    baseProduction: 210000,
    eraId: EraId.COSMIC_COLONIZATION,
    icon: "Sun"
  },
  {
    id: "enxame_dyson_organico",
    name: "Enxame de Dyson Orgânico",
    description: "Uma rede colossal de coletores solares biológicos que envolve uma estrela inteira para sugar sua radiação.",
    baseCost: 1800000000000,
    costMultiplier: 1.24,
    baseProduction: 2400000,
    eraId: EraId.COSMIC_COLONIZATION,
    icon: "Eye"
  },

  // --- ERA 5: LIVING COSMOS (Produces Universal Consciousness, Costs Cosmic Energy) ---
  {
    id: "constelacao_senciente",
    name: "Constelação Senciente",
    description: "Nuvens moleculares de gás inteligente conectadas por feixes de bio-laser interestelares.",
    baseCost: 500000000000,
    costMultiplier: 1.18,
    baseProduction: 50000,
    eraId: EraId.LIVING_COSMOS,
    icon: "Cloud",
    unlockedByTechId: "manipulacao_singularidades"
  },
  {
    id: "galaxia_biologica",
    name: "Galáxia Biológica",
    description: "Uma espiral estelar onde cada estrela, planeta e poeira cósmica foi reorganizado em uma rede de consciência.",
    baseCost: 8000000000000,
    costMultiplier: 1.21,
    baseProduction: 900000,
    eraId: EraId.LIVING_COSMOS,
    icon: "Sparkles"
  },
  {
    id: "tecedor_singularidades",
    name: "Tecedor de Singularidades",
    description: "Criaturas bio-dimensionais de matéria escura que curvam o espaço-tempo para extrair energia do vácuo.",
    baseCost: 150000000000000,
    costMultiplier: 1.24,
    baseProduction: 15000000,
    eraId: EraId.LIVING_COSMOS,
    icon: "RefreshCw"
  },
  {
    id: "criador_universos_vivos",
    name: "Criador de Universos Vivos",
    description: "O ápice absoluto da evolução. Abre portais para semear sementes de novas realidades e leis físicas vivas.",
    baseCost: 4000000000000000,
    costMultiplier: 1.28,
    baseProduction: 250000000,
    eraId: EraId.LIVING_COSMOS,
    icon: "Infinity"
  }
];
