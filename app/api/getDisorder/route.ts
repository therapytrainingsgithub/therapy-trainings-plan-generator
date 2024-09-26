import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { data, error } = await supabase.from("disorders").select("*");

    if (error) {
      console.error("Error fetching session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
