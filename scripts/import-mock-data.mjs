import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Mock data
const businesses = [
  {
    business_name: "TechFlow Solutions",
    description: "We develop cutting-edge software solutions that help SMBs streamline operations and scale efficiently.",
    industry: "Technology",
    location: "San Francisco, CA",
    city: "San Francisco",
    state: "CA",
    engagement_score: 94,
    trust_score: 92,
    services: ["Custom Software", "Cloud Solutions", "AI Integration"],
    verified: true,
    badges: ["On-time Payments", "Verified Transactions", "ISO 27001", "SOC 2"]
  },
  {
    business_name: "HealthFirst Medical",
    description: "Providing comprehensive medical equipment and supplies to healthcare facilities across the nation.",
    industry: "Healthcare",
    location: "Boston, MA",
    city: "Boston",
    state: "MA",
    engagement_score: 92,
    trust_score: 95,
    services: ["Medical Equipment", "Supplies", "Maintenance"],
    verified: true,
    badges: ["Reliable Partner", "FDA Approved", "ISO Certified"]
  },
  {
    business_name: "GreenBuild Construction",
    description: "Eco-friendly construction services specializing in green building practices and sustainable materials.",
    industry: "Construction",
    location: "Austin, TX",
    city: "Austin",
    state: "TX",
    engagement_score: 87,
    trust_score: 88,
    services: ["Green Building", "Renovations", "Energy Consulting"],
    verified: true,
    badges: ["Eco-friendly", "Verified", "LEED Certified", "Minority-owned"]
  },
  {
    business_name: "LogiTrans Shipping",
    description: "End-to-end logistics solutions with real-time tracking and guaranteed delivery times.",
    industry: "Logistics",
    location: "Chicago, IL",
    city: "Chicago",
    state: "IL",
    engagement_score: 78,
    trust_score: 85,
    services: ["Freight", "Warehousing", "Last-Mile Delivery"],
    verified: true,
    badges: ["Verified"]
  },
  {
    business_name: "Gourmet Bites Catering",
    description: "Premium catering services for corporate events, weddings, and special occasions.",
    industry: "Food & Beverage",
    location: "New York, NY",
    city: "New York",
    state: "NY",
    engagement_score: 85,
    trust_score: 90,
    services: ["Corporate Catering", "Event Planning", "Menu Design"],
    verified: true,
    badges: ["Verified", "Local Favorite", "Food Safety Certified"]
  },
  {
    business_name: "RetailPro Systems",
    description: "Point-of-sale systems and inventory management for retail businesses of all sizes.",
    industry: "Retail",
    location: "Seattle, WA",
    city: "Seattle",
    state: "WA",
    engagement_score: 89,
    trust_score: 87,
    services: ["POS Systems", "Inventory Management", "Analytics"],
    verified: true,
    badges: ["Verified"]
  },
  {
    business_name: "DataDrive Analytics",
    description: "Business intelligence and data analytics consulting for enterprises.",
    industry: "Technology",
    location: "San Francisco, CA",
    city: "San Francisco",
    state: "CA",
    engagement_score: 88,
    trust_score: 91,
    services: ["Data Analysis", "BI Consulting", "Dashboard Development"],
    verified: true,
    badges: ["Verified"]
  },
  {
    business_name: "GreenLeaf Manufacturing",
    description: "Eco-friendly packaging and manufacturing solutions.",
    industry: "Manufacturing",
    location: "Portland, OR",
    city: "Portland",
    state: "OR",
    engagement_score: 82,
    trust_score: 86,
    services: ["Packaging", "Manufacturing", "Sustainable Materials"],
    verified: true,
    badges: ["Eco-friendly", "ISO Certified"]
  },
  {
    business_name: "BrandSpark Marketing",
    description: "Full-service digital marketing agency for SMBs.",
    industry: "Marketing",
    location: "Los Angeles, CA",
    city: "Los Angeles",
    state: "CA",
    engagement_score: 90,
    trust_score: 89,
    services: ["Digital Marketing", "Social Media", "Content Creation"],
    verified: true,
    badges: ["Verified"]
  },
  {
    business_name: "UrbanBuild Construction",
    description: "Modern urban construction and renovation specialists.",
    industry: "Construction",
    location: "New York, NY",
    city: "New York",
    state: "NY",
    engagement_score: 84,
    trust_score: 87,
    services: ["Construction", "Renovation", "Project Management"],
    verified: true,
    badges: ["Verified"]
  }
];

const opportunities = [
  {
    title: "Need Logistics Partner for National Expansion",
    description: "Looking for a reliable logistics partner to support our expansion into 5 new states. Must have experience with cold chain management and real-time tracking capabilities.",
    type: "Partnership",
    status: "Open",
    budget: "$50k - $100k annually",
    deadline: "2025-01-15",
    location: "Texas",
    company_name: "GreenBuild Construction",
    requirements: ["Cold chain experience", "Multi-state coverage", "Real-time tracking", "Insurance coverage"],
    views: 245
  },
  {
    title: "Software Development for Healthcare Platform",
    description: "Seeking experienced software development team to build a patient management platform. Must have healthcare industry experience and HIPAA compliance knowledge.",
    type: "Project",
    status: "Open",
    budget: "$150k - $250k",
    deadline: "2025-02-01",
    location: "Remote",
    company_name: "HealthFirst Medical",
    requirements: ["Healthcare experience", "HIPAA compliance", "React expertise", "Cloud architecture"],
    views: 456
  },
  {
    title: "Catering Services for Tech Conference Series",
    description: "Looking for premium catering partner for quarterly tech conferences. Expected 500+ attendees per event. Must accommodate dietary restrictions.",
    type: "RFP",
    status: "Open",
    budget: "$30k - $50k per event",
    deadline: "2024-12-30",
    location: "San Francisco, CA",
    company_name: "TechFlow Solutions",
    requirements: ["Large event experience", "Dietary accommodations", "Setup/cleanup included", "Professional service staff"],
    views: 189
  },
  {
    title: "Manufacturing Equipment Installation",
    description: "Need qualified partner for installing new manufacturing line. Must have experience with industrial equipment and safety compliance.",
    type: "Tender",
    status: "Open",
    budget: "$200k - $300k",
    deadline: "2025-01-20",
    location: "Detroit, MI",
    company_name: "RetailPro Systems",
    requirements: ["Industrial experience", "Safety certifications", "Insurance", "References required"],
    views: 312
  },
  {
    title: "Office Space Renovation - 15,000 sq ft",
    description: "Seeking experienced commercial contractor for complete office renovation. Modern open-plan design, sustainable materials, smart building integration.",
    type: "RFP",
    status: "Open",
    budget: "$500K-$750K",
    deadline: "2024-07-25",
    location: "San Francisco, CA",
    company_name: "DataDrive Analytics",
    requirements: ["Commercial experience", "Sustainable materials", "Smart building systems", "Insurance & bonding"],
    views: 145
  },
  {
    title: "Joint Venture: B2B SaaS Product Development",
    description: "Looking for technology partner to co-develop a B2B SaaS platform for the construction industry.",
    type: "Collaboration",
    status: "Open",
    budget: "Equity Partnership",
    deadline: "2024-08-30",
    location: "Remote-friendly",
    company_name: "UrbanBuild Construction",
    requirements: ["SaaS development experience", "Cloud architecture", "Mobile development", "Construction industry knowledge"],
    views: 289
  },
  {
    title: "Marketing Campaign for Product Launch",
    description: "Need full-service marketing agency for Q4 product launch. Includes brand strategy, content creation, social media, and paid advertising.",
    type: "Project",
    status: "Open",
    budget: "$75K-$125K",
    deadline: "2024-08-10",
    location: "Remote OK",
    company_name: "GreenLeaf Manufacturing",
    requirements: ["Product launch experience", "Multi-channel campaigns", "Content creation", "Performance tracking"],
    views: 198
  },
  {
    title: "Seeking Logistics Partner for Nationwide Distribution",
    description: "Looking for a reliable logistics partner to handle our nationwide distribution. Need warehousing in 3+ locations.",
    type: "Partnership",
    status: "Open",
    budget: "$50K-$100K/month",
    deadline: "2024-08-15",
    location: "Nationwide",
    company_name: "TechFlow Solutions",
    requirements: ["Warehousing in multiple locations", "Real-time tracking", "Insurance coverage", "Volume discounts"],
    views: 234
  },
  {
    title: "Custom Packaging Design & Manufacturing",
    description: "Looking for eco-friendly packaging manufacturer for our new product line. Need sustainable materials and custom design capabilities.",
    type: "Project",
    status: "Open",
    budget: "$25K-$50K",
    deadline: "2024-07-30",
    location: "West Coast Preferred",
    company_name: "BrandSpark Marketing",
    requirements: ["Eco-friendly materials", "Custom design", "Scalable production", "ISO certified"],
    views: 167
  }
];

const offers = [
  {
    title: "20% Off Cloud Migration Services",
    description: "Get 20% off our complete cloud migration package. Includes assessment, migration, and 3 months of support.",
    company_name: "TechFlow Solutions",
    discount_percentage: 20,
    original_price: "$50,000",
    discounted_price: "$40,000",
    valid_until: "2025-01-31",
    terms: "New clients only. Minimum project value $50k.",
    is_featured: true,
    category: "Service"
  },
  {
    title: "15% Discount on First Construction Project",
    description: "First-time clients get 15% off their initial green building project with us.",
    company_name: "GreenBuild Construction",
    discount_percentage: 15,
    original_price: "$100,000",
    discounted_price: "$85,000",
    valid_until: "2025-02-28",
    terms: "Valid for projects over $100k",
    is_featured: true,
    category: "Service"
  },
  {
    title: "Free Shipping on Medical Equipment Orders",
    description: "Get free nationwide shipping on all medical equipment orders over $10k.",
    company_name: "HealthFirst Medical",
    discount_percentage: 0,
    original_price: "$10,000",
    discounted_price: "$10,000",
    valid_until: "2025-01-15",
    terms: "Orders over $10k. Continental US only.",
    is_featured: true,
    category: "Product"
  },
  {
    title: "25% Off Event Catering Packages",
    description: "Special holiday offer - 25% off all corporate event catering packages booked this month.",
    company_name: "Gourmet Bites Catering",
    discount_percentage: 25,
    original_price: "$20,000",
    discounted_price: "$15,000",
    valid_until: "2024-12-31",
    terms: "Book by Dec 31. Events can be held through Q1 2025.",
    is_featured: false,
    category: "Service"
  },
  {
    title: "Summer Special: 30% Off Enterprise Software Packages",
    description: "Get 30% off our enterprise software solutions for new clients. Includes custom development, cloud hosting, and 6 months support.",
    company_name: "TechFlow Solutions",
    discount_percentage: 30,
    original_price: "$50,000",
    discounted_price: "$35,000",
    valid_until: "2024-08-31",
    is_featured: true,
    category: "Service"
  },
  {
    title: "Free Shipping on Bulk Orders Over $10K",
    description: "Order eco-friendly packaging materials worth $10K or more and get free nationwide shipping.",
    company_name: "GreenLeaf Manufacturing",
    discount_percentage: 15,
    original_price: "$12,000",
    discounted_price: "$10,200",
    valid_until: "2024-07-31",
    is_featured: true,
    category: "Product"
  },
  {
    title: "First Month Free: Business Intelligence Consulting",
    description: "New clients get their first month of BI consulting completely free. Includes data analysis and dashboard setup.",
    company_name: "DataDrive Analytics",
    discount_percentage: 100,
    original_price: "$8,000",
    discounted_price: "$0",
    valid_until: "2024-08-15",
    is_featured: false,
    category: "Consultation"
  },
  {
    title: "20% Off Digital Marketing Packages",
    description: "Launch your brand with our comprehensive digital marketing packages. 20% off for SMBs starting their first campaign.",
    company_name: "BrandSpark Marketing",
    discount_percentage: 20,
    original_price: "$15,000",
    discounted_price: "$12,000",
    valid_until: "2024-09-30",
    is_featured: true,
    category: "Service"
  }
];

async function importData() {
  console.log('🚀 Starting PocketBase data import...\n');

  try {
    // Import Businesses
    console.log('📦 Importing Businesses...');
    for (let i = 0; i < businesses.length; i++) {
      try {
        const record = await pb.collection('businesses').create(businesses[i]);
        console.log(`✅ Created business ${i + 1}/${businesses.length}: ${businesses[i].business_name}`);
      } catch (error) {
        console.error(`❌ Failed to create business: ${businesses[i].business_name}`, error.message);
      }
    }

    console.log('\n📋 Importing Opportunities...');
    for (let i = 0; i < opportunities.length; i++) {
      try {
        const record = await pb.collection('opportunities').create(opportunities[i]);
        console.log(`✅ Created opportunity ${i + 1}/${opportunities.length}: ${opportunities[i].title}`);
      } catch (error) {
        console.error(`❌ Failed to create opportunity: ${opportunities[i].title}`, error.message);
      }
    }

    console.log('\n🎁 Importing Offers...');
    for (let i = 0; i < offers.length; i++) {
      try {
        const record = await pb.collection('offers').create(offers[i]);
        console.log(`✅ Created offer ${i + 1}/${offers.length}: ${offers[i].title}`);
      } catch (error) {
        console.error(`❌ Failed to create offer: ${offers[i].title}`, error.message);
      }
    }

    console.log('\n✨ Import completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Businesses: ${businesses.length}`);
    console.log(`   Opportunities: ${opportunities.length}`);
    console.log(`   Offers: ${offers.length}`);
    console.log(`\n🌐 View your data at: http://127.0.0.1:8090/_/`);

  } catch (error) {
    console.error('\n❌ Import failed:', error);
  }
}

// Run the import
importData();
