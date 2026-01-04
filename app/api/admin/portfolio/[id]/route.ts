import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getStoreId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET - Get single portfolio item
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
      .from("portfolio_items")
      .select(`
        *,
        services(name)
      `)
      .eq("store_id", storeId)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    // Transform
    const item = {
      ...data,
      service_name: data.services?.name,
      services: undefined,
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 });
  }
}

// PUT - Update portfolio item
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

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are provided
    if (body.service_id !== undefined) updateData.service_id = body.service_id || null;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.client_name !== undefined) updateData.client_name = body.client_name || null;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.video_url !== undefined) updateData.video_url = body.video_url || null;
    if (body.results !== undefined) updateData.results = body.results || null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active;
      // Set published_at when first activating
      if (body.is_active) {
        const { data: existing } = await supabase
          .from("portfolio_items")
          .select("published_at")
          .eq("id", id)
          .single();
        if (existing && !existing.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
    }
    if (body.display_order !== undefined) updateData.display_order = body.display_order;
    // Extended fields
    if (body.before_image_url !== undefined) updateData.before_image_url = body.before_image_url || null;
    if (body.after_image_url !== undefined) updateData.after_image_url = body.after_image_url || null;
    if (body.external_url !== undefined) updateData.external_url = body.external_url || null;
    if (body.project_date !== undefined) updateData.project_date = body.project_date || null;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.testimonial !== undefined) updateData.testimonial = body.testimonial || null;

    const { data, error } = await supabase
      .from("portfolio_items")
      .update(updateData)
      .eq("store_id", storeId)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 });
  }
}

// DELETE - Delete portfolio item
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
      .from("portfolio_items")
      .delete()
      .eq("store_id", storeId)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
