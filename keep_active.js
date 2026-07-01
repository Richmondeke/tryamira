const fs = require('fs');
const path = require('path');

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

async function pingSupabase() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running keep-active ping query to Supabase PostgREST root...`);
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      console.log(`[${timestamp}] Ping successful! Response status: ${response.status}. Supabase is active.`);
    } else {
      const errorText = await response.text();
      console.error(`[${timestamp}] Ping failed with status ${response.status}:`, errorText);
      process.exit(1);
    }
  } catch (error) {
    console.error(`[${timestamp}] Network or fetch error:`, error.message);
    process.exit(1);
  }
}

pingSupabase();
