import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getStoreId } from "@/lib/supabase";
import { generateMenuSlug } from "@/types/menu";

export const dynamic = "force-dynamic";

// GET - List all categories with item counts
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("menu_categories")
      .select(`
        *,
        menu_items(count)
      `)
      .eq("store_id", storeId)
      .order("display_order", { ascending: true });

    if (error) throw error;

    // Transform to include item_count
    const categories = (data || []).map((cat) => ({
      ...cat,
      item_count: cat.menu_items?.[0]?.count || 0,
      menu_items: undefined,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || generateMenuSlug(body.name);

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("menu_categories")
      .select("display_order")
      .eq("store_id", storeId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const displayOrder = (maxOrder?.display_order || 0) + 1;

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        store_id: storeId,
        name: body.name,
        slug,
        description: body.description || null,
        image_url: body.image_url || null,
        display_order: displayOrder,
        is_active: body.is_active !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating menu category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
