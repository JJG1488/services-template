import { NextResponse } from "next/server";
import { createFreshAdminClient, getStoreId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET - Get full menu with categories and items (public)
export async function GET() {
  try {
    const supabase = createFreshAdminClient();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Fetch categories with items
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select(`
        *,
        menu_items(
          *,
          menu_item_variations(*)
        )
      `)
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (catError) throw catError;

    // Fetch PDFs
    const { data: pdfs, error: pdfError } = await supabase
      .from("menu_pdfs")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (pdfError) throw pdfError;

    // Transform data
    const transformedCategories = (categories || []).map((cat) => ({
      ...cat,
      items: (cat.menu_items || [])
        .filter((item: { is_available: boolean }) => item.is_available)
        .map((item: { menu_item_variations?: unknown[] }) => ({
          ...item,
          variations: item.menu_item_variations || [],
          menu_item_variations: undefined,
        }))
        .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order),
      menu_items: undefined,
    }));

    return NextResponse.json({
      categories: transformedCategories,
      pdfs: pdfs || [],
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
