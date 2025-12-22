import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.captain.sebipay.com');

const products = [
  {
    name: "QuickBooks",
    description: "Cloud-based accounting software for small businesses. Track income and expenses, create invoices, manage bills, and run financial reports. Trusted by millions of businesses worldwide.",
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
    tags: ["accounting", "bookkeeping", "invoicing", "financial reporting", "small business"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 1
  },
  {
    name: "Xero",
    description: "Beautiful accounting software for small businesses. Connect your bank, reconcile transactions, and get up-to-date financials. Perfect for growing businesses.",
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
    order: 2
  },
  {
    name: "NetSuite",
    description: "Enterprise resource planning (ERP) and accounting software. Comprehensive business management solution for mid-size and large businesses.",
    category: "Accounting Software",
    provider: "Oracle",
    pricing_type: "Subscription",
    pricing_info: "Custom pricing - contact for quote",
    enrollment_url: "https://www.netsuite.com/",
    affiliate_id: "NETSUITE_AFF_001",
    commission_type: "Percentage",
    commission_value: 10,
    is_featured: false,
    is_active: true,
    tags: ["accounting", "erp", "enterprise", "financial management"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 3
  },
  {
    name: "Sage",
    description: "Accounting and business management software. Solutions for small to medium businesses with comprehensive financial tools.",
    category: "Accounting Software",
    provider: "Sage",
    pricing_type: "Subscription",
    pricing_info: "Starting at $10/month",
    enrollment_url: "https://www.sage.com/",
    affiliate_id: "SAGE_AFF_001",
    commission_type: "Percentage",
    commission_value: 8,
    is_featured: false,
    is_active: true,
    tags: ["accounting", "business management", "financial software"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 4
  },
  {
    name: "Gusto",
    description: "All-in-one people platform for payroll, benefits, and HR. Automate payroll, manage benefits, and keep your team happy. Perfect for small businesses.",
    category: "Business Analytics",
    provider: "Gusto",
    pricing_type: "Subscription",
    pricing_info: "Starting at $40/month + $6 per person",
    enrollment_url: "https://gusto.com/",
    affiliate_id: "GUSTO_AFF_001",
    commission_type: "Recurring",
    commission_value: 10,
    is_featured: true,
    is_active: true,
    tags: ["payroll", "hr", "benefits", "employee management", "small business"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 5
  },
  {
    name: "ADP",
    description: "Comprehensive payroll and HR solutions for businesses of all sizes. Trusted by millions of businesses worldwide for payroll processing and HR management.",
    category: "Business Analytics",
    provider: "ADP",
    pricing_type: "Subscription",
    pricing_info: "Custom pricing based on business size",
    enrollment_url: "https://www.adp.com/",
    affiliate_id: "ADP_AFF_001",
    commission_type: "Recurring",
    commission_value: 8,
    is_featured: false,
    is_active: true,
    tags: ["payroll", "hr", "enterprise", "payroll processing"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 6
  },
  {
    name: "Paychex",
    description: "Payroll, HR, and benefits solutions for small to large businesses. Streamline payroll processing and manage employee benefits efficiently.",
    category: "Business Analytics",
    provider: "Paychex",
    pricing_type: "Subscription",
    pricing_info: "Starting at $39/month + $5 per employee",
    enrollment_url: "https://www.paychex.com/",
    affiliate_id: "PAYCHEX_AFF_001",
    commission_type: "Recurring",
    commission_value: 9,
    is_featured: false,
    is_active: true,
    tags: ["payroll", "hr", "benefits", "payroll services"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 7
  },
  {
    name: "Rippling",
    description: "Modern HR, IT, and Finance platform. Unify payroll, benefits, devices, and apps in one system. Built for the modern workplace.",
    category: "Business Analytics",
    provider: "Rippling",
    pricing_type: "Subscription",
    pricing_info: "Starting at $8/user/month",
    enrollment_url: "https://www.rippling.com/",
    affiliate_id: "RIPPLING_AFF_001",
    commission_type: "Recurring",
    commission_value: 12,
    is_featured: false,
    is_active: true,
    tags: ["payroll", "hr", "it management", "modern platform"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 8
  },
  {
    name: "Mercury",
    description: "Banking built for startups. Free business banking with powerful features like debit cards, wire transfers, and treasury management. No monthly fees.",
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
    tags: ["banking", "business account", "debit cards", "treasury", "startups"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 9
  },
  {
    name: "Relay",
    description: "Business banking and money management platform. Multiple checking accounts, debit cards, and powerful financial tools for small businesses.",
    category: "Business Banking",
    provider: "Relay",
    pricing_type: "Freemium",
    pricing_info: "Free plan available, paid plans from $30/month",
    enrollment_url: "https://relayfi.com/",
    affiliate_id: "RELAY_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 20,
    is_featured: false,
    is_active: true,
    tags: ["banking", "business account", "money management", "checking accounts"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 10
  },
  {
    name: "Novo",
    description: "Free business banking for entrepreneurs. No monthly fees, no minimum balance, and powerful tools to manage your business finances.",
    category: "Business Banking",
    provider: "Novo",
    pricing_type: "Free",
    pricing_info: "Free business banking",
    enrollment_url: "https://www.novo.co/",
    affiliate_id: "NOVO_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 15,
    is_featured: false,
    is_active: true,
    tags: ["banking", "business account", "free banking", "entrepreneurs"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 11
  },
  {
    name: "Avalara",
    description: "Automated tax compliance software. Calculate, collect, and remit sales tax automatically. Trusted by businesses worldwide for tax automation.",
    category: "Tax Software",
    provider: "Avalara",
    pricing_type: "Subscription",
    pricing_info: "Starting at $99/month",
    enrollment_url: "https://www.avalara.com/",
    affiliate_id: "AVALARA_AFF_001",
    commission_type: "Percentage",
    commission_value: 10,
    is_featured: false,
    is_active: true,
    tags: ["tax", "sales tax", "tax compliance", "automation"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 12
  },
  {
    name: "TaxJar",
    description: "Sales tax automation for e-commerce businesses. Calculate, collect, and file sales tax automatically. Perfect for online sellers.",
    category: "Tax Software",
    provider: "TaxJar",
    pricing_type: "Subscription",
    pricing_info: "Starting at $19/month",
    enrollment_url: "https://www.taxjar.com/",
    affiliate_id: "TAXJAR_AFF_001",
    commission_type: "Percentage",
    commission_value: 12,
    is_featured: false,
    is_active: true,
    tags: ["tax", "sales tax", "e-commerce", "tax automation"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 13
  },
  {
    name: "DocuSign",
    description: "Electronic signature and document management platform. Sign, send, and manage documents digitally. Trusted by millions of businesses.",
    category: "Business Analytics",
    provider: "DocuSign",
    pricing_type: "Subscription",
    pricing_info: "Starting at $15/user/month",
    enrollment_url: "https://www.docusign.com/",
    affiliate_id: "DOCUSIGN_AFF_001",
    commission_type: "Recurring",
    commission_value: 8,
    is_featured: false,
    is_active: true,
    tags: ["document management", "e-signatures", "contracts", "paperless"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 14
  },
  {
    name: "Shippo",
    description: "Shipping software for e-commerce businesses. Compare rates, print labels, and track shipments across multiple carriers. Save time and money on shipping.",
    category: "Business Analytics",
    provider: "Shippo",
    pricing_type: "Freemium",
    pricing_info: "Free plan available, paid plans from $10/month",
    enrollment_url: "https://goshippo.com/",
    affiliate_id: "SHIPPO_AFF_001",
    commission_type: "Fixed Amount",
    commission_value: 20,
    is_featured: false,
    is_active: true,
    tags: ["shipping", "e-commerce", "logistics", "label printing"],
    integration_type: "Link",
    views: 0,
    enrollments: 0,
    order: 15
  },
  {
    name: "Twilio",
    description: "Cloud communications platform for businesses. Send SMS, make voice calls, and build communication features into your applications.",
    category: "Business Analytics",
    provider: "Twilio",
    pricing_type: "Paid",
    pricing_info: "Pay-as-you-go pricing",
    enrollment_url: "https://www.twilio.com/",
    affiliate_id: "TWILIO_AFF_001",
    commission_type: "Percentage",
    commission_value: 5,
    is_featured: false,
    is_active: true,
    tags: ["communications", "sms", "voice", "api", "developer tools"],
    integration_type: "API",
    views: 0,
    enrollments: 0,
    order: 16
  }
];

async function seedProducts() {
  try {
    console.log('Starting to seed fintech products...');
    console.log('PocketBase URL: https://pocketbase.captain.sebipay.com\n');

    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    const userEmail = 'athul@gmail.com';
    const userPassword = 'Tyler!123';

    let isAuthenticated = false;

    if (adminEmail && adminPassword) {
      try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log('✓ Authenticated as admin');
        isAuthenticated = true;
      } catch (authError) {
        console.log('⚠ Admin authentication failed, trying user auth...');
      }
    }

    if (!isAuthenticated && userEmail && userPassword) {
      try {
        await pb.collection('users').authWithPassword(userEmail, userPassword);
        console.log('✓ Authenticated as user');
        isAuthenticated = true;
      } catch (authError) {
        console.log('⚠ User authentication failed');
      }
    }

    if (!isAuthenticated) {
      console.log('\n⚠ No authentication provided.');
      console.log('Collection rules require authentication (@request.auth.id != "")');
      console.log('\nPlease provide credentials:');
      console.log('Option 1 - Admin (recommended):');
      console.log('   export PB_ADMIN_EMAIL="your-admin@email.com"');
      console.log('   export PB_ADMIN_PASSWORD="your-admin-password"');
      console.log('\nOption 2 - Regular User:');
      console.log('   export PB_USER_EMAIL="your-user@email.com"');
      console.log('   export PB_USER_PASSWORD="your-user-password"');
      console.log('\nThen run: npm run seed:fintech\n');
      throw new Error('Authentication required');
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
      try {
        const existing = await pb.collection('fintech_products').getList(1, 1, {
          filter: `name="${product.name}"`
        });

        if (existing.items.length > 0) {
          const existingProduct = existing.items[0];
          try {
            await pb.collection('fintech_products').update(existingProduct.id, product);
            console.log(`↻ Updated: ${product.name}`);
            updated++;
          } catch (updateError) {
            console.log(`⊘ Skipping ${product.name} - update failed: ${updateError.message}`);
            skipped++;
          }
          continue;
        }

        await pb.collection('fintech_products').create(product);
        console.log(`✓ Created: ${product.name} (${product.category})`);
        created++;
      } catch (error) {
        console.error(`✗ Failed to create ${product.name}:`, error.message);
        if (error.response && error.response.data) {
          console.error(`   Details:`, JSON.stringify(error.response.data, null, 2));
        }
        errors++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Seeding complete!`);
    console.log(`   Created: ${created} products`);
    console.log(`   Updated: ${updated} products`);
    console.log(`   Skipped: ${skipped} products`);
    if (errors > 0) {
      console.log(`   Errors: ${errors} products`);
    }
    console.log(`   Total: ${created + updated + skipped} products processed`);
    console.log(`${'='.repeat(50)}\n`);

    const categorySummary = {};
    products.forEach(p => {
      categorySummary[p.category] = (categorySummary[p.category] || 0) + 1;
    });

    console.log('Products by category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
  } catch (error) {
    console.error('\n✗ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

