async function run() {
  const query = `
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
  `;

  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { userId: '6a1939fe875b850d3dd88b6b', role: 'DONOR' },
      }),
    });

    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error fetching:', error);
  }
}

run();
