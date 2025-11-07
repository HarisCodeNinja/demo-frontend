/**
 * HYPER API Test Script
 * Use this to test if patterns are matching correctly
 */

import { shouldUseHyperApi, routeHyperQuery } from './hyperQueryRouter';

// Test queries
const testQueries = [
  'Give me department-wise headcount',
  'Show me the dashboard',
  'Give me today\'s attendance summary',
  'Show employees with missing documents',
  'Who hasn\'t completed onboarding?',
  'Show recruitment pipeline',
  'Show all candidates waiting for interview feedback',
  'Show late comers',
];

export async function testHyperPatterns() {
  console.log('\n=== HYPER Pattern Matching Test ===\n');

  for (const query of testQueries) {
    console.log(`\nTesting: "${query}"`);
    console.log('-'.repeat(50));

    const shouldUse = shouldUseHyperApi(query);
    console.log('Should use HYPER API:', shouldUse);

    if (shouldUse) {
      const match = await routeHyperQuery(query);
      console.log('Match result:', {
        matched: match.matched,
        category: match.category,
        hasEndpoint: !!match.endpoint,
        params: match.params
      });
    } else {
      console.log('⚠️ Query did not match any HYPER pattern!');
    }
  }

  console.log('\n=== Test Complete ===\n');
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testHyperPatterns = testHyperPatterns;
  console.log('💡 HYPER Test available! Run: testHyperPatterns()');
}
