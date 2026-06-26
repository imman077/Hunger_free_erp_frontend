import { getPointsTiersApi } from "../api/get_points_tiers/get_points_tiers_api";

export const onInit = async () => {
  try {
    await getPointsTiersApi({ role: "DONOR" });
  } catch (err) {
    console.error("Failed to load points tiers:", err);
  }
};
