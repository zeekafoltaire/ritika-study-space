

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// The user's Supabase credentials, permanently set as requested.
const supabaseUrl = 'https://wlnnmngoilymopxpslbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsbm5tbmdvaWx5bW9weHBzbGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMzM4ODYsImV4cCI6MjA2OTcwOTg4Nn0.sR3hn-yttWGxjvYxGQ5Y8dG9Ue6PbDZfiUsKIq-PfdQ';

// Create and export the Supabase client.
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);