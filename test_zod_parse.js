import { getPointsTiersOutputSchema } from "./src/features/donor/rewards/api/get_points_tiers/get_points_tiers_output_model";

async function run() {
  const query = `
    query PointsTiers($role: String) {
      pointsTiers(role: $role) {
        id
        name
        role
        minPoints
        maxPoints
        color
        benefits
        isActive
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { role: 'DONOR' },
      }),
    });

    const result = await response.json();
    console.log('Result from graphql:', JSON.stringify(result));
    
    // Apollo query response structure typically includes loading: false when resolving
    const apolloResponse = {
      data: result.data,
      loading: false,
    };
    
    const parsed = getPointsTiersOutputSchema.parse(apolloResponse);
    console.log('Parsed successfully:', JSON.stringify(parsed));
  } catch (error) {
    console.error('Parsing error:', error);
  }
}

run();
