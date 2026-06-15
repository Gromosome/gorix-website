import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { bugReportSchema } from "@/lib/bug-report-schema";
import { content } from "@/lib/content";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

    const decodedToken = await getAdminAuth().verifyIdToken(authorization.slice(7), true);
    if (decodedToken.firebase.sign_in_provider !== "github.com") return NextResponse.json({ error: content.forms.bugReport.authError }, { status: 403 });

    const json: unknown = await request.json();
    const parsed = bugReportSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid bug report." }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ error: "Unable to submit this report." }, { status: 400 });

    const report = Object.fromEntries(
      Object.entries(parsed.data).filter(([key]) => key !== "website"),
    );
    const collection = process.env.BUG_REPORT_COLLECTION ?? "bugReports";
    const reference = await getAdminFirestore().collection(collection).add({
      ...report,
      reporterUid: decodedToken.uid,
      reporterEmail: decodedToken.email ?? "",
      reporterProvider: decodedToken.firebase.sign_in_provider,
      status: "new",
      source: "gorix-website",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: reference.id }, { status: 201 });
  } catch (error) {
    console.error("Bug report submission failed", error);
    return NextResponse.json({ error: "The report service is temporarily unavailable." }, { status: 500 });
  }
}
