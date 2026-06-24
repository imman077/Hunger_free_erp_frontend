import { DonorDataSchema } from "./src/features/donor/store/donor-schemas";
import { initialData } from "./src/features/donor/store/donor-mock-data";

const mapCategory = (cat) => {
  const c = (cat || "").toLowerCase();
  if (c === "voucher" || c === "cash" || c === "fuel" || c === "grant") return "cash";
  if (c === "tours" || c === "travel") return "tours";
  return "youth"; // fallback
};

const mapIcon = (iconName) => {
  const name = (iconName || "").toLowerCase();
  if (name === "star") return "⭐";
  if (name === "gift") return "🎁";
  if (name === "zap") return "⚡";
  if (name === "cash" || name === "money") return "💰";
  return iconName || "🎁";
};

async function run() {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetDonorRewards($userId: ID!, $role: String!) {
            me(userId: $userId) {
              id
              gamification {
                points
              }
            }
            rewards(role: $role) {
              id
              name
              description
              pointsRequired
              category
              role
              amount
              available
            }
            prizes(role: $role) {
              id
              label
              icon
              prizeType
              value
            }
          }
        `,
        variables: { userId: '6a1939fe875b850d3dd88b6b', role: 'DONOR' },
      }),
    });

    const result = await response.json();
    const gqlData = result.data;
    
    const meRes = gqlData.me;
    const rewardsRes = gqlData.rewards || [];
    const prizesRes = gqlData.prizes || [];

    const currentPoints = meRes?.gamification?.points ?? 0;

    const donorRewards = rewardsRes.map((r) => ({
      id: r.id,
      category: mapCategory(r.category),
      name: r.name,
      amount: r.amount || "N/A",
      points: r.pointsRequired || 0,
      available: r.available !== false,
      desc: r.description || "",
    }));

    const mappedPrizes = prizesRes.map((p) => ({
      id: p.id,
      label: p.label,
      icon: mapIcon(p.icon),
      color: p.prizeType === "GRANT" ? "#22c55e" : "var(--bg-secondary)",
    }));

    const nextData = {
      ...initialData,
      currentPoints,
      rewards: donorRewards,
      prizes: mappedPrizes.length > 0 ? mappedPrizes : initialData.prizes,
    };

    const parseResult = DonorDataSchema.safeParse(nextData);
    if (parseResult.success) {
      console.log("Validation Succeeded!");
    } else {
      console.error("Validation Failed:", JSON.stringify(parseResult.error, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
