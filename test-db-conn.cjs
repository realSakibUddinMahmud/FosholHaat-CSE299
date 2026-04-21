const { Client } = require('pg');

const password = 'FHcseDev2026pGx9';
const projectRef = 'ukilnupngapaftxvjcme';

async function test(label, config) {
  const c = new Client(config);
  try {
    await c.connect();
    const res = await c.query('SELECT current_user, now()');
    console.log(label, 'SUCCESS:', JSON.stringify(res.rows));
    await c.end();
  } catch (e) {
    console.error(label, 'FAIL:', e.message);
  }
}

(async () => {
  // Method 1: options parameter for project routing
  await test('POOLER-OPTIONS', {
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    options: `project=${projectRef}`,
  });

  // Method 2: Full connection string with sslmode
  await test('POOLER-CONNSTR', {
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  // Method 3: Port 6543 (transaction mode) 
  await test('POOLER-TXN-6543', {
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ukilnupngapaftxvjcme',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  // Method 4: Try each resolved IPv4 directly for pooler
  const ips = ['54.255.219.82', '52.74.252.201', '52.77.146.31'];
  for (const ip of ips) {
    await test(`POOLER-IP-${ip}`, {
      host: ip,
      port: 5432,
      user: 'postgres.ukilnupngapaftxvjcme',
      password,
      database: 'postgres',
      ssl: { 
        rejectUnauthorized: false,
        servername: 'aws-0-ap-southeast-1.pooler.supabase.com',
      },
      connectionTimeoutMillis: 10000,
    });
  }
})();
