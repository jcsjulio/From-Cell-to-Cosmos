/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Era, EraId } from '../types';

export const ERAS: Era[] = [
  {
    id: EraId.MICROSCOPIC,
    name: "Era Microscópica",
    description: "Inicie a vida em uma placa de Petri. Sintetize nutrientes simples e multiplique os primeiros procariontes e bactérias autotróficas.",
    resourceName: "Nutrientes",
    resourceIcon: "Dna",
    color: "emerald",
    accentColor: "#10b981",
    bgColor: "bg-slate-950",
    minNutrientsToUnlock: 0,
  },
  {
    id: EraId.MULTICELLULAR,
    name: "Era Multicelular",
    description: "Células se unem em simbiose estrutural. Desenvolva os primeiros tecidos, órgãos sensoriais primordiais e organismos marinhos complexos.",
    resourceName: "Biomassa",
    resourceIcon: "Database",
    color: "cyan",
    accentColor: "#06b6d4",
    bgColor: "bg-zinc-950",
    minNutrientsToUnlock: 10000,
  },
  {
    id: EraId.ECOSYSTEM,
    name: "Era de Ecossistemas",
    description: "A vida conquista a terra firme e os céus. Crie cadeias alimentares complexas, florestas exuberantes e uma megafauna abundante.",
    resourceName: "Força Vital",
    resourceIcon: "Leaf",
    color: "teal",
    accentColor: "#14b8a6",
    bgColor: "bg-neutral-950",
    minNutrientsToUnlock: 1000000,
  },
  {
    id: EraId.CIVILIZATION,
    name: "Era da Civilização",
    description: "A semente da senciência floresce. Organize tribos, erga megacidades e desenvolva biotecnologia avançada para dominar as leis da evolução.",
    resourceName: "Inteligência",
    resourceIcon: "Brain",
    color: "indigo",
    accentColor: "#6366f1",
    bgColor: "bg-slate-900",
    minNutrientsToUnlock: 250000000,
  },
  {
    id: EraId.COSMIC_COLONIZATION,
    name: "Era de Colonização Cósmica",
    description: "Espalhe a biosfera entre as estrelas. Construa naves orgânicas, terraforme planetas inteiros e construa enxames de Dyson biológicos.",
    resourceName: "Energia Cósmica",
    resourceIcon: "Orbit",
    color: "purple",
    accentColor: "#a855f7",
    bgColor: "bg-stone-950",
    minNutrientsToUnlock: 50000000000,
  },
  {
    id: EraId.LIVING_COSMOS,
    name: "Era do Cosmos Vivo",
    description: "Transceda a matéria e a energia física. Crie galáxias sencientes e teça novos universos biológicos em um multiverso auto-sustentável.",
    resourceName: "Consciência Universal",
    resourceIcon: "Sparkles",
    color: "pink",
    accentColor: "#ec4899",
    bgColor: "bg-slate-950",
    minNutrientsToUnlock: 10000000000000,
  },
];
