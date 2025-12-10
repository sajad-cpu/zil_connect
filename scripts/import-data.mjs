import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Your mock data would go here
const businesses = [
  { business_name: "TechFlow Solutions", description: "Software solutions", industry: "Technology", location: "San Francisco, CA", city: "San Francisco", state: "CA", engagement_score: 94, trust_score: 92, services: ["Custom Software", "Cloud Solutions"], verified: true, badges: ["Verified"] }
];

console.log('🚀 Starting import...');
console.log('Creating collections in PocketBase...\n');

// Import function
for (const business of businesses) {
  try {
    await pb.collection('businesses').create(business);
    console.log(`✅ Created: ${business.business_name}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

console.log('\n✨ Done!');
