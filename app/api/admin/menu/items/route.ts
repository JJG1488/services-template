import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getStoreId } from "@/lib/supabase";
import { generateMenuSlug } from "@/types/menu";

export const dynamic = "force-dynamic";

// GET - List all items, optionally filtered by category
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const categoryId = request.nextUrl.searchParams.get("category");

    let query = supabase
      .from("menu_items")
      .select(`
        *,
        menu_item_variations(*)
      `)
      .eq("store_id", storeId)
      .order("display_order", { ascending: true });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform to include variations
    const items = (data || []).map((item) => ({
      ...item,
      variations: item.menu_item_variations || [],
      menu_item_variations: undefined,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// POST - Create new item
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
      .from("menu_items")
      .select("display_order")
      .eq("store_id", storeId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const displayOrder = (maxOrder?.display_order || 0) + 1;

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        store_id: storeId,
        category_id: body.category_id || null,
        name: body.name,
        slug,
        description: body.description || null,
        price: body.price || null,
        price_note: body.price_note || null,
        image_url: body.image_url || null,
        dietary_tags: body.dietary_tags || [],
        allergens: body.allergens || [],
        spice_level: body.spice_level || null,
        calories: body.calories || null,
        is_featured: body.is_featured || false,
        is_available: body.is_available !== false,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (error) throw error;

    // If variations are provided, insert them
    if (body.variations && body.variations.length > 0) {
      const variations = body.variations.map((v: { name: string; price: number; description?: string; is_default?: boolean }, i: number) => ({
        menu_item_id: data.id,
        name: v.name,
        price: v.price,
        description: v.description || null,
        is_default: v.is_default || false,
        display_order: i,
      }));

      await supabase.from("menu_item_variations").insert(variations);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
