import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Initialize Supabase Server Client using environment variables
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore errors from Server Components
            }
          },
        },
      }
    );

    // 1. Get authenticated user from Supabase Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized user session" },
        { status: 401 }
      );
    }

    // 2. Retrieve FormData from the request
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was attached to the request" },
        { status: 400 }
      );
    }

    // 3. Set local filesystem folder path: src/uploads/[user_id]/
    const userId = user.id;
    const targetFolder = path.join(process.cwd(), "src", "uploads", userId);

    // Create user directory if it doesn't exist
    await fs.mkdir(targetFolder, { recursive: true });

    // 4. Generate unique filename and write to local disk
    const extension = path.extname(file.name) || ".pdf";
    const serverFileName = `${crypto.randomUUID()}${extension}`;
    const fullDiskPath = path.join(targetFolder, serverFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(fullDiskPath, buffer);

    // Local relative file path string for DB record
    const relativeFilePath = `src/uploads/${userId}/${serverFileName}`;

    // 5. Insert statement record into Supabase PostgreSQL database table
    const { data: dbStatement, error: dbError } = await supabase
      .from("statements")
      .insert({
        user_id: userId,
        original_file_name: file.name,
        server_file_name: serverFileName,
        file_path: relativeFilePath,
        status: "processing",
      })
      .select()
      .single();

    if (dbError) {
      // Clean up the locally saved file if database row creation fails
      await fs.unlink(fullDiskPath).catch(() => null);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, statement: dbStatement },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}