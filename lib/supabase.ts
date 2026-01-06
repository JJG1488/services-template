import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

// Check if we're in a build environment without runtime env vars
export function isBuildTime(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl === "";
}

// Client for public operations (uses anon key, subject to RLS)
export function getSupabase(): SupabaseClient | null {
  if (isBuildTime()) {
    return null as unknown as SupabaseClient;
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Admin client for privileged operations (uses service role key, bypasses RLS)
// CACHED - Use createFreshAdminClient() when stale data is a concern
export function getSupabaseAdmin(): SupabaseClient | null {
  if (isBuildTime()) {
    return null as unknown as SupabaseClient;
  }

  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Require service role key for admin operations - do NOT fall back to anon key
    // as this causes silent RLS failures that are hard to debug
    if (!serviceRoleKey) {
      console.error(
        "[Supabase] CRITICAL: SUPABASE_SERVICE_ROLE_KEY not configured. " +
        "Admin operations (services, settings) will fail. " +
        "Please set this environment variable in your deployment."
      );
      return null;
    }
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey);
  }
  return supabaseAdminInstance;
}

export function getStoreId(): string {
  return process.env.NEXT_PUBLIC_STORE_ID || "";
}

/**
 * Create a fresh admin client (no caching)
 * Use when stale data is a problem - settings, services, portfolio items
 *
 * This bypasses Supabase PostgREST caching by:
 * 1. Creating a new client instance (no singleton)
 * 2. Setting cache: 'no-store' on fetch requests
 * 3. Adding Cache-Control headers to prevent HTTP caching
 */
export function createFreshAdminClient(): SupabaseClient | null {
  if (isBuildTime()) {
    return null;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Require service role key - do NOT fall back to anon key
  if (!serviceRoleKey) {
    console.error(
      "[Supabase] CRITICAL: SUPABASE_SERVICE_ROLE_KEY not configured for fresh admin client."
    );
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    global: {
      fetch: (url, options = {}) => {
        const existingHeaders = options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : (options.headers || {});

        return fetch(url, {
          ...options,
          cache: 'no-store',
          headers: {
            ...existingHeaders,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
      },
    },
  });
}
