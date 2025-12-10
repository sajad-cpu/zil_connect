import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

console.log('🧪 Testing single business creation...\n');

const testBusiness = {
  business_name: "Test Company",
  description: "A test company",
  industry: "Technology"
};

try {
  console.log('Attempting to create:', testBusiness);
  const record = await pb.collection('businesses').create(testBusiness);
  console.log('✅ Success! Created record:', record.id);
  console.log('Record data:', record);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Error data:', error.data);
  console.error('Full error:', JSON.stringify(error, null, 2));
}
