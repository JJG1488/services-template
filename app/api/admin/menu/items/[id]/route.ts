import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getStoreId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET - Get single item with variations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_item_variations(*),
        menu_categories(name)
      `)
      .eq("store_id", storeId)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Transform
    const item = {
      ...data,
      variations: data.menu_item_variations || [],
      category_name: data.menu_categories?.name,
      menu_item_variations: undefined,
      menu_categories: undefined,
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// PUT - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        category_id: body.category_id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        price_note: body.price_note,
        image_url: body.image_url,
        dietary_tags: body.dietary_tags || [],
        allergens: body.allergens || [],
        spice_level: body.spice_level,
        calories: body.calories,
        is_featured: body.is_featured,
        is_available: body.is_available,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update variations if provided
    if (body.variations !== undefined) {
      // Delete existing variations
      await supabase
        .from("menu_item_variations")
        .delete()
        .eq("menu_item_id", id);

      // Insert new variations
      if (body.variations.length > 0) {
        const variations = body.variations.map((v: { name: string; price: number; description?: string; is_default?: boolean }, i: number) => ({
          menu_item_id: id,
          name: v.name,
          price: v.price,
          description: v.description || null,
          is_default: v.is_default || false,
          display_order: i,
        }));

        await supabase.from("menu_item_variations").insert(variations);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE - Delete item (variations cascade deleted)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("store_id", storeId)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
