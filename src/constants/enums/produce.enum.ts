export const PRODUCE_VALUES = [
  "RICE",
  "CORN",
  "VEGETABLES",
  "FRUITS",
  "COFFEE",
  "TEA",
  "RUBBER",
  "SUGARCANE",
  "CASSAVA",
  "PEPPER",
  "COCONUT",
  "CASHEW",
  "AQUACULTURE",
  "LIVESTOCK",
  "OTHER",
] as const;

export type ProduceType = (typeof PRODUCE_VALUES)[number];

export const PRODUCE_LABELS: Record<ProduceType, string> = {
  RICE: "Lúa gạo",
  CORN: "Ngô",
  VEGETABLES: "Rau củ",
  FRUITS: "Trái cây",
  COFFEE: "Cà phê",
  TEA: "Chè",
  RUBBER: "Cao su",
  SUGARCANE: "Mía",
  CASSAVA: "Sắn",
  PEPPER: "Tiêu",
  COCONUT: "Dừa",
  CASHEW: "Điều",
  AQUACULTURE: "Thủy sản",
  LIVESTOCK: "Chăn nuôi",
  OTHER: "Khác",
};
