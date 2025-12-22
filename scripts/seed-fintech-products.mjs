import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.captain.sebipay.com');

const products = [
  {
    name: "QuickBooks Online",
    description: "Cloud-based accounting software for small businesses. Track income and expenses, create invoices, manage bills, and run financial reports.",
    category: "Accounting Software",
    provider: "Intuit",
    pricing_type: "Subscription",
    pricing_info: "Starting at $30/month",
    enrollment_url: "https://quickbooks.intuit.com/",
    affiliate_id: "QB_AFFILIATE_001",
    commission_type: "Percentage",
    commission_value: 15,
    is_featured: true,
    is_active: true,
    tags: ["accounting", "bookkeeping", "invoicing", "financial reporting"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 1
  },
  {
    name: "Stripe",
    description: "Online payment processing for internet businesses. Accept payments, send payouts, and manage your business online.",
    category: "Payment Processing",
    provider: "Stripe",
    pricing_type: "Paid",
    pricing_info: "2.9% + 30¢ per transaction",
    enrollment_url: "https://stripe.com/",
    affiliate_id: "STRIPE_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 50,
    is_featured: true,
    is_active: true,
    tags: ["payments", "payment gateway", "online payments", "e-commerce"],
    integration_type: "API",
    views: 0,
    enrollments: 0,
    order: 2
  },
  {
    name: "Xero",
    description: "Beautiful accounting software for small businesses. Connect your bank, reconcile transactions, and get up-to-date financials.",
    category: "Accounting Software",
    provider: "Xero",
    pricing_type: "Subscription",
    pricing_info: "Starting at $13/month",
    enrollment_url: "https://www.xero.com/",
    affiliate_id: "XERO_AFF_001",
    commission_type: "Percentage",
    commission_value: 12,
    is_featured: true,
    is_active: true,
    tags: ["accounting", "bookkeeping", "bank reconciliation", "cloud accounting"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 3
  },
  {
    name: "Mercury",
    description: "Banking built for startups. Free business banking with powerful features like debit cards, wire transfers, and treasury management.",
    category: "Business Banking",
    provider: "Mercury",
    pricing_type: "Free",
    pricing_info: "Free for all businesses",
    enrollment_url: "https://mercury.com/",
    affiliate_id: "MERCURY_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 25,
    is_featured: true,
    is_active: true,
    tags: ["banking", "business account", "debit cards", "treasury"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 4
  },
  {
    name: "Gusto",
    description: "All-in-one people platform for payroll, benefits, and HR. Automate payroll, manage benefits, and keep your team happy.",
    category: "Payroll Services",
    provider: "Gusto",
    pricing_type: "Subscription",
    pricing_info: "Starting at $40/month + $6 per person",
    enrollment_url: "https://gusto.com/",
    affiliate_id: "GUSTO_AFF_001",
    commission_type: "Recurring",
    commission_value: 10,
    is_featured: true,
    is_active: true,
    tags: ["payroll", "hr", "benefits", "employee management"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 5
  },
  {
    name: "FreshBooks",
    description: "Cloud accounting software designed for small business owners and freelancers. Track time, send invoices, and manage expenses.",
    category: "Accounting Software",
    provider: "FreshBooks",
    pricing_type: "Subscription",
    pricing_info: "Starting at $17/month",
    enrollment_url: "https://www.freshbooks.com/",
    affiliate_id: "FRESHBOOKS_AFF_001",
    commission_type: "Percentage",
    commission_value: 10,
    is_featured: false,
    is_active: true,
    tags: ["accounting", "invoicing", "time tracking", "expenses"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 6
  },
  {
    name: "Square",
    description: "Point of sale and payment processing for businesses. Accept payments in person, online, or on the go with Square POS.",
    category: "Payment Processing",
    provider: "Square",
    pricing_type: "Paid",
    pricing_info: "2.6% + 10¢ per in-person transaction",
    enrollment_url: "https://squareup.com/",
    affiliate_id: "SQUARE_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 30,
    is_featured: false,
    is_active: true,
    tags: ["payments", "pos", "point of sale", "card reader"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 7
  },
  {
    name: "Wave",
    description: "Free accounting software for small businesses. Invoicing, accounting, and receipt scanning - all in one place.",
    category: "Accounting Software",
    provider: "Wave",
    pricing_type: "Free",
    pricing_info: "Free accounting, paid payment processing",
    enrollment_url: "https://www.waveapps.com/",
    affiliate_id: "WAVE_AFF_001",
    commission_type: "Percentage",
    commission_value: 5,
    is_featured: false,
    is_active: true,
    tags: ["accounting", "free", "invoicing", "receipt scanning"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 8
  },
  {
    name: "Expensify",
    description: "Expense management and receipt scanning app. Track expenses, scan receipts, and automate expense reports.",
    category: "Expense Management",
    provider: "Expensify",
    pricing_type: "Freemium",
    pricing_info: "Free for individuals, $5/user/month for teams",
    enrollment_url: "https://www.expensify.com/",
    affiliate_id: "EXPENSIFY_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 20,
    is_featured: false,
    is_active: true,
    tags: ["expenses", "receipt scanning", "expense reports", "reimbursement"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 9
  },
  {
    name: "Zoho Invoice",
    description: "Online invoicing software for small businesses. Create professional invoices, track payments, and manage clients.",
    category: "Invoicing Tools",
    provider: "Zoho",
    pricing_type: "Freemium",
    pricing_info: "Free for up to 5 customers, paid plans available",
    enrollment_url: "https://www.zoho.com/invoice/",
    affiliate_id: "ZOHO_AFF_001",
    commission_type: "Percentage",
    commission_value: 8,
    is_featured: false,
    is_active: true,
    tags: ["invoicing", "billing", "payment tracking", "client management"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 10
  }
];

async function seedProducts() {
  try {
    console.log('Starting to seed fintech products...');

    const adminEmail = process.env.PB_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.PB_ADMIN_PASSWORD || 'admin123456789';

    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('Authenticated as admin');
    } catch (authError) {
      console.error('Admin authentication failed. Please set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD environment variables.');
      console.error('Or authenticate manually in PocketBase admin panel first.');
      throw authError;
    }

    let created = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        const existing = await pb.collection('fintech_products').getList(1, 1, {
          filter: `name="${product.name}"`
        });

        if (existing.items.length > 0) {
          console.log(`Skipping ${product.name} - already exists`);
          skipped++;
          continue;
        }

        await pb.collection('fintech_products').create(product);
        console.log(`✓ Created: ${product.name}`);
        created++;
      } catch (error) {
        console.error(`✗ Failed to create ${product.name}:`, error.message);
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Created: ${created} products`);
    console.log(`   Skipped: ${skipped} products (already exist)`);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

