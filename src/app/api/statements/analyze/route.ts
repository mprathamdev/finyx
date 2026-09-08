import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import fs from "fs/promises";
import path from "path";
import { BANK_STATEMENT_ANALYSIS_SCHEMA, BANK_STATEMENT_PROMPT } from "@/lib/gemini/prompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Resolve user session via Auth Header or Cookies
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

        const { data: { user }, error: authError } = token
            ? await supabase.auth.getUser(token)
            : await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const { statementId } = await req.json();

        if (!statementId) {
            return NextResponse.json({ error: "Statement ID is required" }, { status: 400 });
        }

        // 2. Fetch statement record owned by current user
        const { data: statement, error: fetchErr } = await supabase
            .from("statements")
            .select("*")
            .eq("id", statementId)
            .eq("user_id", user.id)
            .single();

        if (fetchErr || !statement) {
            return NextResponse.json({ error: "Statement record not found" }, { status: 404 });
        }

        // Return early if already processed
        if (statement.status === "completed") {
            return NextResponse.json({ success: true, message: "Already analyzed" });
        }

        // 3. Read physical file from local storage
        const absoluteFilePath = path.isAbsolute(statement.file_path)
            ? statement.file_path
            : path.join(process.cwd(), statement.file_path);

        const pdfBuffer = await fs.readFile(absoluteFilePath);

        // 4. Send file to Gemini using 'gemini-3.6-flash'
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: "application/pdf",
                        data: pdfBuffer.toString("base64"),
                    },
                },
                { text: BANK_STATEMENT_PROMPT },
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: BANK_STATEMENT_ANALYSIS_SCHEMA,
            },
        });

        // Parse result from Gemini
        const result = JSON.parse(response.text || "{}");



        // 5. Verify document validity
        if (!result.is_bank_statement) {
            await supabase
                .from("statements")
                .update({ status: "failed" })
                .eq("id", statementId);

            return NextResponse.json(
                { error: result.rejection_reason || "Uploaded file is not a valid bank statement." },
                { status: 422 }
            );
        }

        // Ensure result is passed as an Object, not stringified
        const { error: insertErr } = await supabase.from("statement_analytics").insert({
            statement_id: statementId,
            user_id: user.id,
            analytics_data: typeof result === "string" ? JSON.parse(result) : result,
        });

        if (insertErr) {
            throw new Error(`Database Error: ${insertErr.message}`);
        }

        // 7. Update statement status to completed
        await supabase
            .from("statements")
            .update({ status: "completed" })
            .eq("id", statementId);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
    }
}