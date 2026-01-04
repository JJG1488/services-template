import { NextRequest, NextResponse } from "next/server";
import { createFreshAdminClient, getStoreId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET - Public portfolio list with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createFreshAdminClient();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Parse query params
    const serviceId = request.nextUrl.searchParams.get("service");
    const category = request.nextUrl.searchParams.get("category");
    const featured = request.nextUrl.searchParams.get("featured");

    let query = supabase
      .from("portfolio_items")
      .select(`
        *,
        services(name, slug)
      `)
      .eq("store_id", storeId)
      .eq("is_active", true)
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

    // Transform for public consumption
    const items = (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      client_name: item.client_name,
      description: item.description,
      images: item.images || [],
      video_url: item.video_url,
      results: item.results,
      tags: item.tags || [],
      is_featured: item.is_featured,
      before_image_url: item.before_image_url,
      after_image_url: item.after_image_url,
      external_url: item.external_url,
      project_date: item.project_date,
      category: item.category,
      testimonial: item.testimonial,
      service_name: item.services?.name,
      service_slug: item.services?.slug,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
