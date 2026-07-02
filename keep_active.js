const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (match[1] === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = value;
      } else if (match[1] === 'SUPABASE_SERVICE_ROLE_KEY') {
        supabaseServiceKey = value;
      }
    }
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase environment variables not found.');
  process.exit(1);
}

function pingSupabase() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running keep-active ping query to Supabase PostgREST root...`);

  const url = new URL(`${supabaseUrl}/rest/v1/`);
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  };

  const req = https.request(options, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[${timestamp}] Ping successful! Response status: ${res.statusCode}. Supabase is active.`);
      process.exit(0);
    } else {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.error(`[${timestamp}] Ping failed with status ${res.statusCode}:`, data);
        process.exit(1);
      });
    }
  });

  req.on('error', (error) => {
    console.error(`[${timestamp}] Network error:`, error.message);
    process.exit(1);
  });

  req.end();
}

pingSupabase();
