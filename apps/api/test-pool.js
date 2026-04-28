require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg');

const connectionString = process.env.DIRECT_URL;
const parsedUrl = new URL(connectionString);
parsedUrl.searchParams.delete('sslmode');

const pool = new Pool({
  connectionString: parsedUrl.toString(),
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Success!', res.rows);
  } catch (e) {
    console.error('Pool Error:', e);
  } finally {
    await pool.end();
  }
}

main();
