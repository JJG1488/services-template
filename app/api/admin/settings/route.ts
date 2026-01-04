import { NextRequest, NextResponse } from "next/server";
import { createFreshAdminClient, getStoreId } from "@/lib/supabase";
import { verifyAuthFromRequest } from "@/lib/admin-tokens";

export const dynamic = "force-dynamic";

// GET - Get current settings
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!(await verifyAuthFromRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createFreshAdminClient();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Use .limit(1) instead of .single() to avoid PostgREST caching
    const { data: rows, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("store_id", storeId)
      .limit(1);

    const data = rows?.[0] || null;

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    // Return wrapped response
    return NextResponse.json({ settings: data?.settings || {} });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!(await verifyAuthFromRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createFreshAdminClient();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const settings = await request.json();

    // Upsert settings
    const { data, error } = await supabase
      .from("store_settings")
      .upsert(
        {
          store_id: storeId,
          settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (error) throw error;

    // Return wrapped response with success flag
    return NextResponse.json({ success: true, settings: data.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
