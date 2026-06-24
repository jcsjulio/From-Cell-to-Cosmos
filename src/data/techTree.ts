/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TechNode, EraId } from '../types';

export const TECH_TREE: TechNode[] = [
  // === ERA 0: MICROSCOPIC ===
  {
    id: "eucarionte_cel",
    name: "Célula Eucarionte",
    description: "Desenvolva uma membrana nuclear e organelas complexas, permitindo a vida multicelular.",
    cost: 500, // Nutrientes
    eraId: EraId.MICROSCOPIC,
    dependencies: [],
    effectDescription: "Desbloqueia a Era Multicelular e o produtor Esponja Primitiva.",
    isUnlocked: false,
    icon: "FolderGit"
  },
  {
    id: "nucleo_protegido",
    name: "Núcleo Organizado",
    description: "Sistematize o armazenamento de DNA para otimizar replicação mitocondrial.",
    cost: 1500, // Nutrientes
    eraId: EraId.MICROSCOPIC,
    dependencies: ["eucarionte_cel"],
    effectDescription: "Aumenta o poder de toque (click) na Era Microscópica em +100%.",
    isUnlocked: false,
    icon: "ShieldAlert"
  },

  // === ERA 1: MULTICELLULAR ===
  {
    id: "conquista_terra",
    name: "Conquista Terrestre",
    description: "Desenvolva respiração aérea e cutícula impermeável para colonizar solos secos.",
    cost: 8000, // Biomassa
    eraId: EraId.MULTICELLULAR,
    dependencies: ["eucarionte_cel"],
    effectDescription: "Desbloqueia a Era de Ecossistemas e o produtor Floresta de Licófitas.",
    isUnlocked: false,
    icon: "Footprint"
  },
  {
    id: "sistema_sensorial",
    name: "Sistema Sensorial Ativo",
    description: "Surgimento de foto-receptores e quimio-receptores primitivos.",
    cost: 20000, // Biomassa
    eraId: EraId.MULTICELLULAR,
    dependencies: ["conquista_terra"],
    effectDescription: "Aumenta a produção de toda a Era Multicelular em +50%.",
    isUnlocked: false,
    icon: "Compass"
  },

  // === ERA 2: ECOSYSTEM ===
  {
    id: "sistema_nervoso",
    name: "Cérebro Centralizado",
    description: "Agrupe nervos em um cordão espinhal e encéfalo para processamento neural avançado.",
    cost: 150000, // Força Vital
    eraId: EraId.ECOSYSTEM,
    dependencies: ["conquista_terra"],
    effectDescription: "Desbloqueia a Era da Civilização e o produtor Tribo de Hominídeos.",
    isUnlocked: false,
    icon: "BrainCircuit"
  },
  {
    id: "sangue_quente",
    name: "Homeotermia Térmica",
    description: "Regulação autônoma de temperatura corporal para habitar climas extremos.",
    cost: 500000, // Força Vital
    eraId: EraId.ECOSYSTEM,
    dependencies: ["sistema_nervoso"],
    effectDescription: "Aumenta a produção passiva de Força Vital globalmente em +75%.",
    isUnlocked: false,
    icon: "ThermometerSun"
  },

  // === ERA 3: CIVILIZATION ===
  {
    id: "viagem_espacial",
    name: "Exploração Exo-Semeadora",
    description: "Criação de cascas biomecânicas seladas capazes de resistir ao vácuo interestelar.",
    cost: 100000000, // Inteligência
    eraId: EraId.CIVILIZATION,
    dependencies: ["sistema_nervoso"],
    effectDescription: "Desbloqueia a Era Cósmica e o produtor Biosfera Orbital.",
    isUnlocked: false,
    icon: "Orbit"
  },
  {
    id: "genetica_sintetica",
    name: "Criptografia de DNA",
    description: "Edição automatizada de genoma permitindo replicar estruturas em massa.",
    cost: 300000000, // Inteligência
    eraId: EraId.CIVILIZATION,
    dependencies: ["viagem_espacial"],
    effectDescription: "Reduz o custo de compra de todos os produtores das Eras anteriores em -40%.",
    isUnlocked: false,
    icon: "Fingerprint"
  },

  // === ERA 4: COSMIC COLONIZATION ===
  {
    id: "manipulacao_singularidades",
    name: "Estabilidade de Buracos de Minhoca",
    description: "Curve o espaço-tempo para conectar biomas interestelares de forma instantânea.",
    cost: 50000000000, // Energia Cósmica
    eraId: EraId.COSMIC_COLONIZATION,
    dependencies: ["viagem_espacial"],
    effectDescription: "Desbloqueia a Era do Cosmos Vivo e o produtor Constelação Senciente.",
    isUnlocked: false,
    icon: "Waypoints"
  },
  {
    id: "quimica_exotica",
    name: "Flutuações Quânticas Estáveis",
    description: "Permite usar energia de vácuo para acelerar fusão de poeira cósmica biológica.",
    cost: 250000000000, // Energia Cósmica
    eraId: EraId.COSMIC_COLONIZATION,
    dependencies: ["manipulacao_singularidades"],
    effectDescription: "Aumenta a velocidade de produção de todos os produtores Cósmicos em +80%.",
    isUnlocked: false,
    icon: "Zap"
  },

  // === ERA 5: LIVING COSMOS ===
  {
    id: "senciencia_multiversal",
    name: "Tessitura Hiperdimensional",
    description: "Sintonize os batimentos do Cosmos Vivo com oscilações de universos paralelos.",
    cost: 10000000000000, // Consciência Universal
    eraId: EraId.LIVING_COSMOS,
    dependencies: ["manipulacao_singularidades"],
    effectDescription: "Aumenta o bônus permanente de produção dos Gens Evolutivos em +100% adicionais.",
    isUnlocked: false,
    icon: "Layers"
  },
  {
    id: "ponto_omega",
    name: "Transcendência Ômega",
    description: "Fusão absoluta de todas as consciências em um único criador vivo atemporal.",
    cost: 80000000000000, // Consciência Universal
    eraId: EraId.LIVING_COSMOS,
    dependencies: ["senciencia_multiversal"],
    effectDescription: "Aumenta a velocidade de produção do Criador de Universos Vivos em +200%. Unlocks a gloriosa vitória evolutiva!",
    isUnlocked: false,
    icon: "Infinity"
  }
];
