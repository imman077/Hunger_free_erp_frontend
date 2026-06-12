/**
 * Configuration for donation-related constants.
 * This includes food categories, unit options, and other dropdown configurations.
 */

export const FOOD_CATEGORIES = [
  { value: "Cooked Food", label: "Cooked Food" },
  { value: "Water Bottle", label: "Water Bottle" },
  { value: "Water Cane", label: "Water Cane" },
];

export const UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "portions", label: "Portions" },
  { value: "parcels", label: "Parcels" },
  { value: "units", label: "Units" },
  { value: "liters", label: "Liters" },
  { value: "packs", label: "Packs" },
  { value: "boxes", label: "Boxes" },
  { value: "pieces", label: "Pieces" },
  { value: "grams", label: "Grams (g)" },
];

export const DIETARY_TYPES = [
  { value: "Veg", label: "Vegetarian (Veg)" },
  { value: "Non-Veg", label: "Non-Vegetarian (Non-Veg)" },
  { value: "Vegan", label: "Vegan" },
];

export const PREPARATION_TYPES = [
  { value: "Restaurant", label: "Restaurant Surplus" },
  { value: "Catering", label: "Catering / Event" },
];

export const NEED_CATEGORIES = [
  { value: "cooked_food", label: "Cooked Food" },
  { value: "water_bottle", label: "Water Bottle" },
  { value: "water_cane", label: "Water Cane" },
];

export const URGENCY_OPTIONS = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "cooked_food": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/cooked_food_egox4n.jpg",
  "water_bottle": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881819/water_bottle_xszila.jpg",
  "water_cane": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/water_cane_ojz5af.png",
  "Cooked Food": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/cooked_food_egox4n.jpg",
  "Water Bottle": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881819/water_bottle_xszila.jpg",
  "Water Cane": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/water_cane_ojz5af.png",
};

export const getCategoryImage = (category?: string): string => {
  if (!category) return CATEGORY_IMAGE_MAP["cooked_food"];
  const normalized = category.trim();
  return CATEGORY_IMAGE_MAP[normalized] || CATEGORY_IMAGE_MAP[normalized.toLowerCase()] || CATEGORY_IMAGE_MAP["cooked_food"];
};
