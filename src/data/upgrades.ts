/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Upgrade, EraId } from '../types';

export const UPGRADES: Upgrade[] = [
  // === ERA 0: MICROSCOPIC (Costs Nutrients) ===
  {
    id: "up_membrana_celular",
    name: "Membrana Celular Reforçada",
    description: "Torna a captação de matéria orgânica mais eficiente por toque.",
    cost: 50,
    eraId: EraId.MICROSCOPIC,
    category: "click",
    effectValue: 1, // Add +1 to click power
    icon: "Fingerprint",
    isPurchased: false
  },
  {
    id: "up_divisao_rapida",
    name: "Divisão Binária Acelerada",
    description: "Acelera o ciclo celular. Bactérias Simples tornam-se 2x mais produtivas.",
    cost: 300,
    eraId: EraId.MICROSCOPIC,
    category: "production",
    effectValue: 2.0, // 2x to bacteria_simples
    icon: "Zap",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "bacteria_simples", count: 5 }
  },
  {
    id: "up_flagelo_turbo",
    name: "Turbo-Flagelo Químico",
    description: "Flagelos com rotação bio-mecânica acelerada. Colônias e Flagelados produzem 2x mais.",
    cost: 1500,
    eraId: EraId.MICROSCOPIC,
    category: "production",
    effectValue: 2.0, // 2x to colonia_procariontes and flagelado_auxiliar
    icon: "RotateCw",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "flagelado_auxiliar", count: 1 }
  },
  {
    id: "up_mitocondria_avancada",
    name: "Mitocôndria Sintetizada",
    description: "Usina de energia celular otimizada. Multiplica a produção microbiana passiva total por 1.5x.",
    cost: 8000,
    eraId: EraId.MICROSCOPIC,
    category: "multiplier",
    effectValue: 1.5, // 1.5x to all microscopic era producers
    icon: "Activity",
    isPurchased: false
  },

  // === ERA 1: MULTICELLULAR (Costs Biomass) ===
  {
    id: "up_click_multi",
    name: "Diferenciação Mitótica",
    description: "Cada toque no núcleo ativa diferenciações celulares em massa. Cliques dão +5 de Biomassa.",
    cost: 100,
    eraId: EraId.MULTICELLULAR,
    category: "click",
    effectValue: 5,
    icon: "Sparkle",
    isPurchased: false
  },
  {
    id: "up_esponja_poros",
    name: "Porosidade Dinâmica",
    description: "Esponjas aumentam a capacidade de filtração. Esponjas Primitivas produzem 2.5x mais.",
    cost: 800,
    eraId: EraId.MULTICELLULAR,
    category: "production",
    effectValue: 2.5,
    icon: "Grid",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "esponja_primitiva", count: 5 }
  },
  {
    id: "up_agua_viva_toxica",
    name: "Nematocistos Ativos",
    description: "Toxinas que paralisam micro-presas. Águas-Vivas Nervosas ganham 2x eficiência.",
    cost: 4000,
    eraId: EraId.MULTICELLULAR,
    category: "production",
    effectValue: 2.0,
    icon: "Flame",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "agua_viva_nervosa", count: 3 }
  },
  {
    id: "up_olhos_trilobita",
    name: "Lentes de Calcita Otimizadas",
    description: "Visão complexa permite caça estratégica. Multiplica a produção multicelular total por 1.6x.",
    cost: 25000,
    eraId: EraId.MULTICELLULAR,
    category: "multiplier",
    effectValue: 1.6,
    icon: "Eye",
    isPurchased: false
  },

  // === ERA 2: ECOSYSTEM (Costs Vital Force) ===
  {
    id: "up_fotosintese_foliar",
    name: "Super-Clorofila Concentrada",
    description: "Acelera as reações de fotossíntese terrestre. Cliques dão +50 de Força Vital.",
    cost: 5000,
    eraId: EraId.ECOSYSTEM,
    category: "click",
    effectValue: 50,
    icon: "Sun",
    isPurchased: false
  },
  {
    id: "up_licofita_gigante",
    name: "Evolução Vascular Arbórea",
    description: "Vasos condutores de seiva robustos. Florestas de Licófitas tornam-se 3x mais eficientes.",
    cost: 35000,
    eraId: EraId.ECOSYSTEM,
    category: "production",
    effectValue: 3.0,
    icon: "Trees",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "floresta_licofitas", count: 5 }
  },
  {
    id: "up_recife_coexistencia",
    name: "Simbiose Zooxantela",
    description: "Melhora o mutualismo de corais e algas. Arrecifes de Coral ganham 2x eficiência.",
    cost: 150000,
    eraId: EraId.ECOSYSTEM,
    category: "production",
    effectValue: 2.0,
    icon: "Heart",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "arrecife_coral", count: 3 }
  },
  {
    id: "up_predacao_eficiente",
    name: "Cadeia Trófica Equilibrada",
    description: "Fluxo de energia biológica otimizado. Multiplica a produção de Força Vital total por 1.7x.",
    cost: 1200000,
    eraId: EraId.ECOSYSTEM,
    category: "multiplier",
    effectValue: 1.7,
    icon: "Award",
    isPurchased: false
  },

  // === ERA 3: CIVILIZATION (Costs Intelligence) ===
  {
    id: "up_fogo_manipulacao",
    name: "Controle Térmico Sistêmico",
    description: "Utiliza fogo para pré-processamento de energia e calor. Cliques dão +1.000 de Inteligência.",
    cost: 1000000,
    eraId: EraId.CIVILIZATION,
    category: "click",
    effectValue: 1000,
    icon: "Flame",
    isPurchased: false
  },
  {
    id: "up_ferramentas_metais",
    name: "Metalurgia Metal-Bio",
    description: "Ferramentas forjadas em ligas biológicas estáveis. Tribos de Hominídeos são 3x mais produtivas.",
    cost: 8000000,
    eraId: EraId.CIVILIZATION,
    category: "production",
    effectValue: 3.0,
    icon: "Hammer",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "tribo_hominideos", count: 5 }
  },
  {
    id: "up_escrita_arquivos",
    name: "Arquivos Genéticos Coletivos",
    description: "Codifica o conhecimento humano em filamentos de DNA sintético estáveis. Cidades ganham 2x eficiência.",
    cost: 50000000,
    eraId: EraId.CIVILIZATION,
    category: "production",
    effectValue: 2.0,
    icon: "BookOpen",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "cidade_alvenaria", count: 3 }
  },
  {
    id: "up_globalizacao_rede",
    name: "Rede Mental de Silício",
    description: "Integração instantânea de pensamentos globais. Multiplica a produção de Inteligência total por 2x.",
    cost: 600000000,
    eraId: EraId.CIVILIZATION,
    category: "multiplier",
    effectValue: 2.0,
    icon: "Cpu",
    isPurchased: false
  },

  // === ERA 4: COSMIC COLONIZATION (Costs Cosmic Energy) ===
  {
    id: "up_reatores_antimateria",
    name: "Bio-Reatores de Antimatéria",
    description: "Aniquilação controlada acoplada em células mitocondriais modificadas. Cliques dão +100.000 de Energia Cósmica.",
    cost: 200000000,
    eraId: EraId.COSMIC_COLONIZATION,
    category: "click",
    effectValue: 100000,
    icon: "Atom",
    isPurchased: false
  },
  {
    id: "up_gravidade_sintetica",
    name: "Metabolismo Reprodutivo de Gravidade",
    description: "Dobra espacial biológica de curto alcance. Biosferas e Semeadores ganham 2x eficiência.",
    cost: 1500000000,
    eraId: EraId.COSMIC_COLONIZATION,
    category: "production",
    effectValue: 2.0,
    icon: "Orbit",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "biosfera_orbital", count: 5 }
  },
  {
    id: "up_sifao_estrela_max",
    name: "Metabolismo Cromático Solar",
    description: "Extrai hélio-3 diretamente da coroa. Motores de Estrela ganham 2.5x eficiência.",
    cost: 10000000000,
    eraId: EraId.COSMIC_COLONIZATION,
    category: "production",
    effectValue: 2.5,
    icon: "SunDim",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "motor_estrela_viva", count: 3 }
  },
  {
    id: "up_rede_dyson_coletiva",
    name: "Malha Neural de Dyson",
    description: "Sincroniza o envio eletromagnético da rede de coletores solares. Multiplica a Energia Cósmica gerada por 2.2x.",
    cost: 100000000000,
    eraId: EraId.COSMIC_COLONIZATION,
    category: "multiplier",
    effectValue: 2.2,
    icon: "Network",
    isPurchased: false
  },

  // === ERA 5: LIVING COSMOS (Costs Universal Consciousness) ===
  {
    id: "up_telepatia_quantica",
    name: "Sincronia Harmônica do Éter",
    description: "O universo pensa como um único corpo celular. Cliques dão +10.000.000 de Consciência.",
    cost: 50000000000,
    eraId: EraId.LIVING_COSMOS,
    category: "click",
    effectValue: 10000000,
    icon: "Infinity",
    isPurchased: false
  },
  {
    id: "up_senciencia_estelar",
    name: "Magnetismo Hiperdimensional",
    description: "Permite comunicação instantânea entre constelações. Constelações Sencientes ganham 3x eficiência.",
    cost: 400000000000,
    eraId: EraId.LIVING_COSMOS,
    category: "production",
    effectValue: 3.0,
    icon: "CloudLightning",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "constelacao_senciente", count: 5 }
  },
  {
    id: "up_espiral_consciente",
    name: "Sincronicidade Cósmica Ativa",
    description: "Correntes de matéria viva cruzam os vazios cósmicos. Galáxias Biológicas ganham 2x eficiência.",
    cost: 5000000000000,
    eraId: EraId.LIVING_COSMOS,
    category: "production",
    effectValue: 2.0,
    icon: "Sparkle",
    isPurchased: false,
    unlockedAtProducerCount: { producerId: "galaxia_biologica", count: 2 }
  },
  {
    id: "up_multiverso_infinito",
    name: "Matriz do Hiperespaço Multiversal",
    description: "Tece realidades vivas em cascata em dimensões superiores. Multiplica a Consciência Universal por 3x.",
    cost: 50000000000000,
    eraId: EraId.LIVING_COSMOS,
    category: "multiplier",
    effectValue: 3.0,
    icon: "ZapOff",
    isPurchased: false
  }
];
