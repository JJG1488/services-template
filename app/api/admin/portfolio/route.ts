import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getStoreId } from "@/lib/supabase";
import { generatePortfolioSlug } from "@/types/portfolio";

export const dynamic = "force-dynamic";

// GET - List all portfolio items
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Check for query params
    const serviceId = request.nextUrl.searchParams.get("service");
    const category = request.nextUrl.searchParams.get("category");
    const featured = request.nextUrl.searchParams.get("featured");

    let query = supabase
      .from("portfolio_items")
      .select(`
        *,
        services(name)
      `)
      .eq("store_id", storeId)
      .order("display_order", { ascending: true });

    if (serviceId) {
      query = query.eq("service_id", serviceId);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform to include service_name
    const items = (data || []).map((item) => ({
      ...item,
      service_name: item.services?.name,
      services: undefined,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

// POST - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || generatePortfolioSlug(body.title);

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("portfolio_items")
      .select("display_order")
      .eq("store_id", storeId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const displayOrder = (maxOrder?.display_order || 0) + 1;

    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        store_id: storeId,
        service_id: body.service_id || null,
        title: body.title,
        slug,
        client_name: body.client_name || null,
        description: body.description || null,
        images: body.images || [],
        video_url: body.video_url || null,
        results: body.results || null,
        tags: body.tags || [],
        is_featured: body.is_featured || false,
        is_active: body.is_active !== false,
        display_order: displayOrder,
        published_at: body.is_active !== false ? new Date().toISOString() : null,
        // Extended fields
        before_image_url: body.before_image_url || null,
        after_image_url: body.after_image_url || null,
        external_url: body.external_url || null,
        project_date: body.project_date || null,
        category: body.category || null,
        testimonial: body.testimonial || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}
