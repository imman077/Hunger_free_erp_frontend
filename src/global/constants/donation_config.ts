/**
 * Configuration for donation-related constants.
 * This includes food categories, unit options, and other dropdown configurations.
 */
export const FOOD_CATEGORIES = [
  { value: "Cooked Food", label: "Cooked Food" },
  { value: "Water Bottle", label: "Water Bottle" },
  { value: "Water Cane", label: "Water Cane" },
  { value: "Dry Ration", label: "Dry Food / Groceries" },
  { value: "Vegetables", label: "Vegetables" },
  { value: "Fruits", label: "Fruits" },
  { value: "other", label: "Other" },
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
  { value: "Packaged", label: "Packaged / Processed" },
  { value: "Home Cooked", label: "Home Cooked" },
];

export const NEED_CATEGORIES = [
  { value: "cooked_food", label: "Cooked Food" },
  { value: "water_bottle", label: "Water Bottle" },
  { value: "water_cane", label: "Water Cane" },
  { value: "dry_ration", label: "Dry Food / Groceries" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "other", label: "Other" },
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
  "dry_ration": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80",
  "fruits": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80",
  "other": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "Other": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "Cooked Food": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/cooked_food_egox4n.jpg",
  "Water Bottle": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881819/water_bottle_xszila.jpg",
  "Water Cane": "https://res.cloudinary.com/deyog3v3w/image/upload/v1779881820/water_cane_ojz5af.png",
  "Dry Ration": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "Vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80",
  "Fruits": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80",
};
export const getCategoryImage = (category?: string): string => {
  if (!category) return CATEGORY_IMAGE_MAP["cooked_food"];
  const normalized = category.trim();
  return CATEGORY_IMAGE_MAP[normalized] || CATEGORY_IMAGE_MAP[normalized.toLowerCase()] || CATEGORY_IMAGE_MAP["cooked_food"];
};
