import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory (2 levels up from backend/config)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not configured in root .env. Using in-memory fallback.');
    return null;
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export default { getSupabaseClient };
