// src/utils/unitMapper.ts

export const unitMapping: Record<string, string> = {
  bag: "bao",
  kg: "kg",
  gram: "gram",
  g: "gram",
  liter: "lít",
  l: "lít",
  ml: "ml",
  piece: "cái",
  pc: "cái",
  bunch: "bó",
  plant: "cây",
  tree: "cây",
  seedling: "cây con",
  hectare: "ha",
  acre: "mẫu",
  sào: "sào",
  m2: "m²",
  squareMeter: "m²",
  bottle: "chai",
  can: "lon",
  pack: "gói",
  box: "hộp",
  tube: "ống",
  dose: "liều",
  hour: "giờ",
  minute: "phút",
  day: "ngày",
};

/**
 * @param unitKey
 * @returns
 */
export const getUnitDisplay = (unitKey?: string): string => {
  if (!unitKey) return "";
  const lowerKey = unitKey.toLowerCase();
  return unitMapping[lowerKey] || unitKey;
};
